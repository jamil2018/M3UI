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
    tokensPath: 'tokens',
  },
} as const;

export const SPEC_VERSION = 'v0_210';
