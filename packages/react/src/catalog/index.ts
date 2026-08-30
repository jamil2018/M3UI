export {
  CATALOG_CATEGORIES,
  CONFORMANCE_SOURCES,
  type CatalogCategory,
  type CatalogStatus,
  type CatalogRegistryType,
  type CatalogDocsFlags,
  type ComponentCatalogEntry,
  type DocsCatalogEntry,
  type DocsCatalogManifest,
  type ComponentConformance,
  type ComponentParity,
  type ConformanceSource,
  type ConformanceStatus,
  type ParityReference,
  type ParityResidualDiff,
  type ParityTier,
} from './types.js';

export {
  COMPONENT_UPSTREAM_KEYS,
  CATALOG_VARIANTS_SIZES,
  MATERIAL_WEB_UPSTREAM_VERSION,
  TIER_A_SLUGS,
  TIER_B_SLUGS,
  TIER_C_CATALOG,
  TIER_C_SLUGS,
  parityForSlug,
  parityReferenceForSlug,
  parityTierForSlug,
} from './parity.js';

export {
  COMPONENT_CATALOG,
  getCatalogEntry,
  getRegistryUiEntries,
  getPublicCatalogEntries,
  getCatalogEntriesByCategory,
} from './components.catalog.js';
