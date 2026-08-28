import { describe, it, expect } from 'vitest';
import { springs, presets } from '../src/index.js';

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
});
