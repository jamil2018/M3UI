/** Representative docs routes for visual regression. */
export const DOCS_VRT_PAGES = [
  {
    path: '/components',
    name: 'components-index',
    heading: 'Components',
    contentSelector: '#nd-docs-layout article',
  },
  {
    path: '/components/button',
    name: 'button',
    heading: 'Button',
    contentSelector: 'main.doc-page',
  },
  {
    path: '/components/dialog',
    name: 'dialog',
    heading: 'Dialog',
    contentSelector: 'main.doc-page',
  },
] as const;

export const DOCS_VRT_MATRIX = [
  { scheme: 'light', name: 'light' },
  { scheme: 'dark', name: 'dark' },
] as const;

export function docsUrl(path: string): string {
  return path;
}
