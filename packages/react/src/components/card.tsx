import { SurfaceAction } from '../lib/surface-action.js';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, compElevation } from '../lib/token-utils.js';
import { PressableShell } from '../lib/pressable-shell.js';

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

const CARD_SHAPE: Record<CardVariant, string> = {
  elevated: compVar('elevated-card', 'container-shape'),
  filled: compVar('filled-card', 'container-shape'),
  outlined: compVar('outlined-card', 'container-shape'),
};

const CARD_COLOR: Record<CardVariant, string> = {
  elevated: compVar('elevated-card', 'container-color'),
  filled: compVar('filled-card', 'container-color'),
  outlined: compVar('outlined-card', 'container-color'),
};

function cardElevation(
  variant: CardVariant,
  state: { draggable: boolean; pressed: boolean; hovered: boolean; focused: boolean },
): string {
  const p = `${variant}-card`;
  if (state.draggable) return compElevation(p, 'dragged-container-elevation');
  if (state.pressed) return compElevation(p, 'pressed-container-elevation');
  if (state.hovered) return compElevation(p, 'hover-container-elevation');
  if (state.focused) return compElevation(p, 'focus-container-elevation');
  return compElevation(p, 'container-elevation');
}

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
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const interactiveElevation = interactive || draggable;
  const boxShadow = interactiveElevation
    ? cardElevation(variant, { draggable, pressed, hovered, focused })
    : compElevation(`${variant}-card`, 'container-elevation');

  const cardStyle: CSSProperties = {
    position: 'relative',
    borderRadius: CARD_SHAPE[variant],
    background: CARD_COLOR[variant],
    boxShadow,
    border:
      variant === 'outlined'
        ? `${compVar('outlined-card', 'outline-width')} solid ${compVar('outlined-card', 'outline-color')}`
        : 'none',
    overflow: 'hidden',
    cursor: interactive ? 'pointer' : draggable ? 'grab' : undefined,
    width: '100%',
    ...style,
  };

  const content = (
    <div
      className={interactive ? undefined : className}
      data-testid={interactive ? undefined : testId}
      style={cardStyle}
      data-dragging={draggable || undefined}
      onMouseEnter={() => interactiveElevation && setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onFocus={() => interactiveElevation && setFocused(true)}
      onBlur={() => setFocused(false)}
      onPointerDown={() => interactiveElevation && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
    >
      {interactive ? <SurfaceAction onClick={onClick}>{children}</SurfaceAction> : children}
    </div>
  );

  if (interactive) {
    const p = `${variant}-card`;
    return (
      <PressableShell
        shape="round"
        shapeRound={CARD_SHAPE[variant]}
        pressedShape={CARD_SHAPE[variant]}
        hoverStateColor={compVar(p, 'hover-state-layer-color')}
        pressedStateColor={compVar(p, 'pressed-state-layer-color')}
        className={className}
        data-testid={testId}
        style={{ width: '100%', display: 'flex' }}
      >
        {content}
      </PressableShell>
    );
  }

  return content;
}
