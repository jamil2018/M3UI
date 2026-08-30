import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  MENU_CLOSE_DURATION,
  MENU_END_HEIGHT_RATIO,
  MENU_OPEN_DURATION,
  createMenuCloseAnimations,
  createMenuOpenAnimations,
} from '../lib/menu-animations.js';
import { EASING } from '@m3ui/motion';

describe('menu WAAPI animations', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'Animation',
      class {
        finished = Promise.resolve();
        cancel = vi.fn();
        addEventListener = vi.fn();
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function mockElement() {
    return {
      offsetHeight: 200,
      classList: { add: vi.fn(), remove: vi.fn() },
      animate: vi.fn(() => new Animation()),
      querySelectorAll: vi.fn(() => []),
    } as unknown as HTMLElement;
  }

  it('uses 500ms emphasized open with item stagger and upward correction', () => {
    const surface = mockElement();
    const slot = mockElement();
    const items = [mockElement(), mockElement()];
    const signal = new AbortController().signal;

    const animations = createMenuOpenAnimations(
      { surface, slot, items, openingUpwards: true },
      signal,
    );

    expect(MENU_OPEN_DURATION).toBe(500);
    expect(animations.length).toBeGreaterThan(0);
    expect(surface.animate).toHaveBeenCalledWith(
      [{ height: '0px' }, { height: '200px' }],
      { duration: 500, easing: EASING.EMPHASIZED },
    );
    expect(slot.animate).toHaveBeenCalledWith(
      [{ transform: 'translateY(-200px)' }, { transform: '' }],
      { duration: 500, easing: EASING.EMPHASIZED },
    );
    expect(items[0].animate).toHaveBeenCalled();
    expect(items[1].animate).toHaveBeenCalled();
  });

  it('uses 150ms emphasized-accelerate close shrinking to 35% height', () => {
    const surface = mockElement();
    const slot = mockElement();
    const items = [mockElement()];
    const signal = new AbortController().signal;

    createMenuCloseAnimations({ surface, slot, items, openingUpwards: true }, signal);

    expect(MENU_CLOSE_DURATION).toBe(150);
    expect(MENU_END_HEIGHT_RATIO).toBe(0.35);
    expect(surface.animate).toHaveBeenCalledWith(
      [{ height: '200px' }, { height: `${200 * 0.35}px` }],
      { duration: 150, easing: EASING.EMPHASIZED_ACCELERATE },
    );
    expect(slot.animate).toHaveBeenCalledWith(
      [{ transform: '' }, { transform: `translateY(-${200 * 0.65}px)` }],
      { duration: 150, easing: EASING.EMPHASIZED_ACCELERATE },
    );
  });
});
