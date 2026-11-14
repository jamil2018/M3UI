import { test, expect } from '../fixtures';
import { OVERVIEW_STORY, PRIMITIVE_VRT_STORIES, storyUrl, VRT_MATRIX } from '../storybook-url';
import docsCatalog from '../../../packages/react/registry/docs-catalog.json' with { type: 'json' };

const PUBLIC_COMPONENTS = docsCatalog.entries.filter(
  (entry) => entry.registryType === 'registry:ui' && entry.docs.publicIndex,
);

/** Representative component stories beyond the gallery overview. */
const COMPONENT_STORY_VRT = [
  {
    storyId: 'actions-button--variants',
    name: 'button',
    ready: (page: import('@playwright/test').Page) =>
      page.getByRole('button', { name: 'filled', exact: true }).waitFor(),
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
      page.getByRole('navigation', { name: 'Navigation bar' }).waitFor({ state: 'visible' }),
    screenshot: (page: import('@playwright/test').Page) =>
      page.getByRole('navigation', { name: 'Navigation bar' }),
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
  const filled = page.locator('#storybook-root').getByRole('button', { name: 'filled', exact: true });
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

for (const storyId of PRIMITIVE_VRT_STORIES) {
  const snapshotName = storyId.replace('foundations-primitives--', 'primitive-') + '-light';
  test(`Primitive VRT: ${snapshotName}`, async ({ page }) => {
    await page.goto(
      storyUrl(storyId, { scheme: 'light', contrast: 0, direction: 'ltr', seed: '#6750A4' }),
    );
    await page.locator('#storybook-root').waitFor();
    if (storyId === 'foundations-primitives--focus-ring-states') {
      await expect(page.locator('#m3-focus-ring-styles')).toHaveCount(1);
      await expect(page.getByRole('button', { name: 'Focused', exact: true })).toBeFocused();
      // Real keyboard events run after React has attached the focus listeners.
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      await expect(page.getByRole('button', { name: 'Focused', exact: true })).toBeFocused();
      await expect(page.locator('.m3-focus-ring[data-visible="true"]')).toBeVisible();
    }
    await expect(page.locator('#storybook-root')).toHaveScreenshot(`${snapshotName}.png`);
  });
}

for (const entry of PUBLIC_COMPONENTS) {
  test(`Conformance VRT: ${entry.slug}`, async ({ page }) => {
    const storyId = `${entry.category}-${entry.slug}--compliance`;
    await page.goto(
      storyUrl(storyId, { scheme: 'light', contrast: 0, direction: 'ltr', reducedMotion: true }),
    );
    const contract = page.locator('#storybook-root .m3-story-compliance');
    await contract.waitFor();
    await expect(contract).toHaveScreenshot(`conformance-${entry.slug}-light.png`, {
      maxDiffPixels: 10,
    });
  });
}