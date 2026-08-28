import { test, expect } from '@playwright/test';

const MATRIX = [
  { scheme: 'light', contrast: '0', direction: 'ltr', name: 'light-default-ltr' },
  { scheme: 'dark', contrast: '0', direction: 'ltr', name: 'dark-default-ltr' },
  { scheme: 'light', contrast: '0.5', direction: 'ltr', name: 'light-medium-ltr' },
  { scheme: 'light', contrast: '1', direction: 'ltr', name: 'light-high-ltr' },
  { scheme: 'light', contrast: '0', direction: 'rtl', name: 'light-default-rtl' },
];

for (const { scheme, contrast, direction, name } of MATRIX) {
  test(`VRT: ${name}`, async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('scheme-select').selectOption(scheme);
    await page.getByTestId('contrast-select').selectOption(contrast);
    await page.getByTestId('direction-select').selectOption(direction);
    await page.getByTestId('demo-root').waitFor();
    await expect(page.getByTestId('demo-root')).toHaveScreenshot(`${name}.png`, {
      mask: [page.getByTestId('demo-feedback')],
    });
  });
}

test('demo page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'M3UI Phase 1–3 Demo' })).toBeVisible();
  await expect(page.getByTestId('demo-buttons')).toBeVisible();
  await expect(page.getByTestId('demo-phase3-nav')).toBeVisible();
  await expect(page.getByTestId('demo-nav-bar-compact')).toBeVisible();
  await expect(page.getByTestId('demo-carousel-compact')).toBeVisible();
  await expect(page.getByTestId('demo-phase4')).toBeVisible();
  await expect(page.getByTestId('demo-phase5')).toBeVisible();
});
