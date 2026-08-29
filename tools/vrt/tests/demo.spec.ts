import { test, expect } from '@playwright/test';
import { OVERVIEW_STORY, storyUrl, VRT_MATRIX } from '../storybook-url';

/** Representative component stories beyond the gallery overview. */
const COMPONENT_STORY_VRT = [
  {
    storyId: 'actions-button--variants',
    name: 'button',
    ready: (page: import('@playwright/test').Page) =>
      page.getByRole('button', { name: 'Filled' }).waitFor(),
  },
  {
    storyId: 'containment-dialog--variants',
    name: 'dialog',
    ready: (page: import('@playwright/test').Page) =>
      page.getByRole('button', { name: 'Basic dialog' }).waitFor(),
  },
  {
    storyId: 'navigation-adaptive-navigation--storybookdemo',
    name: 'adaptive-navigation',
    ready: (page: import('@playwright/test').Page) =>
      page.getByRole('tablist', { name: 'Navigation bar' }).waitFor({ state: 'visible' }),
    screenshot: (page: import('@playwright/test').Page) =>
      page.getByRole('tablist', { name: 'Navigation bar' }),
  },
] as const;

for (const { scheme, contrast, direction, name } of VRT_MATRIX) {
  test(`VRT: ${name}`, async ({ page }) => {
    await page.goto(
      storyUrl(OVERVIEW_STORY, { scheme, contrast, direction, seed: '#6750A4' }),
    );
    await page.getByTestId('demo-root').waitFor();
    await expect(page.getByTestId('demo-root')).toHaveScreenshot(`${name}.png`, {
      mask: [page.getByTestId('demo-feedback')],
    });
  });
}

test('overview story renders', async ({ page }) => {
  await page.goto(storyUrl(OVERVIEW_STORY));
  await expect(page.getByRole('heading', { name: 'M3UI Component Gallery' })).toBeVisible();
  await expect(page.getByTestId('demo-buttons')).toBeVisible();
  await expect(page.getByTestId('demo-phase3-nav')).toBeVisible();
  await expect(page.getByTestId('demo-nav-bar-compact')).toBeVisible();
  await expect(page.getByTestId('demo-carousel-compact')).toBeVisible();
  await expect(page.getByTestId('demo-phase4')).toBeVisible();
  await expect(page.getByTestId('demo-phase5')).toBeVisible();
});

test('button story interaction', async ({ page }) => {
  await page.goto(storyUrl('actions-button--variants'));
  const filled = page.locator('#storybook-root').getByRole('button', { name: 'Filled' });
  await expect(filled).toBeVisible({ timeout: 15_000 });
  // PressableShell ripple overlay can intercept pointer events during animation.
  await filled.click({ force: true });
});

for (const story of COMPONENT_STORY_VRT) {
  test(`Story VRT: ${story.name}`, async ({ page }) => {
    await page.goto(
      storyUrl(story.storyId, { scheme: 'light', contrast: 0, direction: 'ltr', seed: '#6750A4' }),
    );
    await story.ready(page);
    const target =
      'screenshot' in story
        ? story.screenshot(page)
        : page.locator('#storybook-root');
    await expect(target).toHaveScreenshot(`story-${story.name}-light.png`);
  });
}
