
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, compElevation } from '../lib/token-utils.js';
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

const CARD_SHAPE: Record<CardVariant, string> = {
  elevated: compVar('elevated-card', 'container-shape'),
  filled: compVar('filled-card', 'container-shape'),
  outlined: compVar('outlined-card', 'container-shape'),
};

const CARD_SHADOW: Record<CardVariant, string> = {
  elevated: compVar('elevated-card', 'container-shadow-color'),
  filled: compVar('filled-card', 'container-shadow-color'),
  outlined: compVar('outlined-card', 'container-shadow-color'),
};

const CARD_ELEVATION: Record<CardVariant, string> = {
  elevated: compElevation('elevated-card'),
  filled: compElevation('filled-card'),
  outlined: compElevation('outlined-card'),
};

const CARD_COLOR: Record<CardVariant, string> = {
  elevated: compVar('elevated-card', 'container-color'),
  filled: compVar('filled-card', 'container-color'),
  outlined: compVar('outlined-card', 'container-color'),
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
  const cardStyle: CSSProperties = {
    position: 'relative',
    borderRadius: CARD_SHAPE[variant],
    background: CARD_COLOR[variant],
    boxShadow: CARD_ELEVATION[variant],
    ['--card-shadow-color' as string]: CARD_SHADOW[variant],
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
