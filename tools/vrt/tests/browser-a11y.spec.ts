import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import catalog from '../../../packages/react/registry/docs-catalog.json' with { type: 'json' };
import { storyUrl } from '../storybook-url';
const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js', { paths: [require.resolve('vitest-axe')] });
async function audit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => {})),
    );
  });
  await page.addScriptTag({ path: axePath });
  const violations = await page.evaluate(async () => {
    const result = await (
      window as typeof window & {
        axe: {
          run: (
            context: HTMLElement,
            options: unknown,
          ) => Promise<{
            violations: Array<{
              id: string;
              nodes: Array<{ target: string[]; failureSummary: string }>;
            }>;
          }>;
        };
      }
    ).axe.run(document.body, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    });
    return result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    }));
  });
  expect(violations).toEqual([]);
}

for (const scheme of ['light', 'dark']) {
  for (const entry of catalog.entries.filter(
    (e) => e.registryType === 'registry:ui' && e.docs.publicIndex,
  )) {
    test(`browser accessibility ${scheme} ${entry.slug}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: scheme === 'dark' ? 320 : 1000, height: 800 });
      const source = await readFile(
        `apps/storybook/src/stories/generated/${entry.slug}.stories.tsx`,
        'utf8',
      );
      const story = /export const (\w+): Story/
        .exec(source)![1]
        .replace(/[A-Z]/g, (c, i) => (i ? '-' : '') + c.toLowerCase());
      await page.goto(
        storyUrl(`${entry.category}-${entry.slug}--${story}`, { reducedMotion: true, scheme }),
      );
      await expect(page.locator('#storybook-root > *').first()).toBeVisible();
      await audit(page);
    });
  }
}

for (const trigger of [
  'Date calendar',
  'Date input',
  'Date range',
  'Time 12 hour',
  'Time 24 hour',
  'Time input',
  'Open search',
  'Open drawer',
  'Open rail',
  'Open dialog',
  'Open bottom sheet',
  'Open side sheet',
]) {
  test(`browser accessibility overlay ${trigger}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(storyUrl('foundations-usability-review--controls', { reducedMotion: true }));
    await page.getByRole('button', { name: trigger, exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await audit(page);
  });
}
