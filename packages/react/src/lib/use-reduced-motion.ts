import { useSyncExternalStore } from 'react';
import { prefersReducedMotion } from '@m3ui/motion';

function subscribe(onChange: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', onChange);
  return () => {
    media.removeEventListener('change', onChange);
  };
}

/** Subscribes to preference changes while keeping server hydration deterministic. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
