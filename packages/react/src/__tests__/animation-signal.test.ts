import { describe, it, expect } from 'vitest';
import { createAnimationSignal } from '../lib/animation-signal.js';

describe('createAnimationSignal', () => {
  it('aborts the previous signal when start is called again', () => {
    const signal = createAnimationSignal();
    const first = signal.start();
    const second = signal.start();

    expect(first.aborted).toBe(true);
    expect(second.aborted).toBe(false);
  });

  it('clears the active controller on finish', () => {
    const signal = createAnimationSignal();
    const active = signal.start();
    signal.finish();
    const next = signal.start();

    expect(active.aborted).toBe(false);
    expect(next.aborted).toBe(false);
  });
});
