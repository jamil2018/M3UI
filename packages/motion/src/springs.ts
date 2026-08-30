import { CSS_MOTION } from './easing.js';

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


/** CSS cubic-bezier fallbacks for cheap state transitions — token-aligned easing/duration vars */
export const cssTransitions = {
  standard: `opacity ${CSS_MOTION.duration.short2} ${CSS_MOTION.easing.standard}`,
  emphasized: `opacity ${CSS_MOTION.duration.short4} ${CSS_MOTION.easing.emphasized}`,
  stateLayer: `opacity ${CSS_MOTION.duration.short2} ${CSS_MOTION.easing.standard}`,
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
  enter: { opacity: springs.defaultEffects, transform: springs.defaultSpatial },
  exit: { opacity: springs.fastEffects, transform: springs.fastSpatial },
  emphasized: { enter: springs.slowSpatial, exit: springs.fastSpatial },
  selection: { enter: springs.fastSpatial, exit: springs.fastEffects },
  press: { enter: springs.fastSpatial, exit: springs.defaultSpatial },
  containerTransform: { enter: springs.slowSpatial, exit: springs.defaultSpatial },
} as const;

export const semanticTransitions = {
  spatial: presets.spatial,
  effects: presets.effects,
  enter: presets.enter,
  exit: presets.exit,
  emphasized: presets.emphasized,
  selection: presets.selection,
  press: presets.press,
  containerTransform: presets.containerTransform,
} as const;

export type SemanticTransition = keyof typeof semanticTransitions;

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
