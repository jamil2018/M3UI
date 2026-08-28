import { useEffect, useMemo, useState } from 'react';
import { useMotionValue, useSpring, useTransform, type SpringOptions } from 'motion/react';
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
  const b = poly.calculateBounds();
  return `${poly.cubics.length}:${b.map((n) => n.toFixed(3)).join(',')}`;
}

function buildPrecomputedMorph(
  from: RoundedPolygon,
  to: RoundedPolygon,
  steps: number,
  width: number,
  height: number,
): PrecomputedMorph {
  const key = `${polygonId(from)}→${polygonId(to)}@${steps}`;
  const clipPaths = getCachedMorphPaths(key, () => {
    const morph = new Morph(from, to);
    const paths: string[] = [];
    for (let i = 0; i < steps; i++) {
      const progress = i / (steps - 1);
      const cubics = morph.asCubics(progress);
      const normalized = cubicsToClipPath(cubics);
      if (width === 1 && height === 1) {
        paths.push(normalized);
      } else {
        // Scale path coordinates for element size
        const scaled = scaleClipPath(normalized, width, height);
        paths.push(scaled);
      }
    }
    return paths;
  });
  return { clipPaths, steps };
}

function scaleClipPath(clipPath: string, width: number, height: number): string {
  const match = /path\('([^']+)'\)/.exec(clipPath);
  if (!match?.[1]) return clipPath;
  let coordIndex = 0;
  const scaled = match[1].replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, (n) => {
    const v = parseFloat(n);
    const scale = coordIndex++ % 2 === 0 ? width : height;
    return String(v * scale);
  });
  return `path('${scaled}')`;
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
  const reduced = prefersReducedMotion();
  const target = active ? 1 : 0;

  const precomputed = useMemo(
    () => buildPrecomputedMorph(from, to, steps, width, height),
    [from, to, steps, width, height],
  );

  const motionTarget = useMotionValue(reduced ? target : active ? 0 : 0);
  const springProgress = useSpring(motionTarget, reduced ? { duration: 0.01 } : transition);

  useEffect(() => {
    motionTarget.set(reduced ? target : target);
  }, [target, reduced, motionTarget]);

  const [clipPath, setClipPath] = useState(precomputed.clipPaths[0] ?? 'none');
  const [svgPath, setSvgPath] = useState('');
  const [progress, setProgress] = useState(0);

  const indexTransform = useTransform(springProgress, (p) => progressToIndex(p, steps));

  useEffect(() => {
    if (reduced) {
      const idx = progressToIndex(target, steps);
      setClipPath(precomputed.clipPaths[idx] ?? 'none');
      setProgress(target);
      const morph = new Morph(from, to);
      setSvgPath(cubicsToSvg(morph.asCubics(target)));
      return;
    }
    const unsub = springProgress.on('change', (p) => {
      const idx = progressToIndex(p, steps);
      setClipPath(precomputed.clipPaths[idx] ?? 'none');
      setProgress(p);
    });
    return unsub;
  }, [reduced, target, steps, precomputed, from, to, springProgress]);

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
