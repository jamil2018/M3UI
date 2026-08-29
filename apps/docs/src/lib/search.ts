import type { Index } from 'fumadocs-core/search/server';
import { getSearchPages } from './catalog';

export function getSearchIndexes(): Index[] {
  return getSearchPages().map((page) => ({
    title: page.title,
    description: page.description,
    content: [page.title, page.description, page.href, page.category].join(' '),
    url: page.href,
    keywords: [page.slug, page.category, page.status ?? 'stable'].join(' '),
  }));
}
