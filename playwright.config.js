// Optional local E2E tests. Install when needed: npx playwright install
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL || 'https://for-my-love-girl.black-sci-official.workers.dev/';

export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  expect: { timeout: 8000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } }
  ]
});
