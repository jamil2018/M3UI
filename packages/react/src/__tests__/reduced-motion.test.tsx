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

  it('animated overlay components use Motion presets inheriting reducedMotion from provider', () => {
    for (const file of ['../lib/overlay-motion.tsx', '../lib/popup-motion.tsx']) {
      const src = readFileSync(join(__dirname, file), 'utf-8');
      expect(src).toContain('motion');
      expect(src).toContain('presets');
    }
  });

  it('progress.a11y test mocks reduced motion for wavy variant', () => {
    const src = readFileSync(join(__dirname, '../components/progress.a11y.test.tsx'), 'utf-8');
    expect(src).toContain('prefersReducedMotion: () => true');
  });
});
