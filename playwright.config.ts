import { defineConfig, devices } from '@playwright/test';

const pnpm = 'npx pnpm@9.15.0';

const includeDocsVrt = Boolean(process.env.DOCS_VRT || process.env.CI);
const useStaticStorybook = Boolean(process.env.STORYBOOK_STATIC || process.env.CI);

const storybookServer = useStaticStorybook
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
    ...(includeDocsVrt
      ? [
          {
            name: 'docs-chromium',
            testMatch: /docs\.spec\.ts/,
            use: {
              ...devices['Desktop Chrome'],
              baseURL: 'http://localhost:3000',
            },
          },
        ]
      : []),
  ],
  webServer: includeDocsVrt ? [storybookServer, docsServer] : storybookServer,
});