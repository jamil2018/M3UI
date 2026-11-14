import { describe, it, expect } from 'vitest';
import { springs, presets, EASING, DURATION_MS, DIALOG_OPEN_ANIMATION } from '../src/index.js';
import { readFileSync } from 'node:fs';

describe('@m3ui/motion', () => {
  it('exports exact M3 Expressive spring values', () => {
    expect(springs.fastSpatial).toEqual({
      type: 'spring',
      stiffness: 800,
      damping: 0.6 * 2 * Math.sqrt(800),
      mass: 1,
    });
    expect(springs.defaultSpatial).toEqual({
      type: 'spring',
      stiffness: 380,
      damping: 0.8 * 2 * Math.sqrt(380),
      mass: 1,
    });
    expect(springs.defaultEffects.damping).toBe(80);
    expect(springs.fastEffects.damping).toBe(2 * Math.sqrt(3800));
  });

  it('keeps effects critically damped and spatial motion expressive', () => {
    for (const name of ['fastEffects', 'defaultEffects', 'slowEffects'] as const) {
      const s = springs[name];
      expect(s.damping / (2 * Math.sqrt(s.stiffness * s.mass))).toBeCloseTo(1);
    }
    for (const name of ['fastSpatial', 'defaultSpatial', 'slowSpatial'] as const) {
      const s = springs[name];
      expect(s.damping / (2 * Math.sqrt(s.stiffness * s.mass))).toBeLessThan(1);
    }
  });

  it('keeps generated CSS springs consistent with runtime physics', () => {
    const css = readFileSync(new URL('../../tokens/src/generated/tokens.css', import.meta.url), 'utf8');
    for (const [name, spring] of Object.entries(springs)) {
      const token = name.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
      const stiffness = Number(css.match(new RegExp(`--md-sys-motion-spring-${token}-stiffness: ([\\d.]+)`))?.[1]);
      const ratio = Number(css.match(new RegExp(`--md-sys-motion-spring-${token}-damping: ([\\d.]+)`))?.[1]);
      expect(stiffness).toBe(spring.stiffness);
      expect(ratio * 2 * Math.sqrt(stiffness)).toBeCloseTo(spring.damping);
    }
  });

  it('provides spatial and effects presets', () => {
    expect(presets.spatial.enter).toBe(springs.defaultSpatial);
    expect(presets.effects.enter).toBe(springs.defaultEffects);
  });

  it('uses labs/gb token easing for EMPHASIZED, not MWC TS approximation', () => {
    expect(EASING.EMPHASIZED).toBe('cubic-bezier(0.2, 0, 0, 1)');
    expect(EASING.EMPHASIZED).not.toBe('cubic-bezier(.3,0,0,1)');
  });

  it('exports dialog open animation with 500ms emphasized translateY', () => {
    expect(DURATION_MS.long2).toBe(500);
    const dialogAnim = DIALOG_OPEN_ANIMATION.dialog?.[0];
    expect(dialogAnim?.[1]).toMatchObject({ duration: 500, easing: EASING.EMPHASIZED });
  });
});
