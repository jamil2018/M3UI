'use client';

import { ComponentDocView } from '@/components/component-doc-view';
import { getComponentContent } from '@/content';
import { contentToConfig } from '@/lib/content-config';
import type { ComponentCatalogEntry } from '@/lib/catalog';

interface ComponentDocClientProps {
  entry: ComponentCatalogEntry;
}

export function ComponentDocClient({ entry }: ComponentDocClientProps) {
  const content = getComponentContent(entry.slug);

  if (!content) {
    return (
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        <h1>{entry.title}</h1>
        <p>{entry.description}</p>
        <p>Documentation content coming soon.</p>
      </main>
    );
  }

  const config = contentToConfig(content);
  return <ComponentDocView slug={entry.slug} config={config} />;
}
