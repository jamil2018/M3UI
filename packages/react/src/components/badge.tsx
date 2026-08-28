
import { type CSSProperties } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';

export type BadgeVariant = 'dot' | 'large';

export interface BadgeProps {
  count?: number;
  max?: number;
  variant?: BadgeVariant;
  className?: string;
  'data-testid'?: string;
}

export function Badge({
  count = 0,
  max = 99,
  variant = 'large',
  className,
  'data-testid': testId,
}: BadgeProps) {
  if (variant === 'dot') {
    const dotStyle: CSSProperties = {
      width: compVar('badge', 'size'),
      height: compVar('badge', 'size'),
      borderRadius: compVar('badge', 'shape'),
      background: compVar('badge', 'color'),
      display: 'inline-block',
    };
    return <span className={className} data-testid={testId} style={dotStyle} aria-hidden />;
  }

  const display = count > max ? `${String(max)}+` : String(count);
  if (count <= 0) return null;

  const badgeStyle: CSSProperties = {
    minWidth: compVar('badge', 'large-size'),
    height: compVar('badge', 'large-size'),
    paddingInline: compVar('list', 'item-between-space'),
    borderRadius: compVar('badge', 'large-shape'),
    background: compVar('badge', 'large-color'),
    color: compVar('badge', 'large-label-text-color'),
    ...typeStyle('label-small'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <span className={className} data-testid={testId} style={badgeStyle} aria-label={`${display} notifications`}>
      {display}
    </span>
  );
}
