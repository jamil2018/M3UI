import { useEffect, useMemo, useState } from 'react';
import { useMotionValue, useSpring, useReducedMotionConfig, type SpringOptions } from 'motion/react';
import { springs, prefersReducedMotion } from '@m3ui/motion';
import { Morph } from './morph.js';
import { cubicsToClipPath } from './paths.js';
import type { RoundedPolygon } from './rounded-polygon.js';
import {
  MORPH_PROGRESS_STEPS,
  getCachedMorphPaths,
  progressToIndex,
  type PrecomputedMorph,
} from './performance.js';

export interface UseMorphOptions {
  from: RoundedPolygon;
  to: RoundedPolygon;
  /** When true, animates toward `to`; when false, toward `from` */
  active?: boolean;
  transition?: SpringOptions;
  /** Precompute clip-path strings at fixed progress steps (default 60) */
  steps?: number;
  /** Element width for normalized → pixel clip-path (default 1 = unit square) */
  width?: number;
  /** Element height (default matches width) */
  height?: number;
}

export interface UseMorphResult {
  clipPath: string;
  svgPath: string;
  progress: number;
  precomputed: PrecomputedMorph;
}

function polygonId(poly: RoundedPolygon): string {
  // Bounds and segment counts collide for distinct shapes (e.g. rounded squares).
  return poly.cubics.map((c) => [c.anchor0X, c.anchor0Y, c.control0X, c.control0Y,
    c.control1X, c.control1Y, c.anchor1X, c.anchor1Y].join(',')).join(';');
}

function buildPrecomputedMorph(
  from: RoundedPolygon,
  to: RoundedPolygon,
  steps: number,
  width: number,
  height: number,
): PrecomputedMorph {
  const aspectRatio = height > 0 ? width / height : 1;
  const key = `${polygonId(from)}→${polygonId(to)}@${steps}@ar${aspectRatio.toFixed(4)}`;
  const clipPaths = getCachedMorphPaths(key, () => {
    const morph = new Morph(from, to);
    const paths: string[] = [];
    for (let i = 0; i < steps; i++) {
      const progress = i / (steps - 1);
      const cubics = morph.asCubics(progress);
      paths.push(cubicsToClipPath(cubics, aspectRatio));
    }
    return paths;
  });
  return { clipPaths, steps };
}

function cubicsToSvg(cubics: ReturnType<Morph['asCubics']>): string {
  if (cubics.length === 0) return '';
  const parts = [`M ${cubics[0].anchor0X} ${cubics[0].anchor0Y}`];
  for (const c of cubics) {
    parts.push(`C ${c.control0X} ${c.control0Y} ${c.control1X} ${c.control1Y} ${c.anchor1X} ${c.anchor1Y}`);
  }
  parts.push('Z');
  return parts.join(' ');
}

export function useMorph({
  from,
  to,
  active = false,
  transition = springs.fastSpatial,
  steps = MORPH_PROGRESS_STEPS,
  width = 1,
  height = width,
}: UseMorphOptions): UseMorphResult {
  const reduced = useReducedMotionConfig() ?? prefersReducedMotion();
  const target = active ? 1 : 0;
  const morph = useMemo(() => new Morph(from, to), [from, to]);

  const precomputed = useMemo(
    () => buildPrecomputedMorph(from, to, steps, width, height),
    [from, to, steps, width, height],
  );

  const motionTarget = useMotionValue(reduced ? target : active ? 1 : 0);
  const springProgress = useSpring(motionTarget, reduced ? { duration: 0.01 } : transition);

  useEffect(() => {
    motionTarget.set(target);
  }, [target, reduced, motionTarget]);

  const [clipPath, setClipPath] = useState(
    () => precomputed.clipPaths[progressToIndex(target, steps)] ?? 'none',
  );
  const [svgPath, setSvgPath] = useState(() => {
    return cubicsToSvg(morph.asCubics(target));
  });
  const [progress, setProgress] = useState(target);

  useEffect(() => {
    if (reduced) {
      const idx = progressToIndex(target, steps);
      setClipPath(precomputed.clipPaths[idx] ?? 'none');
      setProgress(target);
      setSvgPath(cubicsToSvg(morph.asCubics(target)));
      return;
    }
    const unsub = springProgress.on('change', (p) => {
      const idx = progressToIndex(p, steps);
      setClipPath(precomputed.clipPaths[idx] ?? 'none');
      setProgress(p);
      setSvgPath(cubicsToSvg(morph.asCubics(p)));
    });
    return unsub;
  }, [reduced, target, steps, precomputed, morph, springProgress]);

  return { clipPath, svgPath, progress, precomputed };
}

/** Stagger delay helper for Expressive entrance choreography */
export function staggerDelay(index: number, baseMs = 50, maxMs = 400): number {
  return Math.min(index * baseMs, maxMs);
}

/** Documented Expressive interaction patterns */
export const EXPRESSIVE_PATTERNS = {
  /** Button group neighbor bump — ~15% width shift on press */
  buttonGroupBump: { widenFactor: 1.15, compressFactor: 0.85, spring: 'fastSpatial' as const },
  /** FAB menu item stagger */
  fabMenuStagger: { delayMs: 50, spring: 'defaultSpatial' as const },
  /** Split button chevron rotation on open */
  splitButtonChevron: { openDegrees: 180, spring: 'fastEffects' as const },
  /** Toolbar scroll hide/show */
  toolbarScroll: { spring: 'defaultSpatial' as const },
  /** Loading indicator shape cycle */
  loadingIndicator: { cycleDurationMs: 2000, shapes: 'LoadingIndicatorShapes' as const },
} as const;
