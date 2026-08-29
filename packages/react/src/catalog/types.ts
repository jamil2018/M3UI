/** Docs / registry information architecture groups */
export const CATALOG_CATEGORIES = [
  'actions',
  'inputs',
  'selection',
  'communication',
  'containment',
  'navigation',
  'feedback',
  'pickers',
  'layout',
  'foundations',
] as const;

export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number];

export type CatalogStatus = 'stable' | 'beta' | 'internal';

/** shadcn registry item type or non-registry docs entry */
export type CatalogRegistryType = 'registry:ui' | 'foundations' | 'guide';

export interface CatalogDocsFlags {
  /** `/components/<slug>` route is expected to exist */
  route: boolean;
  /** Listed on the public `/components` index (Phase 2+) */
  publicIndex: boolean;
  /** Dedicated prose / API content module exists (Phase 2+) */
  hasContent?: boolean;
}

export interface ComponentCatalogEntry {
  slug: string;
  title: string;
  description: string;
  category: CatalogCategory;
  status: CatalogStatus;
  registryType: CatalogRegistryType;
  /** Component source file relative to `packages/react/src/components/` */
  sourceFile?: string;
  npmDependencies: string[];
  registryDependencies: string[];
  /** Public export names from `@m3ui/react` (or `@m3ui/shapes` for foundations) */
  exports: string[];
  /** Related catalog slugs for cross-linking */
  related: string[];
  docs: CatalogDocsFlags;
}

/** Serializable catalog entry emitted to `registry/docs-catalog.json` */
export type DocsCatalogEntry = ComponentCatalogEntry;

export interface DocsCatalogManifest {
  $schema: string;
  generatedAt: string;
  categories: CatalogCategory[];
  entries: DocsCatalogEntry[];
}
