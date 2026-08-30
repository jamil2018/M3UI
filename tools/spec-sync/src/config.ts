/**
 * Pinned upstream revisions for reproducible spec sync.
 * Update deliberately — diffs in committed JSON are reviewable PRs.
 */
export const PINNED_REVISIONS = {
  androidx: {
    repo: 'androidx/androidx',
    ref: 'androidx-main',
    /** Compose Material3 tokens path */
    tokensPath:
      'compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens',
  },
  materialWeb: {
    repo: 'material-components/material-web',
    ref: 'main',
    /**
     * Paths to sync from material-web:
     * - tokens/ — hand-maintained _md-comp-*.scss wrappers with $supported-tokens
     * - tokens/versions/latest/sass/ — Expressive generated values
     * - tokens/versions/v0_192/ — classic M3 values (Tier B/C fallback)
     * - labs/gb/styles/ — motion/shape/space custom properties (Expressive precedent)
     */
    paths: [
      'tokens',
      'tokens/versions/latest/sass',
      'tokens/versions/v0_192',
      'labs/gb/styles',
    ] as const,
  },
} as const;

export const SPEC_VERSION = 'v0_210';
