import { describe, it, expect } from 'vitest';
import { STATE_LAYER_OPACITIES, COLOR_ROLES, SYS_TOKEN_VARS } from '../src/index.js';

describe('@m3ui/tokens', () => {
  it('exports state layer opacities matching M3 spec', () => {
    expect(STATE_LAYER_OPACITIES.hover).toBe(0.08);
    expect(STATE_LAYER_OPACITIES.focus).toBe(0.1);
    expect(STATE_LAYER_OPACITIES.pressed).toBe(0.1);
    expect(STATE_LAYER_OPACITIES.dragged).toBe(0.16);
  });

  it('exports all color roles', () => {
    expect(COLOR_ROLES).toContain('primary');
    expect(COLOR_ROLES.length).toBeGreaterThan(30);
  });

  it('exports sys token CSS var names', () => {
    expect(SYS_TOKEN_VARS.length).toBeGreaterThan(0);
    expect(SYS_TOKEN_VARS[0]).toMatch(/^--md-sys-/);
  });
});
