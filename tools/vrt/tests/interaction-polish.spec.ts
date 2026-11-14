import { test, expect } from '../fixtures';
import { storyUrl } from '../storybook-url';

const story = storyUrl('foundations-interaction-polish--states');

test.beforeEach(async ({ page }) => {
  await page.goto(story);
  await page.getByRole('button', { name: 'State layer', exact: true }).waitFor();
});

test('state layers render hover, keyboard focus, and press without stacking', async ({ page }) => {
  const host = page.getByTestId('state-layer');
  const button = host.getByRole('button');
  const hover = host.locator('.m3-lib-state-layer--hover');
  const focus = host.locator('.m3-lib-state-layer--focus');
  const press = host.locator('.m3-lib-state-layer--pressed');
  await expect(hover).toHaveCSS('opacity', '0');
  await button.hover();
  await expect(hover).toHaveCSS('opacity', '0.08');
  await button.focus();
  await expect(focus).toHaveCSS('opacity', '0.1');
  await expect(hover).toHaveCSS('opacity', '0');
  await page.mouse.down();
  await expect(press).toHaveCSS('opacity', '0.1');
  await expect(focus).toHaveCSS('opacity', '0');
  await page.mouse.up();
  await expect(page.getByTestId('disabled-layer').locator('.m3-lib-state-layer')).toHaveCount(0);
});

test('toggle icon buttons receive keyboard focus rings and press morphs', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Favorite' });
  await page.getByRole('button', { name: 'Pressable', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(toggle).toBeFocused();
  const ring = toggle
    .locator('xpath=ancestor::*[contains(@class,"m3-focus-ring-host")]')
    .locator('.m3-focus-ring');
  await expect(ring).toHaveAttribute('data-visible', 'true');
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
});

test('narrow, default, and wide icon buttons keep their distinct widths', async ({ page }) => {
  const widths = await Promise.all(
    ['narrow', 'default', 'wide'].map(async (name) => {
      const bounds = await page.getByRole('button', { name, exact: true }).boundingBox();
      return bounds!.width;
    }),
  );
  expect(widths[0]).toBeLessThan(widths[1]);
  expect(widths[1]).toBeLessThan(widths[2]);
});

test('moving focus during a keyboard press restores the resting shape', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Pressable', exact: true });
  const shell = page.getByTestId('pressable');
  const rest = await shell.evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  await button.focus();
  await page.keyboard.down('Space');
  await expect
    .poll(() => shell.evaluate((el) => getComputedStyle(el).borderTopLeftRadius))
    .not.toBe(rest);
  await page.keyboard.press('Tab');
  await page.keyboard.up('Space');
  await expect
    .poll(() => shell.evaluate((el) => getComputedStyle(el).borderTopLeftRadius))
    .toBe(rest);
});

test('zoomed ripples end at the visual center of the control', async ({ page }) => {
  const host = page.getByTestId('zoomed');
  const button = host.getByRole('button');
  await button.hover();
  await page.mouse.down();
  const geometry = await host.locator('.m3-ripple-surface').evaluate((el) => {
    const animation = el
      .getAnimations({ subtree: true })
      .find((a) => (a.effect as KeyframeEffect).getKeyframes().some((frame) => 'width' in frame));
    const frames = (animation!.effect as KeyframeEffect).getKeyframes();
    const last = frames[frames.length - 1];
    const rect = el.getBoundingClientRect();
    return {
      x: new DOMMatrix(String(last.transform)).m41,
      y: new DOMMatrix(String(last.transform)).m42,
      size: parseFloat(String(last.width)),
      width: rect.width / 2,
      height: rect.height / 2,
    };
  });
  expect(Math.abs(geometry.x + geometry.size / 2 - geometry.width / 2)).toBeLessThan(0.5);
  expect(Math.abs(geometry.y + geometry.size / 2 - geometry.height / 2)).toBeLessThan(0.5);
  await page.mouse.up();
});

test('reduced motion removes spatial ripple growth and fades', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const host = page.getByTestId('pressable');
  await host.getByRole('button').hover();
  await page.mouse.down();
  const animation = await host.locator('.m3-ripple-surface').evaluate((el) => {
    const effect = el
      .getAnimations({ subtree: true })
      .find((a) => (a.effect as KeyframeEffect).getKeyframes().some((frame) => 'width' in frame))!
      .effect as KeyframeEffect;
    return {
      duration: effect.getTiming().duration,
      transforms: effect.getKeyframes().map((frame) => frame.transform),
      transition: getComputedStyle(el, '::after').transitionDuration,
    };
  });
  expect(animation.duration).toBe(0);
  expect(new Set(animation.transforms).size).toBe(1);
  expect(parseFloat(animation.transition)).toBeLessThanOrEqual(0.00001);
  await page.mouse.up();
});

test('keyboard use restores a focus ring after clicking the same control', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Pressable', exact: true });
  await button.click();
  const ring = button
    .locator('xpath=ancestor::*[contains(@class,"m3-focus-ring-host")]')
    .locator('.m3-focus-ring');
  await expect(ring).not.toHaveAttribute('data-visible', 'true');
  await page.keyboard.press('Space');
  await expect(ring).toHaveAttribute('data-visible', 'true');
});

test('component color aliases resolve within each provider theme', async ({ page }) => {
  await page.goto(storyUrl('foundations-interaction-polish--theming'));
  const colors = [];
  for (const name of ['Dark purple', 'Light teal']) {
    const colorsForButton = await page.getByRole('button', { name, exact: true }).evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        component: style.getPropertyValue('--md-comp-filled-button-container-color').trim(),
        system: style.getPropertyValue('--md-sys-color-primary').trim(),
      };
    });
    expect(colorsForButton.component).toBe(colorsForButton.system);
    colors.push(colorsForButton.component);
  }
  expect(colors[0]).not.toBe(colors[1]);
});
