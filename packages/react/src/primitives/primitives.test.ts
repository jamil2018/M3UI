import { describe, it, expect } from 'vitest';
import { STATE_LAYER_OPACITIES } from '@m3ui/tokens';

describe('M3 primitives token fidelity', () => {
  it('state layer opacities match spec', () => {
    expect(STATE_LAYER_OPACITIES).toEqual({
      hover: 0.08,
      focus: 0.1,
      pressed: 0.1,
      dragged: 0.16,
    });
  });
});
