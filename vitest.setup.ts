import '@testing-library/jest-dom/vitest';
import * as axeMatchers from 'vitest-axe/matchers';
import { expect } from 'vitest';

expect.extend(axeMatchers);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

/** Base UI Switch uses PointerEvent in jsdom tests */
if (typeof globalThis.PointerEvent === 'undefined') {
  // @ts-expect-error jsdom polyfill
  globalThis.PointerEvent = class PointerEvent extends MouseEvent {
    pointerId = 1;
  };
}

/** Container size class hook uses ResizeObserver */
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {
      return undefined;
    }
    unobserve() {
      return undefined;
    }
    disconnect() {
      return undefined;
    }
  };
}

/** Base UI ScrollArea uses Element.getAnimations in jsdom */
if (typeof Element.prototype.getAnimations === 'undefined') {
  Element.prototype.getAnimations = () => [];
}
