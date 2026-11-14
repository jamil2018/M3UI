import { test, expect, type Locator } from '../fixtures';
import { storyUrl } from '../storybook-url';

async function sample(locator: Locator, property: 'radius' | 'left', duration = 450) {
  return locator.evaluate(
    (el, options) =>
      new Promise<number[]>((resolve) => {
        const start = performance.now();
        const frames: number[] = [];
        function frame() {
          frames.push(
            options.property === 'radius'
              ? parseFloat(getComputedStyle(el).borderTopLeftRadius)
              : el.getBoundingClientRect().left,
          );
          if (performance.now() - start < options.duration) requestAnimationFrame(frame);
          else resolve(frames);
        }
        requestAnimationFrame(frame);
      }),
    { property, duration },
  );
}

test('press shapes interpolate through real spring frames', async ({ page }) => {
  await page.goto(storyUrl('foundations-interaction-polish--states'));
  const shell = page.getByTestId('pressable');
  await shell.getByRole('button').hover();
  const frames = sample(shell, 'radius');
  await page.mouse.down();
  const values = await frames;
  expect(new Set(values.map((v) => v.toFixed(2))).size).toBeGreaterThan(4);
  await page.mouse.up();
});

test.beforeEach(async ({ page }) => {
  await page.goto(storyUrl('foundations-interaction-polish--motion'));
  await page.getByRole('tab', { name: 'Music', exact: true }).waitFor();
});

test('tab indicators move through intermediate positions', async ({ page }) => {
  const target = page.getByTestId('motion-tabs').locator('[role="presentation"]');
  const frames = sample(target, 'left');
  await page.getByRole('tab', { name: 'Audiobooks' }).click();
  const positions = await frames;
  expect(new Set(positions.map((v) => v.toFixed(1))).size).toBeGreaterThan(4);
});

test('expressive toggle morphs to its selected shape and returns', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Morph shape' });
  const shell = button.locator('xpath=ancestor::*[contains(@style,"clip-path")][1]');
  const initial = await shell.evaluate((el) => (el as HTMLElement).style.clipPath);
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  const end = await shell.evaluate(
    (el) =>
      new Promise<string>((resolve) => {
        const start = performance.now();
        function frame() {
          if (performance.now() - start < 700) requestAnimationFrame(frame);
          else resolve((el as HTMLElement).style.clipPath);
        }
        requestAnimationFrame(frame);
      }),
  );
  expect(end).not.toBe(initial);
  await button.click();
  await expect.poll(() => shell.evaluate((el) => (el as HTMLElement).style.clipPath)).toBe(initial);
});

for (const side of ['bottom', 'side'] as const) {
  test(`${side} sheet animates its entire surface and finishes its exit`, async ({ page }) => {
    await page.getByRole('button', { name: `Open ${side} sheet` }).click();
    const sheet = page.getByTestId(`motion-${side}-sheet`);
    await expect(sheet).toBeVisible();
    await expect.poll(() => sheet.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
    await page.keyboard.press('Escape');
    await expect(sheet).toBeAttached();
    await expect(sheet).not.toBeAttached();
  });
}

test('loading motion keeps rotating forwards across a full shape cycle', async ({ page }) => {
  const rotations = await page.getByTestId('motion-loader').evaluate(
    (el) =>
      new Promise<number[]>((resolve) => {
        const rotation = el.firstElementChild!;
        const start = performance.now();
        const angles: number[] = [];
        function frame() {
          const matrix = new DOMMatrix(getComputedStyle(rotation).transform);
          angles.push((Math.atan2(matrix.b, matrix.a) * 180) / Math.PI);
          if (performance.now() - start < 4900) requestAnimationFrame(frame);
          else resolve(angles);
        }
        requestAnimationFrame(frame);
      }),
  );
  const deltas = rotations.slice(1).map((v, i) => ((v - rotations[i]! + 540) % 360) - 180);
  expect(Math.min(...deltas)).toBeGreaterThanOrEqual(-0.1);
  expect(deltas.reduce((sum, v) => sum + v, 0)).toBeGreaterThan(360);
});

test('connected groups fill their segments and redistribute width on press', async ({ page }) => {
  const group = page.getByTestId('motion-group');
  const middle = group.getByRole('button', { name: 'Middle' });
  // Resting layout must be correct immediately; do not wait for an entrance animation.
  const initialWidths = await group
    .getByRole('button')
    .evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().width));
  const original = (await middle.boundingBox())!.width;
  const groupWidth = (await group.boundingBox())!.width;
  for (const width of initialWidths) expect(width).toBeGreaterThan(groupWidth / 3 - 8);
  expect(Math.max(...initialWidths) - Math.min(...initialWidths)).toBeLessThan(1);
  await middle.hover();
  await page.mouse.down();
  await expect.poll(async () => (await middle.boundingBox())!.width).toBeGreaterThan(original + 4);
  await page.mouse.up();
  await expect
    .poll(async () => Math.abs((await middle.boundingBox())!.width - original))
    .toBeLessThan(1);
});
