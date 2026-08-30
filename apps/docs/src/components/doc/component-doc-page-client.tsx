'use client';

import { buildRegistryInstallInfo } from '@/lib/component-nav';
import { AccessibilitySection } from './accessibility-section';
import { DocSection } from './doc-section';
import { ExamplesGallery } from './examples-gallery';
import { InstallTabs } from './install-tabs';
import { PageNav } from './page-nav';
import { PreviewCodeTabs } from './preview-code-tabs';
import { PropsTable } from './props-table';
import { RelatedComponents } from './related-components';
import type { ComponentDocPageProps, ComponentContentConfig } from './types';
import { UsageBlock } from './usage-block';
import { ComplianceSummary } from './compliance-summary';
import { ParityReference } from './parity-reference';
import { getCatalogEntry } from '@/lib/catalog';

/** Client-side doc page for legacy `componentPage()` factory routes */
export function ComponentDocPageClient({
  config,
  preview,
  examples,
}: ComponentDocPageProps) {
  const install = buildRegistryInstallInfo(config.slug);
  const props = config.props ?? [];
  const galleryExamples = examples ?? config.examples ?? [];
  const catalogEntry = getCatalogEntry(config.slug);

  return (
    <main className="doc-page">
      <header className="doc-page-header">
        <p className="doc-page-eyebrow">Components</p>
        <h1 className="doc-page-title">{config.title}</h1>
        <p className="doc-page-description">{config.description}</p>
      </header>

      {catalogEntry ? (
        <ComplianceSummary conformance={catalogEntry.conformance} />
      ) : null}

      <ParityReference slug={config.slug} />

      <DocSection id="preview" title="Preview" description="Live example with theme controls.">
        <PreviewCodeTabs preview={preview} code={config.previewCode} />
      </DocSection>

      <UsageBlock usage={config.usage} />

      <DocSection id="install" title="Install">
        <InstallTabs install={install} />
      </DocSection>

      <ExamplesGallery examples={galleryExamples} />

      <PropsTable props={props} />

      {config.accessibility ? (
        <AccessibilitySection accessibility={config.accessibility} />
      ) : null}

      {config.related && config.related.length > 0 ? (
        <RelatedComponents slugs={config.related} />
      ) : null}

      <PageNav slug={config.slug} />
    </main>
  );
}

export function buildLegacyContentConfig(
  slug: string,
  title: string,
  overrides?: Partial<ComponentContentConfig>,
): ComponentContentConfig {
  const componentName = title.replace(/\s+/g, '');
  return {
    slug,
    title,
    description:
      overrides?.description ??
      `M3 Expressive ${title} — token-driven, built on Base UI primitives.`,
    previewCode:
      overrides?.previewCode ??
      `import { ${componentName} } from '@m3ui/react';

export function Example() {
  return <${componentName}>Example</${componentName}>;
}`,
    usage: overrides?.usage ?? {
      code: `import { ${componentName}, M3Provider } from '@m3ui/react';

export function App() {
  return (
    <M3Provider>
      <${componentName}>Label</${componentName}>
    </M3Provider>
  );
}`,
    },
    accessibility: overrides?.accessibility ?? {
      items: [
        'Keyboard navigable where applicable',
        'Uses semantic HTML via Base UI primitives',
        'State communicated to assistive technology',
      ],
    },
    ...overrides,
  };
}
