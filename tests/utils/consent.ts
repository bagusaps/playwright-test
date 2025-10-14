import { expect, Page } from '@playwright/test';

export async function acceptCookiesIfPresent(page: Page) {
  const btn = page.getByRole('button', { name: /i agree/i });
  if (await btn.isVisible()) {
    await btn.click();
    await expect(btn).toBeHidden({ timeout: 5000 });
  }
}
