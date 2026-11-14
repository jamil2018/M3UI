import { test as base, expect } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Firefox's profile argument does not isolate its application-data bookkeeping.
// Keep automation out of personal browser data (macOS 27 protects that directory).
// https://bugzilla.mozilla.org/show_bug.cgi?id=2078511
export const test = base.extend({
  launchOptions: async ({ launchOptions, browserName }, use) => {
    if (browserName !== 'firefox') return use(launchOptions);
    const directory = await mkdtemp(join(tmpdir(), 'm3ui-firefox-'));
    try {
      await use({
        ...launchOptions,
        env: {
          ...process.env,
          ...launchOptions.env,
          MOZ_APP_DATA: join(directory, 'app'),
          MOZ_LOCAL_APP_DATA: join(directory, 'local'),
        },
      });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  },
});
export { expect };
