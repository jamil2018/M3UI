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

export const VRT_MATRIX = [
  { scheme: 'light', contrast: 0, direction: 'ltr', name: 'light-default-ltr' },
  { scheme: 'dark', contrast: 0, direction: 'ltr', name: 'dark-default-ltr' },
  { scheme: 'light', contrast: 0.5, direction: 'ltr', name: 'light-medium-ltr' },
  { scheme: 'light', contrast: 1, direction: 'ltr', name: 'light-high-ltr' },
  { scheme: 'light', contrast: 0, direction: 'rtl', name: 'light-default-rtl' },
] as const;
