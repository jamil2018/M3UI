import { Cubic } from './cubic.js';
import { flattenCubics, type RoundedPolygon } from './rounded-polygon.js';

export class Morph {
  private readonly pairs: Array<[Cubic, Cubic]>;

  constructor(start: RoundedPolygon, end: RoundedPolygon) {
    this.pairs = matchPolygons(start, end);
  }

  asCubics(progress: number): Cubic[] {
    const clamped = Math.max(0, Math.min(1, progress));
    const result: Cubic[] = [];
    for (const [a, b] of this.pairs) {
      result.push(a.interpolate(b, clamped));
    }
    return result;
  }

  calculateBounds(): [number, number, number, number] {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const t of [0, 0.5, 1]) {
      for (const c of this.asCubics(t)) {
        for (const [x, y] of [
          [c.anchor0X, c.anchor0Y],
          [c.control0X, c.control0Y],
          [c.control1X, c.control1Y],
          [c.anchor1X, c.anchor1Y],
        ]) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }
    return [minX, minY, maxX, maxY];
  }
}

function matchPolygons(p1: RoundedPolygon, p2: RoundedPolygon): Array<[Cubic, Cubic]> {
  const c1 = resampleToCount(flattenCubics(p1), targetCount(p1, p2));
  const c2 = resampleToCount(flattenCubics(p2), c1.length);
  return c1.map((a, i) => [a, c2[i]]);
}

function targetCount(p1: RoundedPolygon, p2: RoundedPolygon): number {
  return Math.max(flattenCubics(p1).length, flattenCubics(p2).length, 4);
}

function resampleToCount(cubics: Cubic[], count: number): Cubic[] {
  if (cubics.length === count) return cubics;
  if (cubics.length === 0) {
    return Array.from({ length: count }, () => new Cubic([0, 0, 0, 0, 0, 0, 0, 0]));
  }

  const samples = sampleOutline(cubics, Math.max(count * 4, 32));
  const step = samples.length / count;
  const result: Cubic[] = [];

  for (let i = 0; i < count; i++) {
    const idx = Math.min(Math.floor(i * step), samples.length - 2);
    const p0 = samples[idx];
    const p1 = samples[idx + 1];
    const pPrev = samples[Math.max(0, idx - 1)];
    const pNext = samples[Math.min(samples.length - 1, idx + 2)];
    result.push(
      new Cubic([
        p0.x,
        p0.y,
        p0.x + (p1.x - pPrev.x) * 0.15,
        p0.y + (p1.y - pPrev.y) * 0.15,
        p1.x - (pNext.x - p0.x) * 0.15,
        p1.y - (pNext.y - p0.y) * 0.15,
        p1.x,
        p1.y,
      ]),
    );
  }
  return result;
}

function sampleOutline(cubics: Cubic[], totalSamples: number): Array<{ x: number; y: number }> {
  const lengths = cubics.map((c) => c.approximateLength(24));
  const total = lengths.reduce((a, b) => a + b, 0) || 1;
  const pts: Array<{ x: number; y: number }> = [];

  for (let s = 0; s < totalSamples; s++) {
    const dist = (s / totalSamples) * total;
    let acc = 0;
    for (let i = 0; i < cubics.length; i++) {
      const segLen = lengths[i];
      if (acc + segLen >= dist || i === cubics.length - 1) {
        const local = segLen > 0 ? (dist - acc) / segLen : 0;
        pts.push(cubics[i].pointOnCurve(Math.max(0, Math.min(1, local))));
        break;
      }
      acc += segLen;
    }
  }
  return pts;
}
