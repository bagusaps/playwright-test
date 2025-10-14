import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000, // 1 menit per test
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // cegah `test.only` di CI
  retries: process.env.CI ? 2 : 0, // retry otomatis di CI
  workers: process.env.CI ? 2 : undefined, // lebih ringan di CI
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['github'], // integrasi GitHub Actions
  ],
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },

  projects: [
    {
      name: 'Chrome Desktop',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'Safari Mobile',
      use: {
        browserName: 'webkit',
        viewport: { width: 480, height: 920 },
        hasTouch: true,
        deviceScaleFactor: 3,
      },
    },
  ],
});
