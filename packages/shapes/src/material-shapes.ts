/**
 * Material Design 3 Expressive shape library — ported from MaterialShapes.kt
 * (androidx.compose.material3). Each shape is normalized to the unit square.
 */
import { cornerRounding, type CornerRounding } from './corner-rounding.js';
import { RoundedPolygon } from './rounded-polygon.js';

const R15 = cornerRounding(0.15);
const R20 = cornerRounding(0.2);
const R30 = cornerRounding(0.3);
const R50 = cornerRounding(0.5);
const R100 = cornerRounding(1);

interface PointNRound {
  x: number;
  y: number;
  r?: CornerRounding;
}

function rotatePoint(x: number, y: number, degrees: number, cx = 0, cy = 0): { x: number; y: number } {
  const rad = (degrees * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return {
    x: cx + dx * Math.cos(rad) - dy * Math.sin(rad),
    y: cy + dx * Math.sin(rad) + dy * Math.cos(rad),
  };
}

function scalePolygon(poly: RoundedPolygon, sx: number, sy: number): RoundedPolygon {
  return poly.transformed((x, y) => ({ x: x * sx, y: y * sy }));
}

function doRepeat(
  points: PointNRound[],
  reps: number,
  center: { x: number; y: number },
  mirroring: boolean,
): PointNRound[] {
  if (mirroring) {
    const result: PointNRound[] = [];
    const actualReps = reps * 2;
    const sectionAngle = 360 / actualReps;
    const angles = points.map((p) => Math.atan2(p.y - center.y, p.x - center.x) * (180 / Math.PI));
    const distances = points.map((p) => Math.hypot(p.x - center.x, p.y - center.y));
    for (let it = 0; it < actualReps; it++) {
      for (let index = 0; index < points.length; index++) {
        const i = it % 2 === 0 ? index : points.length - 1 - index;
        if (i > 0 || it % 2 === 0) {
          const a =
            (sectionAngle * it +
              (it % 2 === 0 ? angles[i]! : sectionAngle - angles[i]! + 2 * angles[0]!)) *
            (Math.PI / 180);
          result.push({
            x: center.x + Math.cos(a) * distances[i]!,
            y: center.y + Math.sin(a) * distances[i]!,
            r: points[i]!.r,
          });
        }
      }
    }
    return result;
  }
  const np = points.length;
  const result: PointNRound[] = [];
  for (let it = 0; it < np * reps; it++) {
    const src = points[it % np]!;
    const rotated = rotatePoint(src.x, src.y, (it / np) * (360 / reps), center.x, center.y);
    result.push({ x: rotated.x, y: rotated.y, r: src.r });
  }
  return result;
}

function customPolygon(
  pnr: PointNRound[],
  reps: number,
  center = { x: 0.5, y: 0.5 },
  mirroring = false,
): RoundedPolygon {
  const actual = doRepeat(pnr, reps, center, mirroring);
  const verts = new Float32Array(actual.length * 2);
  const roundings = actual.map((p) => p.r ?? cornerRounding(0));
  for (let i = 0; i < actual.length; i++) {
    verts[i * 2] = actual[i]!.x;
    verts[i * 2 + 1] = actual[i]!.y;
  }
  return RoundedPolygon.fromVertices(verts, cornerRounding(0), roundings, center.x, center.y);
}

function circle(numVertices = 10): RoundedPolygon {
  return RoundedPolygon.circle(numVertices, 0.5, 0.5, 0.5);
}

function square(): RoundedPolygon {
  return RoundedPolygon.rectangle(1, 1, R30, undefined, 0.5, 0.5);
}

function slanted(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.926, y: 0.97, r: cornerRounding(0.189, 0.811) },
      { x: -0.021, y: 0.967, r: cornerRounding(0.187, 0.057) },
    ],
    2,
  );
}

function arch(): RoundedPolygon {
  return RoundedPolygon.rectangle(
    1,
    1,
    R20,
    [R100, R100, R20, R20],
    0.5,
    0.5,
  ).transformed((x, y) => rotatePoint(x, y, -135, 0.5, 0.5));
}

function fan(): RoundedPolygon {
  return customPolygon(
    [
      { x: 1.004, y: 1.0, r: cornerRounding(0.148, 0.417) },
      { x: 0.0, y: 1.0, r: cornerRounding(0.151) },
      { x: 0.0, y: -0.003, r: cornerRounding(0.148) },
      { x: 0.978, y: 0.02, r: cornerRounding(0.803) },
    ],
    1,
  );
}

function arrow(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.5, y: 0.892, r: cornerRounding(0.313) },
      { x: -0.216, y: 1.05, r: cornerRounding(0.207) },
      { x: 0.499, y: -0.16, r: cornerRounding(0.215, 1) },
      { x: 1.225, y: 1.06, r: cornerRounding(0.211) },
    ],
    1,
  );
}

function semiCircle(): RoundedPolygon {
  return RoundedPolygon.rectangle(1.6, 1, R20, [R20, R20, R100, R100], 0.5, 0.5);
}

function oval(): RoundedPolygon {
  return scalePolygon(
    RoundedPolygon.circle(12, 0.5, 0.5, 0.5).transformed((x, y) => rotatePoint(x, y, -45, 0.5, 0.5)),
    1,
    0.64,
  );
}

function pill(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.961, y: 0.039, r: cornerRounding(0.426) },
      { x: 1.001, y: 0.428 },
      { x: 1.0, y: 0.609, r: R100 },
    ],
    2,
    { x: 0.5, y: 0.5 },
    true,
  );
}

function triangle(): RoundedPolygon {
  return RoundedPolygon.regular(3, 0.5, 0.5, 0.5, R20).transformed((x, y) =>
    rotatePoint(x, y, -90, 0.5, 0.5),
  );
}

function diamond(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.5, y: 1.096, r: cornerRounding(0.151, 0.524) },
      { x: 0.04, y: 0.5, r: cornerRounding(0.159) },
    ],
    2,
  );
}

function clamShell(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.171, y: 0.841, r: cornerRounding(0.159) },
      { x: -0.02, y: 0.5, r: cornerRounding(0.14) },
      { x: 0.17, y: 0.159, r: cornerRounding(0.159) },
    ],
    2,
  );
}

function pentagon(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.5, y: -0.009, r: cornerRounding(0.172) },
      { x: 1.03, y: 0.365, r: cornerRounding(0.164) },
      { x: 0.828, y: 0.97, r: cornerRounding(0.169) },
    ],
    1,
    { x: 0.5, y: 0.5 },
    true,
  );
}

function gem(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.499, y: 1.023, r: cornerRounding(0.241, 0.778) },
      { x: -0.005, y: 0.792, r: cornerRounding(0.208) },
      { x: 0.073, y: 0.258, r: cornerRounding(0.228) },
      { x: 0.433, y: 0, r: cornerRounding(0.491) },
    ],
    1,
    { x: 0.5, y: 0.5 },
    true,
  );
}

function sunny(): RoundedPolygon {
  return RoundedPolygon.star(8, 0.8, 1, 0.5, 0.5, R15);
}

function verySunny(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.5, y: 1.08, r: cornerRounding(0.085) },
      { x: 0.358, y: 0.843, r: cornerRounding(0.085) },
    ],
    8,
  );
}

function cookie4(): RoundedPolygon {
  return customPolygon(
    [
      { x: 1.237, y: 1.236, r: cornerRounding(0.258) },
      { x: 0.5, y: 0.918, r: cornerRounding(0.233) },
    ],
    4,
  );
}

function cookie6(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.723, y: 0.884, r: cornerRounding(0.394) },
      { x: 0.5, y: 1.099, r: cornerRounding(0.398) },
    ],
    6,
  );
}

function cookie7(): RoundedPolygon {
  return RoundedPolygon.star(7, 0.75, 1, 0.5, 0.5, R50).transformed((x, y) =>
    rotatePoint(x, y, -90, 0.5, 0.5),
  );
}

function cookie9(): RoundedPolygon {
  return RoundedPolygon.star(9, 0.8, 1, 0.5, 0.5, R50).transformed((x, y) =>
    rotatePoint(x, y, -90, 0.5, 0.5),
  );
}

function cookie12(): RoundedPolygon {
  return RoundedPolygon.star(12, 0.8, 1, 0.5, 0.5, R50).transformed((x, y) =>
    rotatePoint(x, y, -90, 0.5, 0.5),
  );
}

function ghostish(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.5, y: 0, r: R100 },
      { x: 1, y: 0, r: R100 },
      { x: 1, y: 1.14, r: cornerRounding(0.254, 0.106) },
      { x: 0.575, y: 0.906, r: cornerRounding(0.253) },
    ],
    1,
    { x: 0.5, y: 0.5 },
    true,
  );
}

function clover4(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.5, y: 0.074 },
      { x: 0.725, y: -0.099, r: cornerRounding(0.476) },
    ],
    4,
    { x: 0.5, y: 0.5 },
    true,
  );
}

function clover8(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.5, y: 0.036 },
      { x: 0.758, y: -0.101, r: cornerRounding(0.209) },
    ],
    8,
  );
}

function burst(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.5, y: -0.006, r: cornerRounding(0.006) },
      { x: 0.592, y: 0.158, r: cornerRounding(0.006) },
    ],
    12,
  );
}

function softBurst(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.193, y: 0.277, r: cornerRounding(0.053) },
      { x: 0.176, y: 0.055, r: cornerRounding(0.053) },
    ],
    10,
  );
}

function boom(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.457, y: 0.296, r: cornerRounding(0.007) },
      { x: 0.5, y: -0.051, r: cornerRounding(0.007) },
    ],
    15,
  );
}

function softBoom(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.733, y: 0.454 },
      { x: 0.839, y: 0.437, r: cornerRounding(0.532) },
      { x: 0.949, y: 0.449, r: cornerRounding(0.439, 1) },
      { x: 0.998, y: 0.478, r: cornerRounding(0.174) },
    ],
    16,
    { x: 0.5, y: 0.5 },
    true,
  );
}

function flower(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.37, y: 0.187 },
      { x: 0.416, y: 0.049, r: cornerRounding(0.381) },
      { x: 0.479, y: 0.001, r: cornerRounding(0.095) },
    ],
    8,
    { x: 0.5, y: 0.5 },
    true,
  );
}

function puffy(): RoundedPolygon {
  const poly = customPolygon(
    [
      { x: 0.5, y: 0.053 },
      { x: 0.545, y: -0.04, r: cornerRounding(0.405) },
      { x: 0.67, y: -0.035, r: cornerRounding(0.426) },
      { x: 0.717, y: 0.066, r: cornerRounding(0.574) },
      { x: 0.722, y: 0.128 },
      { x: 0.777, y: 0.002, r: cornerRounding(0.36) },
      { x: 0.914, y: 0.149, r: cornerRounding(0.66) },
      { x: 0.926, y: 0.289, r: cornerRounding(0.66) },
      { x: 0.881, y: 0.346 },
      { x: 0.94, y: 0.344, r: cornerRounding(0.126) },
      { x: 1.003, y: 0.437, r: cornerRounding(0.255) },
    ],
    2,
    { x: 0.5, y: 0.5 },
    true,
  );
  return scalePolygon(poly, 1, 0.742);
}

function puffyDiamond(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.87, y: 0.13, r: cornerRounding(0.146) },
      { x: 0.818, y: 0.357 },
      { x: 1.0, y: 0.332, r: cornerRounding(0.853) },
    ],
    4,
    { x: 0.5, y: 0.5 },
    true,
  );
}

function pixelCircle(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.5, y: 0 },
      { x: 0.704, y: 0 },
      { x: 0.704, y: 0.065 },
      { x: 0.843, y: 0.065 },
      { x: 0.843, y: 0.148 },
      { x: 0.926, y: 0.148 },
      { x: 0.926, y: 0.296 },
      { x: 1.0, y: 0.296 },
    ],
    2,
    { x: 0.5, y: 0.5 },
    true,
  );
}

function pixelTriangle(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.11, y: 0.5 },
      { x: 0.113, y: 0 },
      { x: 0.287, y: 0 },
      { x: 0.287, y: 0.087 },
      { x: 0.421, y: 0.087 },
      { x: 0.421, y: 0.17 },
      { x: 0.56, y: 0.17 },
      { x: 0.56, y: 0.265 },
      { x: 0.674, y: 0.265 },
      { x: 0.675, y: 0.344 },
      { x: 0.789, y: 0.344 },
      { x: 0.789, y: 0.439 },
      { x: 0.888, y: 0.439 },
    ],
    1,
    { x: 0.5, y: 0.5 },
    true,
  );
}

function bun(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.796, y: 0.5 },
      { x: 0.853, y: 0.518, r: R100 },
      { x: 0.992, y: 0.631, r: R100 },
      { x: 0.968, y: 1.0, r: R100 },
    ],
    2,
    { x: 0.5, y: 0.5 },
    true,
  );
}

function heart(): RoundedPolygon {
  return customPolygon(
    [
      { x: 0.5, y: 0.268, r: cornerRounding(0.016) },
      { x: 0.792, y: -0.066, r: cornerRounding(0.958) },
      { x: 0.974, y: 0.066, r: cornerRounding(0.958) },
      { x: 0.926, y: 0.534, r: cornerRounding(0.129) },
      { x: 0.501, y: 0.946, r: cornerRounding(0.129) },
    ],
    1,
    { x: 0.5, y: 0.5 },
    true,
  );
}

const SHAPE_FACTORIES = {
  circle,
  square,
  slanted,
  arch,
  fan,
  arrow,
  semiCircle,
  oval,
  pill,
  triangle,
  diamond,
  clamShell,
  pentagon,
  gem,
  sunny,
  verySunny,
  cookie4Sided: cookie4,
  cookie6Sided: cookie6,
  cookie7Sided: cookie7,
  cookie9Sided: cookie9,
  cookie12Sided: cookie12,
  ghostish,
  clover4Leaf: clover4,
  clover8Leaf: clover8,
  burst,
  softBurst,
  boom,
  softBoom,
  flower,
  puffy,
  puffyDiamond,
  pixelCircle,
  pixelTriangle,
  bun,
  heart,
} as const;

export type MaterialShapeName = keyof typeof SHAPE_FACTORIES;

/** All 35 Expressive Material shapes as normalized RoundedPolygons */
export const MaterialShapes: Record<MaterialShapeName, RoundedPolygon> = Object.fromEntries(
  Object.entries(SHAPE_FACTORIES).map(([name, factory]) => [name, factory().normalized()]),
) as Record<MaterialShapeName, RoundedPolygon>;

/** Default loading indicator morph sequence (matches M3 Compose) */
export const LoadingIndicatorShapes: RoundedPolygon[] = [
  MaterialShapes.softBurst,
  MaterialShapes.cookie9Sided,
  MaterialShapes.pentagon,
  MaterialShapes.pill,
  MaterialShapes.sunny,
  MaterialShapes.cookie4Sided,
  MaterialShapes.oval,
];

export const MATERIAL_SHAPE_NAMES = Object.keys(SHAPE_FACTORIES) as MaterialShapeName[];
