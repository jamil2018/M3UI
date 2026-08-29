'use client';

import { getComponentContent } from '@/content';
import { contentToConfig } from '@/lib/content-config';
import { ComponentDocView } from '@/components/component-doc-view';

export function componentDocPage(slug: string) {
  const content = getComponentContent(slug);

  if (!content) {
    return function MissingContentPage() {
      return (
        <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
          <h1>Component not found</h1>
          <p>
            No documentation content exists for <code>{slug}</code>.
          </p>
        </main>
      );
    };
  }

  const config = contentToConfig(content);

  return function ComponentDocPageRoute() {
    return <ComponentDocView slug={slug} config={config} />;
  };
}

/** @deprecated Use componentDocPage(slug) — demo argument is ignored */
export function componentPage(
  name: string,
  _title?: string,
  _demo?: unknown,
) {
  return componentDocPage(name);
}

export { PUBLIC_COMPONENT_SLUGS as COMPONENTS } from '@/content';
