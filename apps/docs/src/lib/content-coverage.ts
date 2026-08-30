import { getExampleMetadataForSlug } from '@m3ui/examples/metadata';
import type { DocExampleConfig } from '@/components/doc/types';
import { getComponentContent, PUBLIC_COMPONENT_SLUGS } from '@/content/components';
import type { ContentCoverage } from '@/content/types';
import { getParityTier } from '@/lib/parity-tiers';

/** Slugs with a local docs demo module in `apps/docs/src/demos` */
const DEMO_SLUGS = new Set([
  'button',
  'icon-button',
  'fab',
  'button-group',
  'split-button',
  'fab-menu',
  'toolbar',
  'text-field',
  'select',
  'autocomplete',
  'search',
  'date-input',
  'date-picker',
  'time-picker',
  'checkbox',
  'radio',
  'switch',
  'segmented-button',
  'slider',
  'badge',
  'tooltip',
  'chip',
  'card',
  'list',
  'divider',
  'tabs',
  'dialog',
  'bottom-sheet',
  'side-sheet',
  'carousel',
  'menu',
  'top-app-bar',
  'bottom-app-bar',
  'navigation-bar',
  'navigation-rail',
  'navigation-drawer',
  'adaptive-navigation',
  'progress',
  'loading-indicator',
  'snackbar',
  'meter',
  'scaffold',
  'pane-scaffold',
]);

export function getContentCoverage(slug: string): ContentCoverage {
  const content = getComponentContent(slug);
  if (!content) return 'minimal';

  const hasSharedExamples = getExampleMetadataForSlug(slug).length > 0;
  const hasDemo = DEMO_SLUGS.has(slug);
  const isComplete =
    content.overview.length > 40 &&
    content.usageCode.length > 20 &&
    content.variants.length >= 2 &&
    content.accessibility.length >= 2 &&
    content.related.length >= 2 &&
    (hasSharedExamples || hasDemo);

  return isComplete ? 'full' : 'minimal';
}

export function getCoverageReport(): {
  total: number;
  full: number;
  minimal: number;
  sharedExamples: number;
  withDemo: number;
  byParityTier: { A: number; B: number; C: number };
} {
  let full = 0;
  let sharedExamples = 0;
  let withDemo = 0;
  const byParityTier = { A: 0, B: 0, C: 0 };

  for (const slug of PUBLIC_COMPONENT_SLUGS) {
    if (getContentCoverage(slug) === 'full') full += 1;
    if (getExampleMetadataForSlug(slug).length > 0) sharedExamples += 1;
    if (DEMO_SLUGS.has(slug)) withDemo += 1;
    byParityTier[getParityTier(slug).tier] += 1;
  }

  return {
    total: PUBLIC_COMPONENT_SLUGS.length,
    full,
    minimal: PUBLIC_COMPONENT_SLUGS.length - full,
    sharedExamples,
    withDemo,
    byParityTier,
  };
}

export function getSharedExamples(slug: string): DocExampleConfig[] | null {
  const examples = getExampleMetadataForSlug(slug);
  if (examples.length === 0) return null;
  return examples.map(({ id, title, description, source }) => ({
    id,
    title,
    description,
    code: source,
  }));
}
