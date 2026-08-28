export { Cubic, interpolateValue } from './cubic.js';
export { cornerRounding, CornerUnrounded, type CornerRounding } from './corner-rounding.js';
export { RoundedPolygon, flattenCubics, type PointTransformer } from './rounded-polygon.js';
export { Morph } from './morph.js';
export { cubicsToSvgPath, cubicsToClipPath, svgPathForSize } from './paths.js';
export {
  MaterialShapes,
  LoadingIndicatorShapes,
  MATERIAL_SHAPE_NAMES,
  type MaterialShapeName,
} from './material-shapes.js';
export {
  MORPH_PROGRESS_STEPS,
  MORPH_PERFORMANCE_BUDGET,
  getCachedMorphPaths,
  clearMorphCache,
  progressToIndex,
  shouldUseMorphApproximation,
  type PrecomputedMorph,
} from './performance.js';
export {
  useMorph,
  staggerDelay,
  EXPRESSIVE_PATTERNS,
  type UseMorphOptions,
  type UseMorphResult,
} from './use-morph.js';
