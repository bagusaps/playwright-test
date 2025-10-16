import { defineConfig, devices } from '@playwright/test';

const CM_BASE_URL = 'https://v0-cmlookup2.vercel.app/';
const EI_BASE_URL = 'https://www.earnin.com';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
    },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }], ['github']],

  snapshotDir: 'snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{projectName}/{arg}{ext}',

  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    timezoneId: 'Asia/Bangkok',
    locale: 'en-US',
    colorScheme: 'light',
  },

  projects: [
    {
      name: 'CM - Chromium Desktop',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: CM_BASE_URL,
      },
      grep: /@cm/,
    },
    {
      name: 'CM - Safari Mobile',
      use: {
        browserName: 'webkit',
        viewport: { width: 480, height: 920 },
        hasTouch: true,
        deviceScaleFactor: 3,
        baseURL: CM_BASE_URL,
      },
      grep: /@cm/,
    },
    {
      name: 'EI - Chromium Desktop',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: EI_BASE_URL,
      },
      grep: /@earnin/,
    },
    {
      name: 'EI - Safari Mobile',
      use: {
        browserName: 'webkit',
        viewport: { width: 480, height: 920 },
        hasTouch: true,
        deviceScaleFactor: 3,
        baseURL: EI_BASE_URL,
      },
      grep: /@earnin/,
    },
  ],
});
