import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export default async function globalSetup(config: FullConfig) {
    const { baseURL } = config.projects[0].use;
    const browser = await chromium.launch();
  const page = await browser.newPage();

  // 2) Pastikan folder ada & gunakan path absolut yang sama di setup & config
  const storagePath = path.resolve(process.cwd(), 'storage/consented.json');
  fs.mkdirSync(path.dirname(storagePath), { recursive: true });

  // Helper: klik "I Agree" jika muncul (tanpa isVisible({ timeout }))
  const acceptIfVisible = async () => {
    const btn = page.getByRole('button', { name: /i agree/i });
    try {
      await btn.waitFor({ state: 'visible', timeout: 5000 });
      await btn.click({ delay: 100 });
      // beri jeda singkat agar overlay benar-benar hilang
      await page.waitForTimeout(800);
    } catch {
      // tombol tidak muncul dalam 5s → abaikan
    }
  };

  // --- App 1 ---
  await page.goto(`${baseURL}/financial-calculators`, { waitUntil: 'domcontentloaded' });
  await acceptIfVisible();

  // --- App 2 ---
  await page.goto(`${baseURL}/financial-tools/budget-calculator`, { waitUntil: 'domcontentloaded' });
  await acceptIfVisible();

  // 3) Simpan storageState ke path yang sama
  await page.context().storageState({ path: storagePath });
  await browser.close();
}
