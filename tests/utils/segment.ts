// utils/segment.ts
import { expect, Page } from '@playwright/test';

export async function interceptSegmentT(page: Page) {
  const pending: any[] = [];

  const flush = async () => {
    if (!pending.length) return;
    try {
      await page.evaluate(
        (events) => {
          (window as any).__segT = (window as any).__segT || [];
          (window as any).__segT.push(...events);
        },
        pending.splice(0, pending.length),
      );
    } catch {}
  };

  await page.addInitScript(() => {
    (window as any).__segT = (window as any).__segT || [];
  });

  page.on('domcontentloaded', flush);
  page.on('load', flush);

  await page.route(/api\.segment\.io\/v1\/(t|p|batch)/, async (route) => {
    const raw = route.request().postData() ?? '';
    let events: any[] = [];
    try {
      const data = JSON.parse(raw);
      events = Array.isArray(data?.batch) ? data.batch : [data];
    } catch {
      const params = new URLSearchParams(raw);
      const d = params.get('data');
      events = d ? [JSON.parse(d)] : [];
    }
    pending.push(...events);
    await flush();
    await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
  });
}

export async function verifyAnalyticsEventProperties(
  page: Page,
  eventName: string,
  props: Record<string, any>,
  timeoutMs = 7000,
) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const hits: any[] = (await page.evaluate(() => (window as any).__segT || [])) ?? [];
      const matched = hits.find(
        (h) =>
          ['track', 'page'].includes(h?.type) &&
          (h?.event === eventName || h?.name === eventName) &&
          Object.entries(props).every(([k, v]) => h?.properties?.[k] === v),
      );
      if (matched) {
        expect(matched).toBeTruthy();
        return matched;
      }
    } catch {}
    await page.waitForTimeout(250);
  }
}
