
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, elevationShadow } from '../lib/token-utils.js';
import { StateLayer } from '../primitives/state-layer.js';
import { Ripple } from '../primitives/ripple.js';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  interactive?: boolean;
  draggable?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
}

const CARD_PREFIX: Record<CardVariant, string> = {
  elevated: 'elevated-card',
  filled: 'filled-card',
  outlined: 'outlined-card',
};

export function Card({
  children,
  variant = 'elevated',
  interactive = false,
  draggable = false,
  onClick,
  className,
  style,
  'data-testid': testId,
}: CardProps) {
  const p = CARD_PREFIX[variant];

  const cardStyle: CSSProperties = {
    position: 'relative',
    borderRadius: compVar(p, 'container-shape'),
    background: compVar(p, 'container-color'),
    boxShadow: variant === 'elevated' ? elevationShadow('level1') : elevationShadow('level0'),
    border:
      variant === 'outlined'
        ? `${compVar('outlined-card', 'outline-width')} solid ${compVar('outlined-card', 'outline-color')}`
        : 'none',
    overflow: 'hidden',
    cursor: interactive ? 'pointer' : draggable ? 'grab' : undefined,
    ...style,
  };

  const content = (
    <div className={className} data-testid={testId} style={cardStyle} onClick={interactive ? onClick : undefined} data-dragging={draggable || undefined}>
      {children}
    </div>
  );

  if (interactive) {
    return (
      <Ripple>
        <StateLayer states={['hover', 'focus', 'pressed', 'dragged']}>{content}</StateLayer>
      </Ripple>
    );
  }

  return content;
}
