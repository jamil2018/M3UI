import { getRegistryInstallInfo } from '@/lib/registry.server';
import { extractPropsFromSource, mergePropDefinitions } from '@/lib/extract-props';
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

export interface ComponentDocPageOptions {
  /** When true, merge `config.props` over auto-extracted props from source */
  autoExtractProps?: boolean;
}

function resolveProps(config: ComponentContentConfig, autoExtractProps: boolean) {
  if (!autoExtractProps) {
    return config.props ?? [];
  }
  const extracted = extractPropsFromSource(config.slug);
  return mergePropDefinitions(extracted, config.props ?? []);
}

export function ComponentDocPage({
  config,
  preview,
  examples,
}: ComponentDocPageProps) {
  const install = getRegistryInstallInfo(config.slug);
  const props = resolveProps(config, true);
  const galleryExamples = examples ?? config.examples ?? [];

  return (
    <main className="doc-page">
      <header className="doc-page-header">
        <p className="doc-page-eyebrow">Components</p>
        <h1 className="doc-page-title">{config.title}</h1>
        <p className="doc-page-description">{config.description}</p>
      </header>

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
