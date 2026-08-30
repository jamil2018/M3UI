import type { Cubic } from './cubic.js';

export function cubicsToSvgPath(cubics: Cubic[], close = true): string {
  if (cubics.length === 0) return '';
  const parts: string[] = [];
  parts.push(`M ${cubics[0].anchor0X} ${cubics[0].anchor0Y}`);
  for (const c of cubics) {
    parts.push(
      `C ${c.control0X} ${c.control0Y} ${c.control1X} ${c.control1Y} ${c.anchor1X} ${c.anchor1Y}`,
    );
  }
  if (close) parts.push('Z');
  return parts.join(' ');
}

export function cubicsToClipPath(cubics: Cubic[]): string {
  if (cubics.length === 0) return 'none';

  // CSS path() coordinates are absolute pixels. Material shape geometry is
  // normalized to 0..1, which would clip a component to roughly one pixel.
  // Percentage polygons stay relative to the target element at every size.
  const samplesPerCubic = 8;
  const points: string[] = [];
  const pointAt = (start: number, control0: number, control1: number, end: number, t: number) => {
    const inverse = 1 - t;
    return inverse ** 3 * start
      + 3 * inverse ** 2 * t * control0
      + 3 * inverse * t ** 2 * control1
      + t ** 3 * end;
  };

  cubics.forEach((cubic, cubicIndex) => {
    for (let sample = cubicIndex === 0 ? 0 : 1; sample <= samplesPerCubic; sample += 1) {
      const t = sample / samplesPerCubic;
      const x = pointAt(cubic.anchor0X, cubic.control0X, cubic.control1X, cubic.anchor1X, t);
      const y = pointAt(cubic.anchor0Y, cubic.control0Y, cubic.control1Y, cubic.anchor1Y, t);
      points.push(`${(x * 100).toFixed(4)}% ${(y * 100).toFixed(4)}%`);
    }
  });

  return `polygon(${points.join(', ')})`;
}

/** Scale normalized [0,1] path to pixel dimensions */
export function scaleSvgPath(d: string, width: number, height: number): string {
  return d.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, (match) => {
    const n = parseFloat(match);
    if (Number.isNaN(n)) return match;
    // Heuristic: values in 0..1 range are normalized coords
    if (n >= 0 && n <= 1.5) {
      return String(n * (d.indexOf(match) % 2 === 0 ? width : height));
    }
    return match;
  });
}

export function svgPathForSize(
  normalizedPath: string,
  width: number,
  height: number,
): string {
  const nums = normalizedPath.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/g)?.map(Number) ?? [];
  let i = 0;
  return normalizedPath.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/g, () => {
    const n = nums[i++] ?? 0;
    const scale = i % 2 === 1 ? width : height;
    return String(n * scale);
  });
}
