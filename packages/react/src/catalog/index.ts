export {
  CATALOG_CATEGORIES,
  type CatalogCategory,
  type CatalogStatus,
  type CatalogRegistryType,
  type CatalogDocsFlags,
  type ComponentCatalogEntry,
  type DocsCatalogEntry,
  type DocsCatalogManifest,
} from './types.js';

export {
  COMPONENT_CATALOG,
  getCatalogEntry,
  getRegistryUiEntries,
  getPublicCatalogEntries,
  getCatalogEntriesByCategory,
} from './components.catalog.js';
