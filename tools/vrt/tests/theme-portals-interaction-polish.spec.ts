import { test, expect } from '../fixtures';
import { storyUrl } from '../storybook-url';

for (const viewport of [
  { width: 1000, height: 800 },
  { width: 320, height: 640 },
]) {
  test(`nested themed modal stays inside ${viewport.width}px viewport and exits`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto(storyUrl('foundations-theme-portals--nested-provider'));
    await page.getByRole('button', { name: 'Open themed dialog', exact: true }).click();
    const popup = page.getByRole('dialog');
    await expect(popup).toBeVisible();
    await expect
      .poll(async () => {
        const box = await popup.boundingBox();
        return (
          !!box &&
          box.x >= 0 &&
          box.y >= 0 &&
          box.x + box.width <= viewport.width + 1 &&
          box.y + box.height <= viewport.height + 1
        );
      })
      .toBe(true);
    await expect(popup).toHaveCSS('background-color', 'rgb(30, 70, 60)');
    const scope = popup.locator('xpath=ancestor::*[@data-m3-portal-scope]');
    await expect(scope).toHaveCSS('color-scheme', 'dark');
    await page.getByRole('button', { name: 'Change open dialog theme' }).click();
    await expect(scope).toHaveCSS('color-scheme', 'light');
    await page.getByRole('button', { name: 'Close themed dialog' }).click();
    await expect(popup).toHaveCount(0);
  });
}

for (const viewport of [
  { width: 1000, height: 800 },
  { width: 320, height: 640 },
]) {
  test(`picker overlays fit ${viewport.width}px viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(storyUrl('foundations-theme-portals--overlay-layouts'));
    for (const label of ['Open review date picker', 'Open review time picker']) {
      await page.getByRole('button', { name: label }).click();
      const popup = page.getByRole('dialog');
      await expect(popup).toBeVisible();
      await expect
        .poll(async () => {
          const box = await popup.boundingBox();
          return (
            !!box &&
            box.x >= 0 &&
            box.y >= 0 &&
            box.x + box.width <= viewport.width + 1 &&
            box.y + box.height <= viewport.height + 1
          );
        })
        .toBe(true);
      await page.keyboard.press('Escape');
      await expect(popup).toHaveCount(0);
    }
  });
}

test('tooltip exit remains mounted while animating and honors reduced motion', async ({ page }) => {
  await page.goto(storyUrl('foundations-theme-portals--overlay-layouts'));
  const trigger = page.getByRole('button', { name: 'Review tooltip', exact: true });
  await trigger.hover();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible();
  await expect.poll(() => tooltip.evaluate((node) => getComputedStyle(node).opacity)).toBe('1');
  await page.mouse.move(0, 0);
  await expect
    .poll(
      () =>
        tooltip
          .evaluate((node) =>
            node.getAnimations().some((animation) => animation.playState === 'running'),
          )
          .catch(() => false),
      { intervals: [5] },
    )
    .toBe(true);
  await expect(tooltip).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await trigger.hover();
  await expect(tooltip).toBeVisible();
  expect(await tooltip.evaluate((node) => node.getAnimations().length)).toBe(0);
  await page.mouse.move(0, 0);
  await expect(tooltip).toHaveCount(0);
});

test('snackbar fits a 320px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(storyUrl('foundations-theme-portals--overlay-layouts'));
  await page.getByRole('button', { name: 'Show review snackbar' }).click();
  const snackbar = page.getByText('A responsive snackbar message');
  await expect(snackbar).toBeVisible();
  const box = await snackbar.locator('..').boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(320);
});
