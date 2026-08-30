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

export const CONFORMANCE_SOURCES = [
  'material-tokens',
  'material-web',
  'android-expressive',
  'm3ui-web-adaptation',
] as const;

export type ConformanceSource = (typeof CONFORMANCE_SOURCES)[number];
export type ConformanceStatus = 'verified' | 'in-progress' | 'adapted';

/** Upstream material-web reference tier for parity measurement. */
export type ParityReference = 'labs/gb' | 'stable' | 'tokens-only';

/** Remediation tier from the Material Web parity plan. */
export type ParityTier = 'A' | 'B' | 'C';

/** Residual token parity gap after remediation (missing / extra / value drift). */
export interface ParityResidualDiff {
  /** Upstream supported token suffixes not referenced in our implementation */
  missing: string[];
  /** Our token suffixes with no upstream counterpart */
  extra: string[];
  /** Shared tokens whose resolved default differs from upstream */
  drifted: string[];
}

/** Material Web parity contract — separate from Expressive adaptation status. */
export interface ComponentParity {
  tier: ParityTier;
  reference: ParityReference;
  /** Pinned @material/web release or git ref used for the diff */
  upstreamVersion: string;
  residualDiff: ParityResidualDiff;
}

export interface ComponentConformance {
  version: '1.0';
  status: ConformanceStatus;
  sources: ConformanceSource[];
  variants: string[];
  sizes: string[];
  states: string[];
  responsive: boolean;
  rtl: boolean;
  reducedMotion: boolean;
  forcedColors: boolean;
  tokenPrefixes: string[];
  adaptations: string[];
  /** Material Web parity measurement; omitted for foundations without upstream reference */
  parity?: ComponentParity;
}

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
  conformance: ComponentConformance;
}

/** Serializable catalog entry emitted to `registry/docs-catalog.json` */
export type DocsCatalogEntry = ComponentCatalogEntry;

export interface DocsCatalogManifest {
  $schema: string;
  generatedAt: string;
  categories: CatalogCategory[];
  entries: DocsCatalogEntry[];
}
