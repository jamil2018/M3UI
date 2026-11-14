import { Progress as BaseProgress } from '@base-ui/react/progress';
import { motion, useAnimationFrame, useMotionValue } from 'motion/react';
import { prefersReducedMotion } from '@m3ui/motion';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '../lib/use-reduced-motion.js';
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
    const container = containerRef.current;
    if (!container) return;
    const measure = () => setWidth(container.getBoundingClientRect().width);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!active || prefersReducedMotion()) return;
    phase.set(phase.get() + (delta / 1000) * 2);
    tick((t) => t + 1);
  });

  const height = thickness + amplitude * 2;
  const progress = indeterminate ? 50 : value !== null ? (value / max) * 100 : 0;
  const fillWidth = indeterminate ? width * 0.4 : width;
  const path = fillWidth > 0 ? generateLinearWavePath(Math.max(0, fillWidth - thickness), height, amplitude, wavelength, phase.get(), progress) : '';

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, height }}>
      <svg aria-hidden width="100%" height={height} style={{ display: 'block', overflow: 'visible' }}>
        <path
          d={path}
          transform={`translate(${Math.min(thickness, fillWidth) / 2} 0)`}
          fill="none"
          stroke={compVar('progress-indicator', 'active-indicator-color')}
          strokeWidth={thickness}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function DeterminateLinearTrack({
  pct,
  trackHeight,
  activeThickness,
  wavy,
  value,
  max,
  amplitude,
  wavelength,
  thickness,
}: {
  pct: number;
  trackHeight: string;
  activeThickness: string | number;
  wavy: boolean;
  value: number | null;
  max: number;
  amplitude: number;
  wavelength: number;
  thickness: number;
}) {
  const trackActiveSpace = compVar('linear-progress-indicator', 'track-active-space');
  const stopSize = compVar('linear-progress-indicator', 'stop-size');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        height: trackHeight,
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: wavy ? trackHeight : activeThickness,
          borderRadius: compVar('progress-indicator', 'active-shape'),
          background: wavy ? 'transparent' : compVar('progress-indicator', 'active-indicator-color'),
          position: 'relative',
          flexShrink: 0,
          minWidth: pct > 0 ? undefined : 0,
          overflow: 'visible',
        }}
      >
        {wavy && (
          <WavyLinearIndicator
            value={value}
            max={max}
            amplitude={amplitude}
            wavelength={wavelength}
            thickness={thickness}
            indeterminate={false}
          />
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          insetInlineStart: pct > 0 ? `min(100%, calc(${pct}% + ${trackActiveSpace}))` : 0,
          insetInlineEnd: 0,
          height: trackHeight,
          borderRadius: compVar('progress-indicator', 'track-shape'),
          background: compVar('progress-indicator', 'track-color'),
          display: pct >= 100 ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          overflow: 'hidden',
          minWidth: 0,
          paddingInlineEnd: 0,
        }}
      >
        <span
          aria-hidden
          style={{
            width: stopSize,
            height: stopSize,
            borderRadius: '50%',
            background: compVar('progress-indicator', 'stop-color'),
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
}

function FlatIndeterminateIndicator({ trackHeight, activeThickness }: { trackHeight: string; activeThickness: string | number }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      style={{
        width: '100%',
        height: trackHeight,
        borderRadius: compVar('progress-indicator', 'track-shape'),
        background: compVar('progress-indicator', 'track-color'),
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        animate={
          reduced
            ? { x: '50%', scaleX: 0.4 }
            : { x: ['-100%', '250%'], scaleX: [0.3, 0.6, 0.3] }
        }
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 1.5, repeat: Infinity, ease: [0.2, 0, 0, 1] }
        }
        style={{
          position: 'absolute',
          top: '50%',
          marginTop: `calc(${typeof activeThickness === 'number' ? `${activeThickness}px` : activeThickness} / -2)`,
          height: activeThickness,
          width: '40%',
          borderRadius: compVar('progress-indicator', 'active-shape'),
          background: compVar('progress-indicator', 'active-indicator-color'),
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
}

export function LinearProgress({
  value = null,
  max = 100,
  variant = 'flat',
  wavy,
  indeterminate = false,
  amplitude = 3,
  wavelength,
  thickness,
  className,
  'data-testid': testId,
}: LinearProgressProps) {
  max = Number.isFinite(max) && max > 0 ? max : 100;
  value = value === null ? null : Number.isFinite(value) ? Math.min(max, Math.max(0, value)) : 0;
  indeterminate = indeterminate || value === null;
  amplitude = Number.isFinite(amplitude) ? Math.max(0, amplitude) : 3;
  thickness = thickness !== undefined && Number.isFinite(thickness) && thickness > 0 ? thickness : undefined;
  wavelength = wavelength !== undefined && Number.isFinite(wavelength) && wavelength > 0 ? wavelength : undefined;
  const resolvedVariant = wavy ? 'wavy' : variant;
  const trackHeight = resolvedVariant === 'wavy' ? `${(thickness ?? 4) + amplitude * 2}px` : compVar('linear-progress-indicator', 'height');
  const activeThickness = thickness ?? compVar('linear-progress-indicator', 'track-thickness');
  const waveWavelength = wavelength ?? (indeterminate ? 20 : 40);
  const pct = value !== null ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const numericThickness = typeof thickness === 'number' ? thickness : 4;

  const trackStyle: CSSProperties = {
    width: '100%',
    height: trackHeight,
    borderRadius: compVar('progress-indicator', 'track-shape'),
    background: 'transparent',
    overflow: 'visible',
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
        {indeterminate && resolvedVariant === 'flat' ? (
          <FlatIndeterminateIndicator trackHeight={trackHeight} activeThickness={activeThickness} />
        ) : indeterminate && resolvedVariant === 'wavy' ? (
          <div
            style={{
              width: '100%',
              height: trackHeight,
              borderRadius: compVar('progress-indicator', 'track-shape'),
              background: compVar('progress-indicator', 'track-color'),
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <WavyLinearIndicator
              value={value}
              max={max}
              amplitude={amplitude}
              wavelength={waveWavelength}
              thickness={numericThickness}
              indeterminate
            />
          </div>
        ) : (
          <DeterminateLinearTrack
            pct={pct}
            trackHeight={trackHeight}
            activeThickness={activeThickness}
            wavy={resolvedVariant === 'wavy'}
            value={value}
            max={max}
            amplitude={amplitude}
            wavelength={waveWavelength}
            thickness={numericThickness}
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
  const radius = Math.max(0, size / 2 - thickness / 2 - amplitude);
  const sweep = indeterminate ? Math.PI * 1.5 : (progress / 100) * 2 * Math.PI;
  const path = generateCircularWavePath(cx, cy, radius, amplitude, wavelength, phase.get(), progress, -Math.PI / 2, sweep);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" aria-hidden>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={compVar('progress-indicator', 'track-color')} strokeWidth={thickness} />
      <path d={progress > 0 ? path : ''} fill="none" stroke={compVar('progress-indicator', 'active-indicator-color')} strokeWidth={thickness} strokeLinecap="round" />
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
  const reduced = usePrefersReducedMotion();
  const cx = size / 2;
  const radius = Math.max(0, size / 2 - thickness / 2);
  const circumference = 2 * Math.PI * radius;
  const pct = indeterminate ? 0.25 : value !== null ? Math.min(1, Math.max(0, value / max)) : 0;
  const offset = circumference * (1 - pct);
  const gapPx = !indeterminate && pct > 0 && pct < 1 ? thickness * 2 : 0;
  const trackArc = Math.max(0, circumference * (1 - pct) - gapPx * 2);
  const trackRotation = pct * 360 + (gapPx / circumference) * 360;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
      {indeterminate ? (
        <circle cx={cx} cy={cx} r={radius} fill="none" stroke={compVar('progress-indicator', 'track-color')} strokeWidth={thickness} />
      ) : (
        trackArc > 0 && (
          <circle
            cx={cx}
            cy={cx}
            r={radius}
            fill="none"
            stroke={compVar('progress-indicator', 'track-color')}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${trackArc} ${circumference}`}
            style={{ transform: `rotate(${trackRotation}deg)`, transformOrigin: `${cx}px ${cx}px` }}
          />
        )
      )}
      <circle
        cx={cx}
        cy={cx}
        r={radius}
        fill="none"
        stroke={compVar('progress-indicator', 'active-indicator-color')}
        strokeWidth={thickness}
        strokeLinecap="round"
        visibility={!indeterminate && pct === 0 ? 'hidden' : undefined}
        strokeDasharray={circumference}
        strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
        style={indeterminate ? { transformOrigin: `${cx}px ${cx}px`, animation: reduced ? undefined : 'm3-progress-spin 1.4s linear infinite' } : undefined}
      />
      <style>{`@keyframes m3-progress-spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

export function CircularProgress({
  value = null,
  max = 100,
  variant = 'flat',
  indeterminate = false,
  amplitude = 3,
  wavelength = 40,
  thickness,
  size,
  className,
  'data-testid': testId,
}: CircularProgressProps) {
  max = Number.isFinite(max) && max > 0 ? max : 100;
  value = value === null ? null : Number.isFinite(value) ? Math.min(max, Math.max(0, value)) : 0;
  indeterminate = indeterminate || value === null;
  const resolvedSize = size !== undefined && Number.isFinite(size) && size > 0 ? size : 40;
  const numericThickness = Math.min(resolvedSize / 2, thickness !== undefined && Number.isFinite(thickness) && thickness > 0 ? thickness : 4);
  amplitude = Math.min(Math.max(0, resolvedSize / 2 - numericThickness), Number.isFinite(amplitude) ? Math.max(0, amplitude) : 3);
  wavelength = Number.isFinite(wavelength) && wavelength > 0 ? wavelength : 40;

  return (
    <BaseProgress.Root
      value={indeterminate ? null : value}
      max={max}
      className={className}
      data-testid={testId}
      aria-label="Progress"
      style={{
        display: 'inline-flex',
        width: size === undefined ? compVar('circular-progress-indicator', 'size') : resolvedSize,
        height: size === undefined ? compVar('circular-progress-indicator', 'size') : resolvedSize,
      }}
    >
      {variant === 'wavy' ? (
        <WavyCircularIndicator
          value={value}
          max={max}
          size={resolvedSize}
          amplitude={amplitude}
          wavelength={wavelength}
          thickness={numericThickness}
          indeterminate={indeterminate}
        />
      ) : (
        <FlatCircularIndicator
          value={value}
          max={max}
          size={resolvedSize}
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
