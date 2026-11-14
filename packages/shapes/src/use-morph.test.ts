// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { useMorph } from './use-morph.js';
import { MaterialShapes } from './material-shapes.js';
import { RoundedPolygon } from './rounded-polygon.js';
import { Cubic } from './cubic.js';
import { clearMorphCache } from './performance.js';

vi.mock('motion/react', async (load) => ({
  ...(await load<typeof import('motion/react')>()),
  useReducedMotionConfig: () => true,
}));
afterEach(cleanup);

describe('useMorph geometry cache', () => {
  it('keeps distinct shapes with identical bounds and segment counts separate', () => {
    clearMorphCache();
    const square = MaterialShapes.square;
    const bowed = new RoundedPolygon(
      square.cubics.map((c) => {
        const points = [...c.points];
        for (const index of [2, 3, 4, 5]) points[index] = 0.5 + (points[index] - 0.5) * 0.6;
        return new Cubic(points);
      }),
      square.centerX,
      square.centerY,
    );
    expect(bowed.calculateBounds()).toEqual(square.calculateBounds());
    expect(bowed.cubics.length).toBe(square.cubics.length);
    const first = renderHook(() =>
      useMorph({ from: MaterialShapes.circle, to: square, active: true }),
    );
    const second = renderHook(() =>
      useMorph({ from: MaterialShapes.circle, to: bowed, active: true }),
    );
    expect(second.result.current.clipPath).not.toBe(first.result.current.clipPath);
  });
});
