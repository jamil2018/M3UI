import registry from '../../../../packages/react/registry/registry.json';

import docsCatalog from '../../../../packages/react/registry/docs-catalog.json';

import type {

  CatalogCategory,

  CatalogDocsFlags,

  CatalogRegistryType,

  CatalogStatus,

  ComponentCatalogEntry,

  DocsCatalogEntry,

  DocsCatalogManifest,

} from '../../../../packages/react/src/catalog/types';



export type {

  CatalogCategory,

  CatalogDocsFlags,

  CatalogRegistryType,

  CatalogStatus,

  ComponentCatalogEntry,

  DocsCatalogEntry,

  DocsCatalogManifest,

};



export const CATALOG_CATEGORIES = docsCatalog.categories as CatalogCategory[];

export const COMPONENT_CATALOG = docsCatalog.entries as ComponentCatalogEntry[];



export interface NavPage {

  slug: string;

  title: string;

  description: string;

  href: string;

  category: CatalogCategory | 'guides' | 'getting-started';

  status?: ComponentCatalogEntry['status'];

}



export const CATEGORY_LABELS: Record<CatalogCategory, string> = {

  actions: 'Actions',

  inputs: 'Inputs',

  selection: 'Selection',

  communication: 'Communication',

  containment: 'Containment',

  navigation: 'Navigation',

  feedback: 'Feedback',

  pickers: 'Pickers',

  layout: 'Layout',

  foundations: 'Foundations',

};



const STATIC_PAGES: NavPage[] = [

  {

    slug: 'home',

    title: 'Getting Started',

    description: 'Install M3UI, explore tokens, and browse the component registry.',

    href: '/',

    category: 'getting-started',

  },

  {

    slug: 'components',

    title: 'Components',

    description: 'Searchable catalog of Material Design 3 Expressive React components.',

    href: '/components',

    category: 'getting-started',

  },

  {

    slug: 'tokens',

    title: 'Design Tokens',

    description: 'Color roles, type scale, shape scale, and state layers.',

    href: '/tokens',

    category: 'foundations',

  },

  {

    slug: 'rsc',

    title: 'React Server Components',

    description: 'Client boundaries, subpath exports, and hydration guidance.',

    href: '/guides/rsc',

    category: 'guides',

  },

];



function catalogHref(entry: ComponentCatalogEntry): string {

  return `/components/${entry.slug}`;

}



function isCatalogAvailable(): boolean {

  return COMPONENT_CATALOG.length > 0;

}



function catalogNavPages(): NavPage[] {

  return COMPONENT_CATALOG.filter(

    (entry) => entry.docs.route && entry.status !== 'internal',

  ).map((entry) => ({

    slug: entry.slug,

    title: entry.title,

    description: entry.description,

    href: catalogHref(entry),

    category: entry.category,

    status: entry.status,

  }));

}



function registryFallbackPages(): NavPage[] {

  return registry.items.map((item) => ({

    slug: item.name,

    title: item.title ?? item.name,

    description: item.description ?? '',

    href: `/components/${item.name}`,

    category: 'actions' as CatalogCategory,

    status: item.name === 'placeholder-button' ? 'internal' : 'stable',

  }));

}



export function getCatalogEntry(slug: string): ComponentCatalogEntry | undefined {

  return COMPONENT_CATALOG.find((entry) => entry.slug === slug);

}



export function getPublicCatalogEntries(): ComponentCatalogEntry[] {

  if (isCatalogAvailable()) {

    return COMPONENT_CATALOG.filter(

      (entry) => entry.status !== 'internal' && entry.docs.publicIndex,

    );

  }

  return registryFallbackPages()

    .filter((page) => page.status !== 'internal')

    .map((page) => ({

      slug: page.slug,

      title: page.title,

      description: page.description,

      category: page.category as CatalogCategory,

      status: page.status ?? 'stable',

      registryType: 'registry:ui' as const,

      npmDependencies: ['@m3ui/react', '@m3ui/tokens'],

      registryDependencies: [],

      exports: [],

      related: [],

      docs: { route: true, publicIndex: true },

    }));

}



export function getRoutableCatalogSlugs(): string[] {

  if (isCatalogAvailable()) {

    return COMPONENT_CATALOG.filter((entry) => entry.docs.route).map((entry) => entry.slug);

  }

  return registry.items.map((item) => item.name);

}



export function getCatalogEntriesByCategory(category: CatalogCategory): ComponentCatalogEntry[] {

  return COMPONENT_CATALOG.filter((entry) => entry.category === category);

}



export function getNavPages(): NavPage[] {

  const componentPages = isCatalogAvailable()

    ? catalogNavPages()

    : registryFallbackPages().filter((page) => page.status !== 'internal');



  return [...STATIC_PAGES, ...componentPages];

}



export function getSidebarCategories(): CatalogCategory[] {

  return [...CATALOG_CATEGORIES];

}



export function getPagesByCategory(category: CatalogCategory): NavPage[] {

  return getNavPages().filter((page) => page.category === category);

}



export function getSearchPages(): NavPage[] {

  return getNavPages().filter((page) => page.slug !== 'home');

}


