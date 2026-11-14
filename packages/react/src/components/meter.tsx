import { Meter as BaseMeter } from '@base-ui/react/meter';
import { type CSSProperties } from 'react';
import { compVar } from '../lib/token-utils.js';

export interface MeterProps {
  value: number;
  min?: number;
  max?: number;
  optimum?: number;
  low?: number;
  high?: number;
  label?: string;
  className?: string;
  'data-testid'?: string;
}

export function Meter({
  value,
  min = 0,
  max = 100,
  optimum,
  low,
  high,
  label,
  className,
  'data-testid': testId,
}: MeterProps) {
  min = Number.isFinite(min) ? min : 0;
  max = Number.isFinite(max) && max > min ? max : min + 100;
  if (!Number.isFinite(max) || max <= min) { min = 0; max = 100; }
  value = Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
  const range = max - min;
  const pct = range > 0 ? Math.min(100, Math.max(0, ((value - min) / range) * 100)) : 0;
  const trackHeight = compVar('linear-progress-indicator', 'height');
  const activeThickness = compVar('linear-progress-indicator', 'active-thickness');
  const trackActiveSpace = compVar('linear-progress-indicator', 'track-active-space');
  const stopSize = compVar('linear-progress-indicator', 'stop-size');

  const trackStyle: CSSProperties = {
    width: '100%',
    height: trackHeight,
    borderRadius: compVar('progress-indicator', 'track-shape'),
    background: 'transparent',
    overflow: 'visible',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  };

  return (
    <BaseMeter.Root
      value={value}
      min={min}
      max={max}
      {...(optimum !== undefined ? { optimum } : {})}
      {...(low !== undefined ? { low } : {})}
      {...(high !== undefined ? { high } : {})}
      className={className}
      data-testid={testId}
      style={{ width: '100%' }}
    >
      {label && (
        <BaseMeter.Label style={{ color: compVar('progress-indicator', 'active-indicator-color'), marginBottom: compVar('list', 'item-top-space') }}>
          {label}
        </BaseMeter.Label>
      )}
      <BaseMeter.Track style={trackStyle}>
        <div
          style={{
            width: `${pct}%`,
            height: activeThickness,
            borderRadius: compVar('progress-indicator', 'active-shape'),
            background: compVar('progress-indicator', 'active-indicator-color'),
            flexShrink: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            insetInlineStart: pct > 0 ? `min(100%, calc(${pct}% + ${trackActiveSpace}))` : 0,
            insetInlineEnd: 0,
            height: trackHeight,
            borderRadius: compVar('progress-indicator', 'track-shape'),
            background: compVar('progress-indicator', 'track-color'),
            display: pct >= 100 ? 'none' : 'flex',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'flex-end',
            minWidth: 0,
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
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}
