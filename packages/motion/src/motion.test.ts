import { describe, it, expect } from 'vitest';
import { springs, presets, EASING, DURATION_MS, DIALOG_OPEN_ANIMATION } from '../src/index.js';

describe('@m3ui/motion', () => {
  it('exports exact M3 spring values', () => {
    expect(springs.fastSpatial).toEqual({
      type: 'spring',
      stiffness: 800,
      damping: 33.9,
      mass: 1,
    });
    expect(springs.defaultEffects.damping).toBe(80);
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
