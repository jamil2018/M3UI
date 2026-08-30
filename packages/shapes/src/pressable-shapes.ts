import { MaterialShapes, type MaterialShapeName } from './material-shapes.js';
import type { RoundedPolygon } from './rounded-polygon.js';

/** Rest/pressed polygon pair for Expressive pressable controls. */
export interface PressableShapePair {
  rest: RoundedPolygon;
  pressed: RoundedPolygon;
}

/**
 * Default Expressive press morph endpoints (M3 Compose MaterialShapes press contract).
 * Round controls morph circle → cookie4Sided; square controls morph square → cookie4Sided.
 */
export const PRESSABLE_SHAPE_PRESETS = {
  round: {
    rest: MaterialShapes.circle,
    pressed: MaterialShapes.cookie4Sided,
  },
  square: {
    rest: MaterialShapes.square,
    pressed: MaterialShapes.cookie4Sided,
  },
} as const satisfies Record<'round' | 'square', PressableShapePair>;

export type PressableShapePreset = keyof typeof PRESSABLE_SHAPE_PRESETS;

/** Selected-state toggle morph used by icon buttons (pentagon ↔ circle). */
export const TOGGLE_SHAPE_PRESETS = {
  selected: {
    rest: MaterialShapes.pentagon,
    pressed: MaterialShapes.circle,
  },
  unselected: {
    rest: MaterialShapes.circle,
    pressed: MaterialShapes.pentagon,
  },
} as const satisfies Record<'selected' | 'unselected', PressableShapePair>;

export function getPressableShapePair(preset: PressableShapePreset): PressableShapePair {
  return PRESSABLE_SHAPE_PRESETS[preset];
}

/**
 * Integration contract for ripple and focus-ring primitives with Expressive polygon clip-path.
 *
 * Consumers: `PressableShell` in `@m3ui/react` stacks primitives outside the clipped surface.
 *
 * ## Ripple (`packages/react/src/primitives/ripple.tsx`)
 * - Ripple host uses `border-radius: inherit` and `overflow: hidden` so the radial-gradient
 *   press state respects the same bounds as the morph target.
 * - Apply `clip-path` on the inner pressable element (inside Ripple → FocusRing → StateLayer),
 *   not on the ripple host, so pointer routing and `::after` WAAPI growth stay aligned.
 * - Pass `color={stateLayerColor}` when the control uses `on-primary` / `on-surface` content.
 *
 * ## Focus ring (`packages/react/src/primitives/focus-ring.tsx`)
 * - Default outward ring follows `border-radius: inherit`; polygon `clip-path` does not affect
 *   `outline`, so polygon pressables should either:
 *   1. Set `--md-focus-ring-shape-*` corners to match the rest polygon, or
 *   2. Use `inward` mode so the ring draws inside the clipped pressable.
 * - Keep FocusRing outside the `clip-path` element but inside Ripple so focus visibility is
 *   not clipped by morph progress.
 *
 * ## State layer (`packages/react/src/lib/state-layer.tsx`)
 * - State layer sits between FocusRing and the clipped pressable; it inherits the same
 *   `border-radius` / bounding box as the morph target for hover/pressed overlays.
 */
export const PRIMITIVE_SHAPE_INTEGRATION = {
  ripple: {
    clipPathTarget: 'inner-pressable',
    hostRequires: ['border-radius: inherit', 'overflow: hidden'],
    colorVar: '--m3-ripple-pressed-color',
  },
  focusRing: {
    outwardShapeVars: [
      '--md-focus-ring-shape-start-start',
      '--md-focus-ring-shape-start-end',
      '--md-focus-ring-shape-end-start',
      '--md-focus-ring-shape-end-end',
    ] as const,
    polygonGuidance: 'Use inward mode or per-corner shape vars when clip-path is active.',
  },
  morph: {
    defaultPresets: PRESSABLE_SHAPE_PRESETS,
    hook: 'useMorph',
    clipPathEmitter: 'cubicsToClipPath',
  },
} as const;

/** Documented shape names for each preset (for catalog / parity tooling). */
export const PRESSABLE_PRESET_SHAPE_NAMES: Record<
  PressableShapePreset,
  { rest: MaterialShapeName; pressed: MaterialShapeName }
> = {
  round: { rest: 'circle', pressed: 'cookie4Sided' },
  square: { rest: 'square', pressed: 'cookie4Sided' },
};
