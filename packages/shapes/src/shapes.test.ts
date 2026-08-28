import { describe, it, expect } from 'vitest';
import { Morph } from './morph.js';
import { cubicsToClipPath, cubicsToSvgPath } from './paths.js';
import {
  MaterialShapes,
  LoadingIndicatorShapes,
  MATERIAL_SHAPE_NAMES,
} from './material-shapes.js';
import { RoundedPolygon } from './rounded-polygon.js';
import { progressToIndex, MORPH_PROGRESS_STEPS } from './performance.js';

describe('MaterialShapes library', () => {
  it('exports all 35 named shapes', () => {
    expect(MATERIAL_SHAPE_NAMES.length).toBe(35);
    for (const name of MATERIAL_SHAPE_NAMES) {
      expect(MaterialShapes[name]).toBeInstanceOf(RoundedPolygon);
      expect(MaterialShapes[name].cubics.length).toBeGreaterThan(0);
    }
  });

  it('provides loading indicator shape sequence', () => {
    expect(LoadingIndicatorShapes.length).toBe(7);
  });
});

describe('path emitters', () => {
  it('emits valid SVG path and clip-path', () => {
    const poly = MaterialShapes.circle;
    const d = cubicsToSvgPath(poly.cubics);
    expect(d).toMatch(/^M /);
    expect(d).toContain('C ');
    const clip = cubicsToClipPath(poly.cubics);
    expect(clip).toMatch(/^path\('/);
  });
});

describe('Morph endpoint fidelity', () => {
  const pairs: Array<[keyof typeof MaterialShapes, keyof typeof MaterialShapes]> = [
    ['circle', 'cookie9Sided'],
    ['square', 'triangle'],
    ['pill', 'pentagon'],
    ['softBurst', 'cookie9Sided'],
  ];

  it.each(pairs)('progress 0/1 matches endpoints for %s → %s', (fromName, toName) => {
    const from = MaterialShapes[fromName];
    const to = MaterialShapes[toName];
    const morph = new Morph(from, to);

    const at0 = morph.asCubics(0);
    const at1 = morph.asCubics(1);

    expect(at0.length).toBeGreaterThan(0);
    expect(at1.length).toBe(at0.length);

    // First anchor at progress 0 should match start shape first anchor
    expect(at0[0].anchor0X).toBeCloseTo(from.cubics[0].anchor0X, 1);
    expect(at0[0].anchor0Y).toBeCloseTo(from.cubics[0].anchor0Y, 1);
  });
});

describe('Morph self-intersection (property)', () => {
  it('has no obvious self-intersection at morph endpoints for loading indicator pairs', () => {
    for (let i = 0; i < LoadingIndicatorShapes.length - 1; i++) {
      const from = LoadingIndicatorShapes[i];
      const to = LoadingIndicatorShapes[i + 1];
      const morph = new Morph(from, to);
      for (const p of [0, 1]) {
        const cubics = morph.asCubics(p);
        expect(hasSimpleSelfIntersection(cubics)).toBe(false);
      }
    }
  });
});

function hasSimpleSelfIntersection(cubics: ReturnType<Morph['asCubics']>): boolean {
  const segments: Array<[[number, number], [number, number]]> = [];
  for (const c of cubics) {
    segments.push([
      [c.anchor0X, c.anchor0Y],
      [c.anchor1X, c.anchor1Y],
    ]);
  }
  for (let i = 0; i < segments.length; i++) {
    for (let j = i + 2; j < segments.length; j++) {
      if (i === 0 && j === segments.length - 1) continue;
      if (segmentsIntersect(segments[i], segments[j])) return true;
    }
  }
  return false;
}

function segmentsIntersect(
  a: [[number, number], [number, number]],
  b: [[number, number], [number, number]],
): boolean {
  const [p1, p2] = a;
  const [p3, p4] = b;
  const d = (p2[0] - p1[0]) * (p4[1] - p3[1]) - (p2[1] - p1[1]) * (p4[0] - p3[0]);
  if (Math.abs(d) < 1e-9) return false;
  const t = ((p3[0] - p1[0]) * (p4[1] - p3[1]) - (p3[1] - p1[1]) * (p4[0] - p3[0])) / d;
  const u = ((p3[0] - p1[0]) * (p2[1] - p1[1]) - (p3[1] - p1[1]) * (p2[0] - p1[0])) / d;
  return t > 0.01 && t < 0.99 && u > 0.01 && u < 0.99;
}

describe('performance precompute', () => {
  it('maps progress to discrete step index', () => {
    expect(progressToIndex(0, MORPH_PROGRESS_STEPS)).toBe(0);
    expect(progressToIndex(1, MORPH_PROGRESS_STEPS)).toBe(MORPH_PROGRESS_STEPS - 1);
  });
});
