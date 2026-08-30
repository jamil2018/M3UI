/** Storybook iframe URL with theme globals for deterministic VRT. */
export function storyUrl(storyId: string, globals: Record<string, string | number | boolean> = {}) {
  const params = new URLSearchParams({ id: storyId, viewMode: 'story' });
  if (Object.keys(globals).length > 0) {
    const globalsStr = Object.entries(globals)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
    params.set('globals', globalsStr);
  }
  return `/iframe.html?${params.toString()}`;
}

export const OVERVIEW_STORY = 'gallery-overview--default';

/** Storybook tags for parity-tier VRT filtering (see tools/vrt/REBASELINE.md). */
export const PARITY_TIER_TAGS = {
  A: 'parity-tier-A',
  B: 'parity-tier-B',
  C: 'parity-tier-C',
} as const;

export const PARITY_REF_TAGS = {
  'labs/gb': 'parity-ref-labs-gb',
  stable: 'parity-ref-stable',
  'tokens-only': 'parity-ref-tokens-only',
} as const;

/** Foundations primitive stories — add to VRT matrix after Phase 2 merge. */
export const PRIMITIVE_VRT_STORIES = [
  'foundations-primitives--ripple-states',
  'foundations-primitives--focus-ring-states',
  'foundations-primitives--elevation-levels',
] as const;

export const VRT_MATRIX = [
  { scheme: 'light', contrast: 0, direction: 'ltr', name: 'light-default-ltr' },
  { scheme: 'dark', contrast: 0, direction: 'ltr', name: 'dark-default-ltr' },
  { scheme: 'light', contrast: 0.5, direction: 'ltr', name: 'light-medium-ltr' },
  { scheme: 'light', contrast: 1, direction: 'ltr', name: 'light-high-ltr' },
  { scheme: 'light', contrast: 0, direction: 'rtl', name: 'light-default-rtl' },
] as const;
