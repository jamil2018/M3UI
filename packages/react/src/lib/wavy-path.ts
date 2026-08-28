
/** Generate a horizontal wavy SVG path for Expressive progress indicators */
export function generateLinearWavePath(
  width: number,
  height: number,
  amplitude: number,
  wavelength: number,
  phase: number,
  progress: number,
): string {
  const effectiveAmplitude = amplitude * (1 - Math.min(Math.max(progress, 0), 100) / 100);
  const midY = height / 2;
  const steps = Math.max(Math.ceil(width / 4), 8);
  const points: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y = midY + effectiveAmplitude * Math.sin((2 * Math.PI * x) / wavelength + phase);
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return points.join(' ');
}

/** Generate a circular wavy arc path */
export function generateCircularWavePath(
  cx: number,
  cy: number,
  radius: number,
  amplitude: number,
  wavelength: number,
  phase: number,
  progress: number,
  startAngle = -Math.PI / 2,
  sweepAngle = 2 * Math.PI,
): string {
  const effectiveAmplitude = amplitude * (1 - Math.min(Math.max(progress, 0), 100) / 100);
  const steps = Math.max(Math.ceil((Math.abs(sweepAngle) * radius) / 4), 16);
  const points: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = startAngle + sweepAngle * t;
    const r = radius + effectiveAmplitude * Math.sin((t * sweepAngle * radius) / wavelength + phase);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return points.join(' ');
}
