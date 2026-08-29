import { defineConfig, devices } from '@playwright/test';

const docsServer = process.env.DOCS_STATIC
  ? {
      command: 'npx pnpm@9.15.0 --filter @m3ui/docs start -- --port 3000',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    }
  : {
      command: 'npx pnpm@9.15.0 --filter @m3ui/docs dev -- --port 3000',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    };

export default defineConfig({
  testDir: './tools/vrt/tests',
  snapshotPathTemplate:
    '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  projects: [
    {
      name: 'docs-chromium',
      testMatch: /docs\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },
  ],
  webServer: docsServer,
});
