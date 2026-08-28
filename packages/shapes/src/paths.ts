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
  const d = cubicsToSvgPath(cubics, true);
  return d ? `path('${d}')` : 'none';
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
