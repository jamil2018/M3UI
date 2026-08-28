import { describe, it, expect } from 'vitest';
import {
  MORPH_PROGRESS_STEPS,
  MORPH_PERFORMANCE_BUDGET,
  getCachedMorphPaths,
  clearMorphCache,
  progressToIndex,
} from './performance.js';
import { Morph } from './morph.js';
import { MaterialShapes } from './material-shapes.js';
import { cubicsToClipPath } from './paths.js';

describe('morph step cache budget', () => {
  it('uses 60 precomputed progress steps by default', () => {
    expect(MORPH_PROGRESS_STEPS).toBe(60);
    expect(MORPH_PERFORMANCE_BUDGET.maxFrameMs).toBeCloseTo(16.67, 1);
    expect(MORPH_PERFORMANCE_BUDGET.maxConcurrentMorphs).toBe(4);
  });

  it('precomputes morph clip paths within step budget', () => {
    clearMorphCache();
    const from = MaterialShapes.circle;
    const to = MaterialShapes.cookie9Sided;
    const key = 'circle→cookie9Sided';

    const paths = getCachedMorphPaths(key, () => {
      const morph = new Morph(from, to);
      const steps: string[] = [];
      for (let i = 0; i < MORPH_PROGRESS_STEPS; i++) {
        const progress = i / (MORPH_PROGRESS_STEPS - 1);
        steps.push(cubicsToClipPath(morph.asCubics(progress)));
      }
      return steps;
    });

    expect(paths).toHaveLength(MORPH_PROGRESS_STEPS);
    expect(paths[0]).toMatch(/^path\('/);
    expect(getCachedMorphPaths(key, () => ['should-not-run'])).toBe(paths);
  });

  it('maps progress to discrete indices without exceeding step count', () => {
    expect(progressToIndex(0, MORPH_PROGRESS_STEPS)).toBe(0);
    expect(progressToIndex(1, MORPH_PROGRESS_STEPS)).toBe(MORPH_PROGRESS_STEPS - 1);
    expect(progressToIndex(0.5, MORPH_PROGRESS_STEPS)).toBeLessThan(MORPH_PROGRESS_STEPS);
  });

  it('precompute completes within morph frame budget (smoke timing)', () => {
    const morph = new Morph(MaterialShapes.circle, MaterialShapes.square);
    const start = performance.now();
    for (let i = 0; i < MORPH_PROGRESS_STEPS; i++) {
      cubicsToClipPath(morph.asCubics(i / (MORPH_PROGRESS_STEPS - 1)));
    }
    const elapsed = performance.now() - start;
    // Generous budget for CI — catches order-of-magnitude regressions
    expect(elapsed).toBeLessThan(MORPH_PROGRESS_STEPS * MORPH_PERFORMANCE_BUDGET.maxFrameMs);
  });
});
