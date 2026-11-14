import { test, expect } from '../fixtures';
import { mkdir, readFile } from 'node:fs/promises';
import catalog from '../../../packages/react/registry/docs-catalog.json' with { type: 'json' };
import { storyUrl } from '../storybook-url';

for (const scheme of ['light', 'dark']) {
  for (const entry of catalog.entries.filter(
    (e) => e.registryType === 'registry:ui' && e.docs.publicIndex,
  )) {
    test(`design review ${scheme} ${entry.slug}`, async ({ page, browserName }) => {
      await page.setViewportSize({ width: scheme === 'light' ? 1000 : 320, height: 800 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const source = await readFile(
        `apps/storybook/src/stories/generated/${entry.slug}.stories.tsx`,
        'utf8',
      );
      const story = /export const (\w+): Story/
        .exec(source)![1]
        .replace(/[A-Z]/g, (c, i) => (i ? '-' : '') + c.toLowerCase());
      await page.goto(
        storyUrl(`${entry.category}-${entry.slug}--${story}`, { scheme, reducedMotion: true }),
      );
      await expect(page.locator('#storybook-root > *').first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await mkdir(`docs/review-assets/2026-11-14/${browserName}`, { recursive: true });
      await page.screenshot({
        path: `docs/review-assets/2026-11-14/${browserName}/${entry.slug}-${scheme}.png`,
        fullPage: true,
      });
      expect(errors).toEqual([]);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, `${entry.slug} page horizontal overflow`).toBeLessThanOrEqual(1);
    });
  }
}

for (const width of [320, 1000]) {
  test(`review open overlays at ${width}px`, async ({ page, browserName }) => {
    await mkdir(`docs/review-assets/2026-11-14/${browserName}`, { recursive: true });
    await page.setViewportSize({ width, height: 800 });
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
      await page.goto(storyUrl('foundations-usability-review--controls', { reducedMotion: true }));
      await page.getByRole('button', { name: trigger, exact: true }).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect
        .poll(async () => {
          const box = await dialog.boundingBox();
          return (
            box &&
            box.x >= -1 &&
            box.y >= -1 &&
            box.x + box.width <= width + 1 &&
            box.y + box.height <= 801
          );
        })
        .toBeTruthy();
      await expect
        .poll(() => dialog.evaluate((el) => getComputedStyle(el.firstElementChild ?? el).opacity))
        .toBe('1');
      await page.screenshot({
        animations: 'disabled',
        path: `docs/review-assets/2026-11-14/${browserName}/open-${trigger.replaceAll(' ', '-').toLowerCase()}-${width}.png`,
      });
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    }
  });
}
test('slider handles are centered on their tracks', async ({ page, browserName }) => {
  await page.goto(storyUrl('foundations-usability-review--controls', { reducedMotion: true }));
  const root = page.getByTestId('review-slider');
  await expect(root).toBeVisible();
  const geometry = await root.evaluate((el) => {
    const thumb = el.querySelector('[data-slider-thumb]');
    const track = el.querySelector('[data-slider-track]');
    const t = thumb!.getBoundingClientRect();
    const r = track!.getBoundingClientRect();
    return Math.abs(t.y + t.height / 2 - r.y - r.height / 2);
  });
  expect(geometry).toBeLessThan(1);
});
test('clock selector is centered on the selected hour', async ({ page, browserName }) => {
  await page.goto(storyUrl('foundations-usability-review--controls', { reducedMotion: true }));
  await page.getByRole('button', { name: 'Time 24 hour', exact: true }).click();
  await expect
    .poll(async () =>
      page.getByTestId('time-dial').evaluate((el) => {
        const label = el.querySelector('[data-clock-label="0"]')!.getBoundingClientRect();
        const selector = el.querySelector('[data-clock-selector]')!.getBoundingClientRect();
        return Math.hypot(
          label.x + label.width / 2 - selector.x - selector.width / 2,
          label.y + label.height / 2 - selector.y - selector.height / 2,
        );
      }),
    )
    .toBeLessThan(1);
});
test('focused standard icons retain readable contrast', async ({ page, browserName }) => {
  await page.goto(storyUrl('foundations-usability-review--controls', { reducedMotion: true }));
  await page.getByRole('button', { name: 'Date calendar', exact: true }).click();
  const previous = page.getByRole('button', { name: 'Previous month' });
  const next = page.getByRole('button', { name: 'Next month' });
  await previous.focus();
  const restingColor = await next.evaluate((el) => getComputedStyle(el).color);
  await expect(previous).toHaveCSS('color', restingColor);
});
