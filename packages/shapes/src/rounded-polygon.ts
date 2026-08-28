import { Cubic } from './cubic.js';
import { type CornerRounding, CornerUnrounded } from './corner-rounding.js';

const DIST_EPSILON = 1e-4;

export type PointTransformer = (x: number, y: number) => { x: number; y: number };

export class RoundedPolygon {
  readonly cubics: Cubic[];
  readonly centerX: number;
  readonly centerY: number;

  constructor(cubics: Cubic[], centerX: number, centerY: number) {
    this.cubics = cubics;
    this.centerX = centerX;
    this.centerY = centerY;
  }

  transformed(fn: PointTransformer): RoundedPolygon {
    const mapCubic = (c: Cubic) => {
      const p = c.points;
      const pts: number[] = [];
      for (let i = 0; i < 8; i += 2) {
        const { x, y } = fn(p[i], p[i + 1]);
        pts.push(x, y);
      }
      return new Cubic(pts);
    };
    const center = fn(this.centerX, this.centerY);
    return new RoundedPolygon(this.cubics.map(mapCubic), center.x, center.y);
  }

  normalized(): RoundedPolygon {
    const bounds = this.calculateBounds();
    const width = bounds[2] - bounds[0];
    const height = bounds[3] - bounds[1];
    const side = Math.max(width, height, 1e-6);
    const offsetX = (side - width) / 2 - bounds[0];
    const offsetY = (side - height) / 2 - bounds[1];
    return this.transformed((x, y) => ({
      x: (x + offsetX) / side,
      y: (y + offsetY) / side,
    }));
  }

  calculateBounds(approximate = true): [number, number, number, number] {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const c of this.cubics) {
      const pts = approximate
        ? [
            [c.anchor0X, c.anchor0Y],
            [c.control0X, c.control0Y],
            [c.control1X, c.control1Y],
            [c.anchor1X, c.anchor1Y],
          ]
        : sampleCubic(c, 8);
      for (const [x, y] of pts) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    return [minX, minY, maxX, maxY];
  }

  static fromVertices(
    vertices: ArrayLike<number>,
    rounding: CornerRounding = CornerUnrounded,
    perVertexRounding?: CornerRounding[],
    centerX = Number.NaN,
    centerY = Number.NaN,
  ): RoundedPolygon {
    const n = vertices.length / 2;
    if (n < 3) throw new Error('RoundedPolygon requires at least 3 vertices');

    const cx =
      Number.isNaN(centerX) ? averageCoord(vertices, 0, n) : centerX;
    const cy =
      Number.isNaN(centerY) ? averageCoord(vertices, 1, n) : centerY;

    const roundings: CornerRounding[] =
      perVertexRounding ?? Array.from({ length: n }, () => rounding);

    const cubics = buildRoundedCubics(vertices, n, roundings);
    return new RoundedPolygon(cubics, cx, cy);
  }

  static circle(
    numVertices = 10,
    radius = 1,
    centerX = 0,
    centerY = 0,
    rounding: CornerRounding = { radius: 1, smoothing: 0 },
  ): RoundedPolygon {
    const verts = new Float32Array(numVertices * 2);
    for (let i = 0; i < numVertices; i++) {
      const a = (i / numVertices) * Math.PI * 2;
      verts[i * 2] = centerX + Math.cos(a) * radius;
      verts[i * 2 + 1] = centerY + Math.sin(a) * radius;
    }
    return RoundedPolygon.fromVertices(verts, rounding, undefined, centerX, centerY);
  }

  static rectangle(
    width = 1,
    height = 1,
    rounding: CornerRounding = CornerUnrounded,
    perVertexRounding?: CornerRounding[],
    centerX = width / 2,
    centerY = height / 2,
  ): RoundedPolygon {
    const hx = width / 2;
    const hy = height / 2;
    const verts = new Float32Array([
      centerX - hx,
      centerY - hy,
      centerX + hx,
      centerY - hy,
      centerX + hx,
      centerY + hy,
      centerX - hx,
      centerY + hy,
    ]);
    const round =
      perVertexRounding ??
      Array.from({ length: 4 }, () => rounding);
    return RoundedPolygon.fromVertices(verts, rounding, round, centerX, centerY);
  }

  static star(
    numVerticesPerRadius: number,
    innerRadius: number,
    outerRadius = 1,
    centerX = 0,
    centerY = 0,
    rounding: CornerRounding = CornerUnrounded,
  ): RoundedPolygon {
    const total = numVerticesPerRadius * 2;
    const verts = new Float32Array(total * 2);
    for (let i = 0; i < total; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const a = (i / total) * Math.PI * 2 - Math.PI / 2;
      verts[i * 2] = centerX + Math.cos(a) * r;
      verts[i * 2 + 1] = centerY + Math.sin(a) * r;
    }
    return RoundedPolygon.fromVertices(verts, rounding, undefined, centerX, centerY);
  }

  static regular(
    numVertices: number,
    radius = 1,
    centerX = 0,
    centerY = 0,
    rounding: CornerRounding = CornerUnrounded,
  ): RoundedPolygon {
    const verts = new Float32Array(numVertices * 2);
    for (let i = 0; i < numVertices; i++) {
      const a = (i / numVertices) * Math.PI * 2 - Math.PI / 2;
      verts[i * 2] = centerX + Math.cos(a) * radius;
      verts[i * 2 + 1] = centerY + Math.sin(a) * radius;
    }
    return RoundedPolygon.fromVertices(verts, rounding, undefined, centerX, centerY);
  }
}

function averageCoord(vertices: ArrayLike<number>, offset: number, n: number): number {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += vertices[i * 2 + offset];
  return sum / n;
}

function sampleCubic(c: Cubic, steps: number): number[][] {
  const pts: number[][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = c.pointOnCurve(t);
    pts.push([p.x, p.y]);
  }
  return pts;
}

function buildRoundedCubics(
  vertices: ArrayLike<number>,
  n: number,
  roundings: CornerRounding[],
): Cubic[] {
  const get = (i: number) => {
    const idx = ((i % n) + n) % n;
    return {
      x: vertices[idx * 2],
      y: vertices[idx * 2 + 1],
    };
  };

  const cubics: Cubic[] = [];

  for (let i = 0; i < n; i++) {
    const prev = get(i - 1);
    const curr = get(i);
    const next = get(i + 1);

    const v1x = curr.x - prev.x;
    const v1y = curr.y - prev.y;
    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;

    const len1 = Math.hypot(v1x, v1y) || 1;
    const len2 = Math.hypot(v2x, v2y) || 1;

    const r = roundings[i]?.radius ?? 0;
    const smooth = roundings[i]?.smoothing ?? 0;

    const cut1 = Math.min(r, len1 / 2);
    const cut2 = Math.min(r, len2 / 2);

    const startX = curr.x - (v1x / len1) * cut1;
    const startY = curr.y - (v1y / len1) * cut1;
    const endX = curr.x + (v2x / len2) * cut2;
    const endY = curr.y + (v2y / len2) * cut2;

    const prevEnd = i === 0 ? null : cubics[cubics.length - 1];
    const anchor0X = i === 0 ? startX : prevEnd!.anchor1X;
    const anchor0Y = i === 0 ? startY : prevEnd!.anchor1Y;

    if (r <= DIST_EPSILON) {
      cubics.push(new Cubic([anchor0X, anchor0Y, curr.x, curr.y, curr.x, curr.y, endX, endY]));
    } else {
      const smoothFactor = 1 + smooth;
      cubics.push(
        new Cubic([
          anchor0X,
          anchor0Y,
          startX + (curr.x - startX) * smoothFactor * 0.5,
          startY + (curr.y - startY) * smoothFactor * 0.5,
          endX + (curr.x - endX) * smoothFactor * 0.5,
          endY + (curr.y - endY) * smoothFactor * 0.5,
          endX,
          endY,
        ]),
      );
    }
  }

  // Close loop — ensure continuity
  if (cubics.length > 0) {
    const first = cubics[0];
    const last = cubics[cubics.length - 1];
    cubics[0] = new Cubic([
      last.anchor1X,
      last.anchor1Y,
      first.control0X,
      first.control0Y,
      first.control1X,
      first.control1Y,
      first.anchor1X,
      first.anchor1Y,
    ]);
  }

  return cubics.filter((c) => !c.zeroLength());
}

export function flattenCubics(polygon: RoundedPolygon): Cubic[] {
  const result: Cubic[] = [];
  for (const c of polygon.cubics) {
    if (!c.zeroLength()) result.push(c);
  }
  if (result.length === 0) {
    result.push(
      new Cubic([
        polygon.centerX,
        polygon.centerY,
        polygon.centerX,
        polygon.centerY,
        polygon.centerX,
        polygon.centerY,
        polygon.centerX,
        polygon.centerY,
      ]),
    );
  }
  // Close the path
  const first = result[0];
  const last = result[result.length - 1];
  result.push(
    new Cubic([
      last.anchor1X,
      last.anchor1Y,
      last.control1X,
      last.control1Y,
      first.control0X,
      first.control0Y,
      first.anchor0X,
      first.anchor0Y,
    ]),
  );
  return result.slice(0, -1);
}
