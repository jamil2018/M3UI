import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tools/vrt/tests',
  testMatch: /(?:interaction-polish|motion-polish)\.spec\.ts/,
  fullyParallel: true,
  workers: 4,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:6006' },
  projects: [
    {
      name: 'review-chromium',
      testMatch: /(?:interaction-polish|motion-polish|browser-a11y)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    { name: 'review-firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'review-webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm --filter @m3ui/storybook preview',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
  },
});
