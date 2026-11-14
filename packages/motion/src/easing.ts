/**
 * Token-aligned easing curves from labs/gb motion tokens.
 * Values must match @m3ui/tokens MOTION_EASING / tokens.css — not
 * internal/motion/animation.ts approximations (EMPHASIZED is 0.2,0,0,1 not .3,0,0,1).
 */
export const EASING = {
  LINEAR: 'cubic-bezier(0, 0, 1, 1)',
  STANDARD: 'cubic-bezier(0.2, 0, 0, 1)',
  STANDARD_ACCELERATE: 'cubic-bezier(0.3, 0, 1, 1)',
  STANDARD_DECELERATE: 'cubic-bezier(0, 0, 0, 1)',
  EMPHASIZED: 'cubic-bezier(0.2, 0, 0, 1)',
  EMPHASIZED_ACCELERATE: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  EMPHASIZED_DECELERATE: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  /** Exact labs/gb M3 Expressive fast-spatial CSS spring curve (button/icon-button press morph) */
  EXPRESSIVE_FAST_SPATIAL: 'cubic-bezier(0.42, 1.67, 0.21, 0.9)',
} as const;

/** Motion duration values in milliseconds — aligned with @m3ui/tokens MOTION_DURATIONS. */
export const DURATION_MS = {
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  extraLong1: 700,
  extraLong2: 800,
  extraLong3: 900,
  extraLong4: 1000,
} as const;

/** CSS custom-property references for transitions. */
export const CSS_MOTION = {
  duration: {
    short1: 'var(--md-sys-motion-duration-short1)',
    short2: 'var(--md-sys-motion-duration-short2)',
    short3: 'var(--md-sys-motion-duration-short3)',
    short4: 'var(--md-sys-motion-duration-short4)',
    medium1: 'var(--md-sys-motion-duration-medium1)',
    medium2: 'var(--md-sys-motion-duration-medium2)',
    medium3: 'var(--md-sys-motion-duration-medium3)',
    medium4: 'var(--md-sys-motion-duration-medium4)',
    long1: 'var(--md-sys-motion-duration-long1)',
    long2: 'var(--md-sys-motion-duration-long2)',
    long3: 'var(--md-sys-motion-duration-long3)',
    long4: 'var(--md-sys-motion-duration-long4)',
  },
  easing: {
    standard: 'var(--md-sys-motion-easing-standard)',
    standardAccelerate: 'var(--md-sys-motion-easing-standard-accelerate)',
    standardDecelerate: 'var(--md-sys-motion-easing-standard-decelerate)',
    emphasized: 'var(--md-sys-motion-easing-emphasized)',
    emphasizedAccelerate: 'var(--md-sys-motion-easing-emphasized-accelerate)',
    emphasizedDecelerate: 'var(--md-sys-motion-easing-emphasized-decelerate)',
    expressiveFastSpatial: 'cubic-bezier(0.42, 1.67, 0.21, 0.9)',
  },
} as const;
