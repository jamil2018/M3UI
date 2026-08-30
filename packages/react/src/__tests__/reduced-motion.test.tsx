import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Components that call prefersReducedMotion() directly */
const DIRECT_REDUCED_MOTION_SOURCES = [
  '../components/progress.tsx',
  '../components/loading-indicator.tsx',
  '../components/slider.tsx',
  '../provider/m3-provider.tsx',
];

/** WAAPI popup paths that gate animations on prefersReducedMotion */
const WAAPI_REDUCED_MOTION_SOURCES = [
  '../lib/use-popup-waapi.ts',
  '../lib/menu-motion.tsx',
  '../lib/dialog-motion.tsx',
];

/** Motion-preset paths inheriting reducedMotion from M3Provider */
const PRESET_REDUCED_MOTION_SOURCES = [
  '../lib/overlay-motion.tsx',
  '../lib/popup-motion.tsx',
  '../components/dialog.tsx',
  '../components/menu.tsx',
];

/** Primitives with CSS-level reduced-motion or forced-colors fallbacks */
const PRIMITIVE_REDUCED_MOTION_SOURCES = [
  '../primitives/focus-ring.tsx',
  '../primitives/ripple.tsx',
];

describe('prefers-reduced-motion coverage', () => {
  it('motion.css defines global reduced-motion fallbacks', () => {
    const css = readFileSync(join(__dirname, '../../../motion/src/motion.css'), 'utf-8');
    expect(css).toContain('prefers-reduced-motion: reduce');
    expect(css).toContain('animation-duration: 0.01ms');
  });

  it.each(DIRECT_REDUCED_MOTION_SOURCES)('%s references prefersReducedMotion', (relPath) => {
    const src = readFileSync(join(__dirname, relPath), 'utf-8');
    expect(src).toMatch(/prefersReducedMotion/);
  });

  it('M3Provider wires prefersReducedMotion into MotionConfig', () => {
    const src = readFileSync(join(__dirname, '../provider/m3-provider.tsx'), 'utf-8');
    expect(src).toContain('reducedMotion={reducedMotion');
    expect(src).toContain('reducedMotionTransition');
  });

  it.each(WAAPI_REDUCED_MOTION_SOURCES)('%s gates WAAPI on prefersReducedMotion', (relPath) => {
    const src = readFileSync(join(__dirname, relPath), 'utf-8');
    expect(src).toMatch(/prefersReducedMotion|prefers-reduced-motion/);
  });

  it.each(PRESET_REDUCED_MOTION_SOURCES)(
    '%s uses Motion presets inheriting reducedMotion from provider',
    (relPath) => {
      const src = readFileSync(join(__dirname, relPath), 'utf-8');
      const usesPresets = src.includes('presets');
      const usesOverlayMotion = src.includes('OverlayMotion') || src.includes('MenuMotionPopup');
      expect(usesPresets || usesOverlayMotion).toBe(true);
    },
  );

  it.each(PRIMITIVE_REDUCED_MOTION_SOURCES)(
    '%s defines accessibility motion fallbacks in injected styles',
    (relPath) => {
      const src = readFileSync(join(__dirname, relPath), 'utf-8');
      expect(src).toMatch(/prefers-reduced-motion|forced-colors/);
    },
  );

  it('progress.a11y test mocks reduced motion for wavy variant', () => {
    const src = readFileSync(join(__dirname, '../components/progress.a11y.test.tsx'), 'utf-8');
    expect(src).toContain('prefersReducedMotion: () => true');
  });
});
