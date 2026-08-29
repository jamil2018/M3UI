'use client';

import type { ComponentType } from 'react';
import { ComponentDocPageClient } from '@/components/doc/component-doc-page-client';
import type { ComponentContentConfig } from '@/components/doc/types';
import { getComponentDemo } from '@/demos';
import { resolveDocExamples, resolvePreviewCode } from '@/lib/resolve-examples';

interface ComponentDocViewProps {
  slug: string;
  config: ComponentContentConfig;
}

function DemoPreview({ Demo }: { Demo: ComponentType }) {
  return <Demo />;
}

export function ComponentDocView({ slug, config }: ComponentDocViewProps) {
  const Demo = getComponentDemo(slug);

  if (!Demo) {
    return (
      <main className="doc-page">
        <header className="doc-page-header">
          <p className="doc-page-eyebrow">Components</p>
          <h1 className="doc-page-title">{config.title}</h1>
          <p className="doc-page-description">{config.description}</p>
        </header>
        <p>Live demo coming soon.</p>
      </main>
    );
  }

  const examples = resolveDocExamples(slug, config.examples ?? []);
  const previewCode = resolvePreviewCode(config, slug);

  return (
    <ComponentDocPageClient
      config={{ ...config, previewCode }}
      preview={<DemoPreview Demo={Demo} />}
      examples={examples}
    />
  );
}
