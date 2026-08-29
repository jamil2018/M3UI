import { defineConfig, devices } from '@playwright/test';

const pnpm = 'npx pnpm@9.15.0';

const storybookServer = process.env.STORYBOOK_STATIC
  ? {
      command: `${pnpm} --filter @m3ui/storybook preview`,
      url: 'http://localhost:6006',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    }
  : {
      command: `${pnpm} --filter @m3ui/storybook dev`,
      url: 'http://localhost:6006',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    };

const docsServer = {
  command: `${pnpm} --filter @m3ui/docs start -- --port 3000`,
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
  reporter: [['html', { open: 'never' }], ['list']],
  projects: [
    {
      name: 'storybook-chromium',
      testMatch: /demo\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:6006',
      },
    },
    {
      name: 'docs-chromium',
      testMatch: /docs\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },
  ],
  webServer: process.env.DOCS_VRT ? [storybookServer, docsServer] : storybookServer,
});
