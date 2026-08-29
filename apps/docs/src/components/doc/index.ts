import { mergePropDefinitions, extractPropsFromSource } from '@/lib/extract-props';
import {
  buildRegistryInstallInfo,
  getComponentNavFromOrder,
  getComponentTitle,
  getRelatedComponentLinks,
  PUBLIC_COMPONENT_ORDER,
  toComponentNavLink,
} from '@/lib/component-nav';
import { getComponentOrder, getRegistryInstallInfo } from '@/lib/registry.server';
import { getSharedExamples } from '@/lib/shared-examples';
import { buildLegacyContentConfig } from './component-doc-page-client';

export { AccessibilitySection } from './accessibility-section';
export { CodeBlock } from './code-block';
export { ComponentDocPage } from './component-doc-page';
export { ComponentDocPageClient, buildLegacyContentConfig } from './component-doc-page-client';
export { DocSection } from './doc-section';
export { ExamplesGallery } from './examples-gallery';
export { InstallTabs } from './install-tabs';
export { LivePreview } from './live-preview';
export { PageNav } from './page-nav';
export { PreviewCodeTabs } from './preview-code-tabs';
export { PropsTable } from './props-table';
export { RelatedComponents } from './related-components';
export { TabGroup } from './tab-group';
export { UsageBlock } from './usage-block';

export type {
  AccessibilityConfig,
  ComponentContentConfig,
  ComponentDocPageProps,
  ComponentNavLink,
  ComponentNavResult,
  DocExample,
  DocExampleConfig,
  PropDefinition,
  RegistryInstallInfo,
  UsageConfig,
} from './types';

/** Public API surface for the content agent and custom doc layouts */
export const componentDocApi = {
  layout: {
    ComponentDocPage: 'ComponentDocPage',
    ComponentDocPageClient: 'ComponentDocPageClient',
  },
  sections: [
    'AccessibilitySection',
    'CodeBlock',
    'DocSection',
    'ExamplesGallery',
    'InstallTabs',
    'LivePreview',
    'PageNav',
    'PreviewCodeTabs',
    'PropsTable',
    'RelatedComponents',
    'TabGroup',
    'UsageBlock',
  ] as const,
  helpers: {
    getRegistryInstallInfo,
    buildRegistryInstallInfo,
    getComponentOrder,
    getComponentNavFromOrder,
    getRelatedComponentLinks,
    getComponentTitle,
    toComponentNavLink,
    extractPropsFromSource,
    mergePropDefinitions,
    getSharedExamples,
    buildLegacyContentConfig,
  },
  constants: {
    PUBLIC_COMPONENT_ORDER,
  },
  contentShape: {
    ComponentContentConfig: 'ComponentContentConfig',
    fields: [
      'slug',
      'title',
      'description',
      'previewCode',
      'usage',
      'examples',
      'props',
      'accessibility',
      'related',
    ] as const,
  },
} as const;
