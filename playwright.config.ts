import { defineConfig, devices } from '@playwright/test';

const pnpm = 'pnpm';

const includeDocsVrt = process.env.DOCS_VRT !== '0';
const useStaticStorybook = !process.env.VRT_DEV;
const externalStorybookUrl = process.env.STORYBOOK_BASE_URL;

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
  command: `${pnpm} --filter @m3ui/docs ${process.env.VRT_DEV ? 'dev' : 'start'}`,
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 180_000,
};

export default defineConfig({
  testDir: './tools/vrt/tests',
  snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  projects: [
    {
      name: 'storybook-chromium',
      testMatch: /(?:demo|interaction-polish|motion-polish|browser-a11y)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: externalStorybookUrl ?? 'http://localhost:6006',
      },
    },
    ...(includeDocsVrt
      ? [
          {
            name: 'docs-chromium',
            testMatch: /docs\.spec\.ts/,
            snapshotPathTemplate:
              '{testDir}/{testFileDir}/{testFileName}-snapshots/fumadocs-16/{arg}-{projectName}{ext}',
            use: {
              ...devices['Desktop Chrome'],
              baseURL: 'http://localhost:3000',
            },
          },
        ]
      : []),
  ],
  webServer: externalStorybookUrl
    ? includeDocsVrt
      ? docsServer
      : undefined
    : includeDocsVrt
      ? [storybookServer, docsServer]
      : storybookServer,
});
