'use client';

import { createElement } from 'react';
import { getExamplesForSlug } from '@m3ui/examples';
import type { DocExample, DocExampleConfig } from '@/components/doc/types';
import type { ComponentContentConfig } from '@/components/doc/types';

/** Prefer shared `@m3ui/examples` definitions; fall back to prose variant cards */
export function resolveDocExamples(
  slug: string,
  fallback: DocExampleConfig[],
): Array<DocExample | DocExampleConfig> {
  const shared = getExamplesForSlug(slug);
  if (shared.length > 0) {
    return shared.map((example) => ({
      id: example.id,
      title: example.title,
      description: example.description,
      code: example.source,
      preview: createElement(example.Component),
    }));
  }

  return fallback;
}

export function resolvePreviewCode(config: ComponentContentConfig, slug: string): string {
  const shared = getExamplesForSlug(slug);
  const first = shared[0];
  if (first?.source) {
    return first.source;
  }
  return config.previewCode;
}
