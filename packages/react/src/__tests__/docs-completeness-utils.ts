import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REACT_PKG = join(__dirname, '../..');
export const REPO_ROOT = join(REACT_PKG, '../..');

export const PATHS = {
  registryManifest: join(REACT_PKG, 'registry/registry.json'),
  docsCatalog: join(REACT_PKG, 'registry/docs-catalog.json'),
  registryItemsDir: join(REACT_PKG, 'registry/r'),
  componentsDir: join(REACT_PKG, 'src/components'),
  indexTs: join(REACT_PKG, 'src/index.ts'),
  docsDynamicRoute: join(REPO_ROOT, 'apps/docs/src/app/(docs)/components/[slug]/page.tsx'),
  docsContent: join(REPO_ROOT, 'apps/docs/src/content/components.ts'),
  docsDemos: join(REPO_ROOT, 'apps/docs/src/demos/index.ts'),
  examplesIndex: join(REPO_ROOT, 'packages/examples/src/examples-map.ts'),
  storybookExamples: join(REPO_ROOT, 'apps/storybook/src/examples/components.tsx'),
  storybookCatalog: join(REPO_ROOT, 'apps/storybook/src/examples/catalog.ts'),
  storybookGeneratedDir: join(REPO_ROOT, 'apps/storybook/src/stories/generated'),
  storybookGenerator: join(REPO_ROOT, 'apps/storybook/scripts/generate-stories.mjs'),
  shapesDoc: join(REPO_ROOT, 'apps/docs/src/content/shapes-doc.tsx'),
} as const;

export interface RegistryManifestItem {
  name: string;
  title: string;
  description: string;
}

export interface DocsCatalogManifest {
  entries: Array<{ slug: string; title: string; description: string }>;
}

export function readRegistryManifest(): { items: RegistryManifestItem[] } {
  return JSON.parse(readFileSync(PATHS.registryManifest, 'utf-8')) as {
    items: RegistryManifestItem[];
  };
}

export function readDocsCatalogManifest(): DocsCatalogManifest {
  return JSON.parse(readFileSync(PATHS.docsCatalog, 'utf-8')) as DocsCatalogManifest;
}

export function getRegistryItemSlugs(): Set<string> {
  return new Set(
    readdirSync(PATHS.registryItemsDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, '')),
  );
}

/** Parse `export { Foo, Bar }` lines from packages/react/src/index.ts */
export function getPublicExportNames(): Set<string> {
  const source = readFileSync(PATHS.indexTs, 'utf-8');
  const exports = new Set<string>();
  const exportRe = /export\s*\{\s*([^}]+)\s*\}/g;
  let match: RegExpExecArray | null;
  while ((match = exportRe.exec(source)) !== null) {
    for (const part of match[1].split(',')) {
      const trimmed = part.trim();
      const name = trimmed.split(/\s+/)[0]?.replace(/^type\s+/, '');
      if (name && name !== 'type') exports.add(name);
    }
  }
  return exports;
}

/** Extract top-level keys from `Record<string, …>` object literals in TS source */
export function parseRecordKeys(source: string, recordName: string): Set<string> {
  const anchor = `${recordName}:`;
  const start = source.indexOf(anchor);
  if (start === -1) return new Set();

  const braceStart = source.indexOf('{', start);
  if (braceStart === -1) return new Set();

  let depth = 0;
  let end = braceStart;
  for (let i = braceStart; i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  const block = source.slice(braceStart, end + 1);
  const keys = new Set<string>();
  const keyRe = /^\s+(?:'([^']+)'|([A-Za-z0-9_-]+))\s*:/gm;
  let keyMatch: RegExpExecArray | null;
  while ((keyMatch = keyRe.exec(block)) !== null) {
    keys.add(keyMatch[1] ?? keyMatch[2]!);
  }
  return keys;
}

export function getDocsContentSlugs(): Set<string> {
  const source = readFileSync(PATHS.docsContent, 'utf-8');
  return parseRecordKeys(source, 'COMPONENT_DOCS');
}

export function getDocsContentTitles(): Map<string, string> {
  const source = readFileSync(PATHS.docsContent, 'utf-8');
  const titles = new Map<string, string>();
  const entryRe =
    /(?:^|\n)\s+(?:'([^']+)'|(\w+)):\s*\{[^}]*?\bslug:\s*'([^']+)'[^}]*?\btitle:\s*'([^']*)'/gs;
  let match: RegExpExecArray | null;
  while ((match = entryRe.exec(source)) !== null) {
    const slug = match[3]!;
    titles.set(slug, match[4]!);
  }
  return titles;
}

export function getDocsDemoSlugs(): Set<string> {
  const source = readFileSync(PATHS.docsDemos, 'utf-8');
  return parseRecordKeys(source, 'DEMO_MAP');
}

export function getSharedExampleSlugs(): Set<string> {
  const source = readFileSync(PATHS.examplesIndex, 'utf-8');
  return parseRecordKeys(source, 'EXAMPLES_BY_SLUG');
}

export interface StorybookCatalogEntry {
  slug: string;
  title: string;
  description: string;
  internal?: boolean;
}

/** Parse STORYBOOK_CATALOG array entries without executing TS */
export function getStorybookCatalogEntries(): StorybookCatalogEntry[] {
  const source = readFileSync(PATHS.storybookCatalog, 'utf-8');
  const entries: StorybookCatalogEntry[] = [];
  const entryRe =
    /\{\s*slug:\s*'([^']+)',\s*title:\s*'([^']*)',\s*description:\s*'([^']*)'[^}]*?(internal:\s*true)?[^}]*\}/g;
  let match: RegExpExecArray | null;
  while ((match = entryRe.exec(source)) !== null) {
    entries.push({
      slug: match[1]!,
      title: match[2]!,
      description: match[3]!,
      internal: Boolean(match[4]),
    });
  }
  return entries;
}

export function getGeneratedStorySlugs(): Set<string> {
  if (!existsSync(PATHS.storybookGeneratedDir)) return new Set();
  return new Set(
    readdirSync(PATHS.storybookGeneratedDir)
      .filter((f) => f.endsWith('.stories.tsx') && f !== 'overview.stories.tsx')
      .map((f) => f.replace(/\.stories\.tsx$/, '')),
  );
}

export function formatMissing(label: string, slugs: string[]): string {
  return slugs.length ? `${label}: ${slugs.join(', ')}` : '';
}
