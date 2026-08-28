
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
  const trackStyle: CSSProperties = {
    width: '100%',
    height: compVar('linear-progress-indicator', 'height'),
    borderRadius: compVar('progress-indicator', 'track-shape'),
    background: compVar('progress-indicator', 'track-color'),
    overflow: 'hidden',
  };

  const indicatorStyle: CSSProperties = {
    height: compVar('linear-progress-indicator', 'active-thickness'),
    borderRadius: compVar('progress-indicator', 'active-shape'),
    background: compVar('progress-indicator', 'active-indicator-color'),
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
        <BaseMeter.Label style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: 4 }}>
          {label}
        </BaseMeter.Label>
      )}
      <BaseMeter.Track style={trackStyle}>
        <BaseMeter.Indicator style={indicatorStyle} />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}
