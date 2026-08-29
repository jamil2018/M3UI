import type { PageTree } from 'fumadocs-core/server';
import { CATEGORY_LABELS } from './catalog';
import {
  getNavPages,
  getPagesByCategory,
  getSidebarCategories,
  type CatalogCategory,
  type NavPage,
} from './catalog';

function pageNode(page: NavPage): PageTree.Item {
  return {
    type: 'page',
    name: page.title,
    url: page.href,
  };
}

function categoryFolder(category: CatalogCategory, pages: NavPage[]): PageTree.Folder {
  return {
    type: 'folder',
    name: CATEGORY_LABELS[category],
    defaultOpen: category === 'actions' || category === 'foundations',
    children: pages.map(pageNode),
  };
}

export function getDocsPageTree(): PageTree.Root {
  const pages = getNavPages();
  const gettingStarted = pages.filter(
    (page) => page.category === 'getting-started' && page.slug !== 'components',
  );
  const componentsIndex = pages.find((page) => page.slug === 'components');
  const guides = pages.filter((page) => page.category === 'guides');
  const componentCategories = getSidebarCategories().filter(
    (category) => category !== 'foundations' && getPagesByCategory(category).length > 0,
  );
  const foundations = getPagesByCategory('foundations');

  const children: PageTree.Node[] = [
    ...gettingStarted.map(pageNode),
    {
      type: 'folder',
      name: 'Guides',
      defaultOpen: true,
      children: guides.map(pageNode),
    },
    {
      type: 'folder',
      name: 'Foundations',
      defaultOpen: true,
      children: foundations.map(pageNode),
    },
    {
      type: 'folder',
      name: 'Components',
      defaultOpen: true,
      index: componentsIndex ? pageNode(componentsIndex) : undefined,
      children: componentCategories.map((category) =>
        categoryFolder(category, getPagesByCategory(category)),
      ),
    },
  ];

  return {
    name: 'M3UI',
    children,
  };
}
