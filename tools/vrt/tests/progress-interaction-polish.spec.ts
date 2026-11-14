import { test, expect } from '../fixtures';
import { storyUrl } from '../storybook-url';

const story = storyUrl('foundations-progress-geometry--geometry');

test.beforeEach(async ({ page }) => {
  await page.goto(story);
  await page.getByTestId('wavy-progress').waitFor();
});

test('wavy stroke covers half the track and follows a resized container', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const progress = page.getByTestId('wavy-progress');
  const coverageError = () =>
    progress.evaluate((root) => {
      const path = root.querySelector('path')!;
      const bounds = path.getBBox();
      const stroke = parseFloat(getComputedStyle(path).strokeWidth);
      return Math.abs(bounds.width + stroke - root.getBoundingClientRect().width / 2);
    });
  await expect.poll(coverageError).toBeLessThan(0.1);
  const before = (await progress.boundingBox())!.width;
  await page.getByRole('slider', { name: 'Track width' }).fill('160');
  await expect.poll(async () => (await progress.boundingBox())!.width).toBe(160);
  expect(before).toBeGreaterThan(160);
  await expect.poll(coverageError).toBeLessThan(0.1);
});

test('complete progress and meter tracks stay inside a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.getByRole('slider', { name: 'Progress value' }).fill('100');
  for (const id of ['flat-progress', 'wavy-progress', 'meter']) {
    const root = page.getByTestId(id);
    await expect(root).toHaveAttribute('aria-valuenow', '100');
    const overflow = await root.evaluate((element) => {
      const rootBounds = element.getBoundingClientRect();
      return Array.from(element.querySelectorAll('*')).some((child) => {
        let bounds = child.getBoundingClientRect();
        // Firefox expands path client rects by the miter limit even for a straight line.
        // Measure the actual complete stroke instead of that conservative paint bound.
        if (child instanceof SVGPathElement) {
          const box = child.getBBox();
          const matrix = child.getScreenCTM()!;
          const halfStroke = parseFloat(getComputedStyle(child).strokeWidth) / 2;
          const start = new DOMPoint(box.x - halfStroke, box.y - halfStroke).matrixTransform(
            matrix,
          );
          const end = new DOMPoint(
            box.x + box.width + halfStroke,
            box.y + box.height + halfStroke,
          ).matrixTransform(matrix);
          bounds = new DOMRect(start.x, start.y, end.x - start.x, end.y - start.y);
        }
        if (!bounds.width || !bounds.height) return false;
        return bounds.left < rootBounds.left - 0.5 || bounds.right > rootBounds.right + 0.5;
      });
    });
    expect(overflow, id).toBe(false);
  }
});

test('changing the OS motion preference stops mounted circular CSS animations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const id of ['small-indeterminate-circle', 'large-indeterminate-circle']) {
    await expect(page.getByTestId(id).locator('circle').last()).toHaveCSS(
      'animation-name',
      'm3-progress-spin',
    );
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const id of ['small-indeterminate-circle', 'large-indeterminate-circle']) {
    await expect(page.getByTestId(id).locator('circle').last()).toHaveCSS('animation-name', 'none');
  }
});

test('zero progress paints neither a wavy stroke nor a circular start dot', async ({ page }) => {
  await page.getByRole('slider', { name: 'Progress value' }).fill('0');
  await expect(page.getByTestId('wavy-progress')).toHaveAttribute('aria-valuenow', '0');
  await expect(page.getByTestId('wavy-progress').locator('path')).toHaveAttribute('d', '');
  await expect(page.getByTestId('flat-circle').locator('circle').last()).toHaveCSS(
    'visibility',
    'hidden',
  );
});
