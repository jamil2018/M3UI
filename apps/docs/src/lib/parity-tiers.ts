import {
  TIER_A_SLUGS,
  TIER_B_SLUGS,
  TIER_C_SLUGS,
} from '../../../../packages/react/src/catalog/parity';
import type { ParityReference } from '../../../../packages/react/src/catalog/types';

/** Material Web parity tier model — mirrors the parity plan reference coverage. */
export type ParityTier = 'A' | 'B' | 'C';

export type { ParityReference };

export interface ParityTierExplanation {
  title: string;
  reference: ParityReference;
  summary: string;
}

/** Canonical tier copy for foundations, migration, and component doc pages. */
export const PARITY_TIER_EXPLANATIONS: Record<ParityTier, ParityTierExplanation> = {
  A: {
    title: 'Tier A — Expressive reference',
    reference: 'labs/gb',
    summary:
      'Full token, visual, motion, and accessibility parity against Material Web labs/gb Expressive and tokens/versions/latest/sass. CI fails when upstream tokens are missing without a reviewed allowlist.',
  },
  B: {
    title: 'Tier B — Stable MWC reference',
    reference: 'stable',
    summary:
      'Classic Material 3 geometry from stable material-web. Expressive-only additions are recorded as explicit catalog adaptations rather than upstream gaps.',
  },
  C: {
    title: 'Tier C — Tokens only',
    reference: 'tokens-only',
    summary:
      'Upstream never shipped a web component. Token and visual parity is checked against orphaned tokens/versions Sass files; interaction and composition remain M3UI-owned.',
  },
};

export const REFERENCE_LABELS: Record<ParityReference, string> = {
  'labs/gb': 'Material Web labs/gb (Expressive)',
  stable: 'Material Web stable',
  'tokens-only': 'tokens/versions/* (orphaned Sass)',
};

export interface ParityTierInfo {
  tier: ParityTier;
  reference: ParityReference;
  title: string;
  summary: string;
}

const TIER_A_SET = new Set<string>(TIER_A_SLUGS);
const TIER_B_SET = new Set<string>(TIER_B_SLUGS);

export function getParityTier(slug: string): ParityTierInfo {
  if (TIER_A_SET.has(slug)) {
    const copy = PARITY_TIER_EXPLANATIONS.A;
    return { tier: 'A', reference: copy.reference, title: copy.title, summary: copy.summary };
  }
  if (TIER_B_SET.has(slug)) {
    const copy = PARITY_TIER_EXPLANATIONS.B;
    return { tier: 'B', reference: copy.reference, title: copy.title, summary: copy.summary };
  }
  const copy = PARITY_TIER_EXPLANATIONS.C;
  return { tier: 'C', reference: copy.reference, title: copy.title, summary: copy.summary };
}

export const PARITY_TIER_SUMMARY = {
  A: {
    count: TIER_A_SLUGS.length,
    reference: 'labs/gb' as const,
    components: [...TIER_A_SLUGS].sort(),
  },
  B: {
    count: TIER_B_SLUGS.length,
    reference: 'stable' as const,
    components: [...TIER_B_SLUGS].sort(),
  },
  C: {
    count: TIER_C_SLUGS.length,
    reference: 'tokens-only' as const,
    components: [...TIER_C_SLUGS].sort(),
    description: 'Remaining public components without upstream web implementation.',
  },
} as const;
