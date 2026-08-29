import { test, expect } from '@playwright/test';
import { DOCS_VRT_MATRIX, DOCS_VRT_PAGES, docsUrl } from '../docs-url';

const docContent = (page: import('@playwright/test').Page, selector: string) =>
  page.locator(selector);

for (const pageDef of DOCS_VRT_PAGES) {
  for (const { scheme, name } of DOCS_VRT_MATRIX) {
    test(`Docs VRT: ${pageDef.name} ${name}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(docsUrl(pageDef.path));
      const content = docContent(page, pageDef.contentSelector);
      await content.waitFor();
      await expect(page.getByRole('heading', { name: pageDef.heading, level: 1 })).toBeVisible();
      await expect(content).toHaveScreenshot(`${pageDef.name}-${name}.png`);
    });
  }
}

test('docs button page has live preview', async ({ page }) => {
  await page.goto('/components/button');
  await expect(page.getByRole('heading', { name: 'Button', level: 1 })).toBeVisible();
  await expect(
    docContent(page, 'main.doc-page').getByRole('button', { name: 'Filled', exact: true }),
  ).toBeVisible();
});
