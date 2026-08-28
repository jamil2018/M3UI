
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { motion, useAnimationFrame, useMotionValue } from 'motion/react';
import { prefersReducedMotion } from '@m3ui/motion';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { compVar } from '../lib/token-utils.js';
import { generateCircularWavePath, generateLinearWavePath } from '../lib/wavy-path.js';

export type ProgressVariant = 'flat' | 'wavy';

export interface ProgressProps {
  value?: number | null;
  max?: number;
  variant?: ProgressVariant;
  indeterminate?: boolean;
  amplitude?: number;
  wavelength?: number;
  thickness?: number;
  className?: string;
  'data-testid'?: string;
}

export interface LinearProgressProps extends ProgressProps {
  /** @deprecated Use variant="wavy" */
  wavy?: boolean;
}

function WavyLinearIndicator({
  value,
  max,
  amplitude,
  wavelength,
  thickness,
  indeterminate,
}: {
  value: number | null;
  max: number;
  amplitude: number;
  wavelength: number;
  thickness: number;
  indeterminate: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(200);
  const phase = useMotionValue(0);
  const [, tick] = useState(0);
  const active = indeterminate || (value !== null && value < max);

  useEffect(() => {
    if (containerRef.current) setWidth(containerRef.current.offsetWidth);
  }, []);

  useAnimationFrame((_, delta) => {
    if (!active || prefersReducedMotion()) return;
    phase.set(phase.get() + (delta / 1000) * 2);
    tick((t) => t + 1);
  });

  const height = thickness;
  const progress = indeterminate ? 50 : value !== null ? (value / max) * 100 : 0;
  const fillWidth = indeterminate ? width * 0.4 : (progress / 100) * width;
  const path = generateLinearWavePath(fillWidth, height, amplitude, wavelength, phase.get(), progress);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, height }}>
      <svg width="100%" height={height} style={{ display: 'block', overflow: 'visible' }}>
        <path
          d={path}
          fill="none"
          stroke={compVar('progress-indicator', 'active-indicator-color')}
          strokeWidth={thickness}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function LinearProgress({
  value = null,
  max = 100,
  variant = 'flat',
  wavy,
  indeterminate = false,
  amplitude = 4,
  wavelength = 24,
  thickness,
  className,
  'data-testid': testId,
}: LinearProgressProps) {
  const resolvedVariant = wavy ? 'wavy' : variant;
  const trackHeight = compVar('linear-progress-indicator', 'height');
  const activeThickness = thickness ?? 4;

  const trackStyle: CSSProperties = {
    width: '100%',
    height: trackHeight,
    borderRadius: compVar('progress-indicator', 'track-shape'),
    background: compVar('progress-indicator', 'track-color'),
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <BaseProgress.Root
      value={indeterminate ? null : value}
      max={max}
      className={className}
      data-testid={testId}
      aria-label="Progress"
      style={{ width: '100%' }}
    >
      <BaseProgress.Track style={trackStyle}>
        {resolvedVariant === 'wavy' ? (
          <WavyLinearIndicator
            value={value}
            max={max}
            amplitude={amplitude}
            wavelength={wavelength}
            thickness={activeThickness}
            indeterminate={indeterminate}
          />
        ) : (
          <BaseProgress.Indicator
            style={{
              height: activeThickness,
              borderRadius: compVar('progress-indicator', 'active-shape'),
              background: compVar('progress-indicator', 'active-indicator-color'),
            }}
          />
        )}
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}

export interface CircularProgressProps extends ProgressProps {
  size?: number;
}

function WavyCircularIndicator({
  value,
  max,
  size,
  amplitude,
  wavelength,
  thickness,
  indeterminate,
}: {
  value: number | null;
  max: number;
  size: number;
  amplitude: number;
  wavelength: number;
  thickness: number;
  indeterminate: boolean;
}) {
  const phase = useMotionValue(0);
  const [, tick] = useState(0);
  const active = indeterminate || (value !== null && value < max);

  useAnimationFrame((_, delta) => {
    if (!active || prefersReducedMotion()) return;
    phase.set(phase.get() + (delta / 1000) * 2);
    tick((t) => t + 1);
  });

  const progress = indeterminate ? 50 : value !== null ? (value / max) * 100 : 0;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - thickness;
  const sweep = indeterminate ? Math.PI * 1.5 : (progress / 100) * 2 * Math.PI;
  const path = generateCircularWavePath(cx, cy, radius, amplitude, wavelength, phase.get(), progress, -Math.PI / 2, sweep);

  return (
    <svg width={size} height={size} aria-hidden>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={compVar('progress-indicator', 'track-color')} strokeWidth={thickness} />
      <path d={path} fill="none" stroke={compVar('progress-indicator', 'active-indicator-color')} strokeWidth={thickness} strokeLinecap="round" />
    </svg>
  );
}

function FlatCircularIndicator({
  value,
  max,
  size,
  thickness,
  indeterminate,
}: {
  value: number | null;
  max: number;
  size: number;
  thickness: number;
  indeterminate: boolean;
}) {
  const cx = size / 2;
  const radius = size / 2 - thickness;
  const circumference = 2 * Math.PI * radius;
  const pct = indeterminate ? 0.25 : value !== null ? value / max : 0;
  const offset = circumference * (1 - pct);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
      <circle cx={cx} cy={cx} r={radius} fill="none" stroke={compVar('progress-indicator', 'track-color')} strokeWidth={thickness} />
      <circle
        cx={cx}
        cy={cx}
        r={radius}
        fill="none"
        stroke={compVar('progress-indicator', 'active-indicator-color')}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
        style={indeterminate ? { animation: prefersReducedMotion() ? undefined : 'm3-spin 1.4s linear infinite' } : undefined}
      />
      <style>{`@keyframes m3-spin { to { transform: rotate(360deg); transform-origin: ${cx}px ${cx}px; } }`}</style>
    </svg>
  );
}

export function CircularProgress({
  value = null,
  max = 100,
  variant = 'flat',
  indeterminate = false,
  amplitude = 3,
  wavelength = 16,
  thickness,
  size = 48,
  className,
  'data-testid': testId,
}: CircularProgressProps) {
  const numericThickness = thickness ?? 4;

  return (
    <BaseProgress.Root
      value={indeterminate ? null : value}
      max={max}
      className={className}
      data-testid={testId}
      aria-label="Progress"
      style={{ display: 'inline-flex', width: size, height: size }}
    >
      {variant === 'wavy' ? (
        <WavyCircularIndicator
          value={value}
          max={max}
          size={size}
          amplitude={amplitude}
          wavelength={wavelength}
          thickness={numericThickness}
          indeterminate={indeterminate}
        />
      ) : (
        <FlatCircularIndicator
          value={value}
          max={max}
          size={size}
          thickness={numericThickness}
          indeterminate={indeterminate}
        />
      )}
    </BaseProgress.Root>
  );
}

export function Progress(props: LinearProgressProps) {
  return <LinearProgress {...props} />;
}
