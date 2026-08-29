import { createSearchAPI } from 'fumadocs-core/search/server';
import { getSearchIndexes } from '@/lib/search';

export const runtime = 'nodejs';

export const { GET } = createSearchAPI('simple', {
  indexes: getSearchIndexes(),
});
