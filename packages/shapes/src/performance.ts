/** Precomputed morph progress quantization for clip-path performance */
export const MORPH_PROGRESS_STEPS = 60;

const morphCache = new Map<string, string[]>();

export interface PrecomputedMorph {
  /** Indexed by round(progress * (steps - 1)) */
  clipPaths: string[];
  steps: number;
}

export function getMorphClipPathAtIndex(precomputed: PrecomputedMorph, index: number): string {
  const i = Math.max(0, Math.min(precomputed.steps - 1, index));
  return precomputed.clipPaths[i] ?? 'none';
}

export function progressToIndex(progress: number, steps: number): number {
  return Math.round(Math.max(0, Math.min(1, progress)) * (steps - 1));
}

export function getCachedMorphPaths(
  key: string,
  compute: () => string[],
): string[] {
  const existing = morphCache.get(key);
  if (existing) return existing;
  const paths = compute();
  morphCache.set(key, paths);
  return paths;
}

export function clearMorphCache(): void {
  morphCache.clear();
}

/**
 * Frame budget guidance for morph animations.
 * clip-path: path() is not compositor-accelerated in all browsers.
 * Prefer precomputed steps and small painted areas.
 */
export const MORPH_PERFORMANCE_BUDGET = {
  /** Target max frame time for morph on mid-tier devices (ms) */
  maxFrameMs: 16.67,
  /** Recommended max simultaneous morphs */
  maxConcurrentMorphs: 4,
  /** Use precomputed paths above this element size (px) */
  precomputeThresholdPx: 48,
  /** Fall back to border-radius approximation above this size */
  approximationThresholdPx: 200,
} as const;

export function shouldUseMorphApproximation(width: number, height: number): boolean {
  return Math.max(width, height) > MORPH_PERFORMANCE_BUDGET.approximationThresholdPx;
}
