import type { Metadata } from 'next';
import { ComponentCatalogIndex } from '@/components/component-catalog-index';
import { DocsContent } from '@/components/docs-content';
import { getPublicCatalogEntries } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Components',
  description: 'Browse Material Design 3 Expressive React components by category.',
};

export default function ComponentsIndexPage() {
  const entries = getPublicCatalogEntries();

  return (
    <DocsContent
      title="Components"
      description="Searchable catalog of M3 Expressive components. Install any item via the shadcn-compatible registry or browse live demos and accessibility notes."
      full
    >
      <ComponentCatalogIndex entries={entries} />
    </DocsContent>
  );
}
