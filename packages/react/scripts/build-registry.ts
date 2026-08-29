import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CATALOG_CATEGORIES,
  COMPONENT_CATALOG,
  getRegistryUiEntries,
  type ComponentCatalogEntry,
  type DocsCatalogManifest,
} from '../src/catalog/index.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REACT_PKG = join(__dirname, '..');
const REGISTRY_DIR = join(REACT_PKG, 'registry');
const COMPONENTS_DIR = join(REACT_PKG, 'src/components');

/** Workspace import → published npm specifier */
const IMPORT_REWRITES: Record<string, string> = {
  '@m3ui/react': '@m3ui/react',
  '@m3ui/tokens': '@m3ui/tokens',
  '@m3ui/color': '@m3ui/color',
  '@m3ui/motion': '@m3ui/motion',
  '@m3ui/shapes': '@m3ui/shapes',
  '@m3ui/icons': '@m3ui/icons',
};

const INTERNAL_IMPORT_REPLACEMENTS: Array<[RegExp, string]> = [
  [/from '\.\.\/primitives\/state-layer\.js'/g, "from '@m3ui/react/primitives'"],
  [/from '\.\.\/primitives\/ripple\.js'/g, "from '@m3ui/react/primitives'"],
  [/from '\.\.\/primitives\/surface\.js'/g, "from '@m3ui/react/primitives'"],
  [/from '\.\.\/lib\/token-utils\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/pressable-shell\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/popup-motion\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/wavy-path\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/i18n\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/calendar-engine\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/window-size-class\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/provider\/m3-provider\.js'/g, "from '@m3ui/react/provider'"],
  [/from '\.\/fab\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/icon-button\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/button\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/badge\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/snackbar\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/inset-context\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/overlay-motion\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/shape-crop\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/divider\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/menu\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/date-input\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/navigation-bar\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/navigation-rail\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/navigation-drawer\.js'/g, "from '@m3ui/react'"],
];

function rewriteImports(source: string): string {
  let result = source;
  for (const [from, to] of Object.entries(IMPORT_REWRITES)) {
    result = result.replaceAll(`from '${from}`, `from '${to}`);
    result = result.replaceAll(`from "${from}`, `from "${to}`);
  }
  for (const [pattern, replacement] of INTERNAL_IMPORT_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  if (result.includes('workspace:') || result.includes('../lib/') || result.includes('../primitives/')) {
    throw new Error('Registry source contains workspace-relative imports that must be rewritten');
  }
  return result;
}

interface RegistryItem {
  name: string;
  type: 'registry:ui';
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: Array<{ path: string; content: string; type: 'registry:ui' }>;
}

interface RegistryManifest {
  $schema: string;
  name: string;
  homepage: string;
  items: Array<{ name: string; type: string; title: string; description: string }>;
}

function buildRegistryItem(entry: ComponentCatalogEntry): RegistryItem {
  if (!entry.sourceFile) {
    throw new Error(`Registry item "${entry.slug}" is missing sourceFile`);
  }

  const sourcePath = join(COMPONENTS_DIR, entry.sourceFile);
  const rawSource = readFileSync(sourcePath, 'utf-8');
  const flatSource = rewriteImports(rawSource);

  return {
    name: entry.slug,
    type: 'registry:ui',
    title: entry.title,
    description: entry.description,
    dependencies: [...entry.npmDependencies],
    registryDependencies: [...entry.registryDependencies],
    files: [
      {
        path: `components/m3ui/${entry.slug}.tsx`,
        content: flatSource,
        type: 'registry:ui',
      },
    ],
  };
}

function buildDocsCatalog(): DocsCatalogManifest {
  return {
    $schema: 'https://m3ui.dev/schema/docs-catalog.json',
    generatedAt: new Date().toISOString(),
    categories: [...CATALOG_CATEGORIES],
    entries: [...COMPONENT_CATALOG],
  };
}

function buildRegistry(): void {
  mkdirSync(REGISTRY_DIR, { recursive: true });
  mkdirSync(join(REGISTRY_DIR, 'r'), { recursive: true });

  const registryEntries = getRegistryUiEntries();
  const items: RegistryItem[] = [];

  for (const entry of registryEntries) {
    const item = buildRegistryItem(entry);
    items.push(item);
    writeFileSync(join(REGISTRY_DIR, 'r', `${entry.slug}.json`), JSON.stringify(item, null, 2) + '\n');
  }

  const manifest: RegistryManifest = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'm3ui',
    homepage: 'https://m3ui.dev',
    items: items.map((i) => ({
      name: i.name,
      type: i.type,
      title: i.title,
      description: i.description,
    })),
  };

  writeFileSync(join(REGISTRY_DIR, 'registry.json'), JSON.stringify(manifest, null, 2) + '\n');

  const docsCatalog = buildDocsCatalog();
  writeFileSync(join(REGISTRY_DIR, 'docs-catalog.json'), JSON.stringify(docsCatalog, null, 2) + '\n');

  console.log(
    `Registry built: ${items.length} items → ${REGISTRY_DIR}\nDocs catalog: ${docsCatalog.entries.length} entries`,
  );
}

buildRegistry();
