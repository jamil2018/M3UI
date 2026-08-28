/** Cubic Bézier segment — anchor0, control0, control1, anchor1 (8 floats) */
export class Cubic {
  readonly points: Float32Array;

  constructor(points: ArrayLike<number> | Float32Array) {
    this.points = points instanceof Float32Array ? points : Float32Array.from(points);
    if (this.points.length !== 8) {
      throw new Error('Cubic requires exactly 8 coordinates');
    }
  }

  get anchor0X(): number {
    return this.points[0];
  }
  get anchor0Y(): number {
    return this.points[1];
  }
  get control0X(): number {
    return this.points[2];
  }
  get control0Y(): number {
    return this.points[3];
  }
  get control1X(): number {
    return this.points[4];
  }
  get control1Y(): number {
    return this.points[5];
  }
  get anchor1X(): number {
    return this.points[6];
  }
  get anchor1Y(): number {
    return this.points[7];
  }

  zeroLength(epsilon = 1e-6): boolean {
    return (
      Math.hypot(this.anchor1X - this.anchor0X, this.anchor1Y - this.anchor0Y) < epsilon &&
      Math.hypot(this.control0X - this.anchor0X, this.control0Y - this.anchor0Y) < epsilon &&
      Math.hypot(this.control1X - this.anchor1X, this.control1Y - this.anchor1Y) < epsilon
    );
  }

  pointOnCurve(t: number): { x: number; y: number } {
    const u = 1 - t;
    const x =
      u * u * u * this.anchor0X +
      3 * u * u * t * this.control0X +
      3 * u * t * t * this.control1X +
      t * t * t * this.anchor1X;
    const y =
      u * u * u * this.anchor0Y +
      3 * u * u * t * this.control0Y +
      3 * u * t * t * this.control1Y +
      t * t * t * this.anchor1Y;
    return { x, y };
  }

  split(t: number): [Cubic, Cubic] {
    const p = this.points;
    const x01 = lerp(p[0], p[2], t);
    const y01 = lerp(p[1], p[3], t);
    const x12 = lerp(p[2], p[4], t);
    const y12 = lerp(p[3], p[5], t);
    const x23 = lerp(p[4], p[6], t);
    const y23 = lerp(p[5], p[7], t);
    const x012 = lerp(x01, x12, t);
    const y012 = lerp(y01, y12, t);
    const x123 = lerp(x12, x23, t);
    const y123 = lerp(y12, y23, t);
    const x0123 = lerp(x012, x123, t);
    const y0123 = lerp(y012, y123, t);
    return [
      new Cubic([p[0], p[1], x01, y01, x012, y012, x0123, y0123]),
      new Cubic([x0123, y0123, x123, y123, x23, y23, p[6], p[7]]),
    ];
  }

  interpolate(other: Cubic, progress: number): Cubic {
    const out = new Float32Array(8);
    for (let i = 0; i < 8; i++) {
      out[i] = lerp(this.points[i], other.points[i], progress);
    }
    return new Cubic(out);
  }

  approximateLength(steps = 16): number {
    let len = 0;
    let prev = this.pointOnCurve(0);
    for (let i = 1; i <= steps; i++) {
      const pt = this.pointOnCurve(i / steps);
      len += Math.hypot(pt.x - prev.x, pt.y - prev.y);
      prev = pt;
    }
    return len;
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function interpolateValue(a: number, b: number, progress: number): number {
  return lerp(a, b, progress);
}
