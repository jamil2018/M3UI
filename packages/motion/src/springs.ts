/** M3 spring tokens converted to Motion format (damping = ratio * 2 * sqrt(stiffness * mass)) */
export const springs = {
  fastSpatial: { type: 'spring' as const, stiffness: 800, damping: 33.9, mass: 1 },
  defaultSpatial: { type: 'spring' as const, stiffness: 380, damping: 31.2, mass: 1 },
  slowSpatial: { type: 'spring' as const, stiffness: 200, damping: 22.6, mass: 1 },
  fastEffects: { type: 'spring' as const, stiffness: 3800, damping: 123, mass: 1 },
  defaultEffects: { type: 'spring' as const, stiffness: 1600, damping: 80, mass: 1 },
  slowEffects: { type: 'spring' as const, stiffness: 800, damping: 56.6, mass: 1 },
} as const;

export type SpatialSpring = keyof Pick<
  typeof springs,
  'fastSpatial' | 'defaultSpatial' | 'slowSpatial'
>;
export type EffectsSpring = keyof Pick<
  typeof springs,
  'fastEffects' | 'defaultEffects' | 'slowEffects'
>;

/** CSS cubic-bezier fallbacks for cheap state transitions */
export const cssTransitions = {
  standard: 'opacity var(--md-sys-motion-duration-short2, 100ms) var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1))',
  emphasized: 'opacity var(--md-sys-motion-duration-short4, 200ms) var(--md-sys-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1))',
  stateLayer: 'opacity var(--md-sys-motion-duration-short2, 100ms) var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1))',
} as const;

/** Preset transition configs */
export const presets = {
  spatial: {
    enter: springs.defaultSpatial,
    exit: springs.fastSpatial,
  },
  effects: {
    enter: springs.defaultEffects,
    exit: springs.fastEffects,
  },
  fade: {
    enter: springs.defaultEffects,
    exit: springs.fastEffects,
  },
} as const;

/** Reduced motion: instant transitions */
export const reducedMotionTransition = {
  duration: 0.01,
  ease: 'linear' as const,
};

export function getSpring(name: keyof typeof springs) {
  return springs[name];
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
