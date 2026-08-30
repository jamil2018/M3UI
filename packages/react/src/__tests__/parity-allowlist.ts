/**
 * Reviewed allowlist for upstream token suffixes intentionally not referenced in Tier A sources.
 * Each entry documents why the gap is acceptable until parity-report automation lands.
 */
export interface ParityAllowlistEntry {
  /** Regex tested against token suffix (property name after md-comp-{prefix}-) */
  pattern: RegExp;
  /** Optional slug scope; omit for global patterns */
  slug?: string;
  reason: string;
}

export const PARITY_ALLOWLIST: ParityAllowlistEntry[] = [
  {
    pattern: /^focus-state-layer-(color|opacity)$/,
    reason: 'Focus state layer applied via StateLayer / focus-ring primitive, not direct comp token',
  },
  {
    pattern: /^label-text-(tracking|type)$/,
    reason: 'Typography tracking and type role use sys typescale via typeStyle(), not comp tokens',
  },
  {
    pattern: /^(hover|focus|pressed|disabled|selected|unselected|dragged)-/,
    reason: 'Interaction state tokens applied via StateLayer and variant base tokens',
  },
  {
    pattern: /-elevation$/,
    reason: 'Elevation mapped through elevationShadow() to md-sys-elevation tokens',
  },
  {
    pattern: /-(font|type)$/,
    reason: 'Component typography deferred to md-sys-typescale on web',
  },
  {
    pattern: /^state-layer-/,
    reason: 'State layer geometry uses sys state-layer tokens via StateLayer primitive',
  },
  {
    pattern: /^with-leading-icon-/,
    slug: 'button',
    reason: 'Leading-icon spacing tokens reserved for icon+label layout edge cases',
  },
  {
    pattern: /^(icon-color|label-text-color|label-color)$/,
    reason: 'Base label/icon colors applied via parent color cascade or variant base token subset',
  },
  {
    pattern: /^container-shadow-color$/,
    reason: 'Shadow color derived from md-sys-color-shadow via elevation helper',
  },
  {
    pattern: /^outline-width$/,
    reason: 'Outline width applied via variant base token or shared outline-width helper',
  },
  {
    pattern: /^container-shape(-start|-end)?(-start|-end)?$/,
    reason: 'Logical corner shape tokens resolved via size/variant prefix helpers at runtime',
  },
  {
    pattern: /^with-trailing-icon-/,
    slug: 'button',
    reason: 'Trailing-icon spacing tokens reserved for icon+label layout edge cases',
  },
];

export function isAllowlistedParityGap(slug: string, tokenSuffix: string): boolean {
  return PARITY_ALLOWLIST.some((entry) => {
    if (entry.slug && entry.slug !== slug) return false;
    return entry.pattern.test(tokenSuffix);
  });
}
