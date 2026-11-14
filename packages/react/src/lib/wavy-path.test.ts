import { describe, expect, it } from 'vitest';
import { generateCircularWavePath, generateLinearWavePath } from './wavy-path.js';

function points(path: string) {
  return [...path.matchAll(/[ML] ([\d.-]+) ([\d.-]+)/g)].map((match) => [Number(match[1]), Number(match[2])]);
}

describe('wave geometry', () => {
  it('keeps the linear wave within its amplitude and flattens at completion', () => {
    const wave = points(generateLinearWavePath(100, 10, 3, 20, 0, 50));
    expect(wave[0]![0]).toBe(0);
    expect(wave.at(-1)![0]).toBe(100);
    expect(wave.every(([, y]) => y! >= 3.5 && y! <= 6.5)).toBe(true);
    expect(points(generateLinearWavePath(100, 10, 3, 20, 1, 100)).every(([, y]) => y === 5)).toBe(true);
  });

  it('uses wavelength in pixels consistently for circular waves', () => {
    const radius = 20;
    const wave = points(generateCircularWavePath(30, 30, radius, 3, 20, 0, 0, 0, 1));
    // One wavelength of arc length produces one complete wave.
    const end = wave.at(-1)!;
    expect(Math.hypot(end[0]! - 30, end[1]! - 30)).toBeCloseTo(radius, 1);
  });
});
