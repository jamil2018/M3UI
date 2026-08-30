
import { useState, type CSSProperties, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { MaterialShapes, useMorph } from '@m3ui/shapes';
import { FocusRing } from '../primitives/focus-ring.js';
import { Ripple } from '../primitives/ripple.js';
import { StateLayer } from './state-layer.js';
import { sysColor } from './token-utils.js';

export interface PressableShellProps {
  children: ReactNode;
  disabled?: boolean;
  shape: 'round' | 'square';
  /** @deprecated Border-radius token — morph uses MaterialShapes when morphFrom/morphTo unset */
  shapeRound?: string;
  shapeSquare?: string;
  pressedShape?: string;
  /** Expressive polygon morph endpoints */
  morphFrom?: typeof MaterialShapes.circle;
  morphTo?: typeof MaterialShapes.circle;
  /** Drive morph progress (e.g. toggle selected state) instead of pointer press */
  morphActive?: boolean;
  stateLayerColor?: string;
  /** Focus ring color token override (defaults to secondary) */
  focusRingColor?: string;
  /** Animate focus ring inwards (border) instead of outwards (outline) */
  focusRingInward?: boolean;
  style?: CSSProperties;
  className?: string;
  'data-testid'?: string;
}

/** Maps container shape tokens to Material Web focus-ring attachment points on the host. */
export function focusRingAttachmentStyle(shapeRadius: string): CSSProperties {
  return {
    '--md-focus-ring-shape': shapeRadius,
    '--md-focus-ring-shape-start-start': shapeRadius,
    '--md-focus-ring-shape-start-end': shapeRadius,
    '--md-focus-ring-shape-end-end': shapeRadius,
    '--md-focus-ring-shape-end-start': shapeRadius,
    borderRadius: shapeRadius,
  } as CSSProperties;
}

/** Wraps interactive controls with ripple, state layer, focus ring, and Expressive polygon press morph */
export function PressableShell({
  children,
  disabled = false,
  shape,
  shapeRound,
  shapeSquare,
  morphFrom,
  morphTo,
  morphActive,
  stateLayerColor,
  focusRingColor,
  focusRingInward = false,
  style,
  className,
  'data-testid': testId,
}: PressableShellProps) {
  const [pressed, setPressed] = useState(false);

  const from = morphFrom ?? (shape === 'round' ? MaterialShapes.circle : MaterialShapes.square);
  const to = morphTo ?? MaterialShapes.cookie4Sided;

  const { clipPath } = useMorph({
    from,
    to,
    active: morphActive ?? pressed,
  });
  const usesExpressivePolygon =
    pressed || morphFrom !== undefined || morphTo !== undefined || morphActive !== undefined;

  const shapeRadius = shape === 'round' ? shapeRound : shapeSquare;
  const focusRingStyle: CSSProperties = {
    display: 'inline-flex',
    ...focusRingAttachmentStyle(shapeRadius ?? 'inherit'),
    ...(focusRingColor ? { '--md-focus-ring-color': focusRingColor } : { '--md-focus-ring-color': sysColor('secondary') }),
  };

  return (
    <Ripple disabled={disabled} color={stateLayerColor}>
      <FocusRing inward={focusRingInward} style={focusRingStyle}>
        <StateLayer
          disabled={disabled}
          color={stateLayerColor}
          states={['hover', 'pressed']}
          style={{ display: 'inline-flex', borderRadius: 'inherit' }}
        >
          <motion.div
            data-testid={testId}
            className={className}
            style={{
              display: 'inline-flex',
              clipPath: usesExpressivePolygon ? clipPath : 'none',
              borderRadius: shapeRadius,
              ...style,
            }}
            onPointerDown={() => !disabled && setPressed(true)}
            onPointerUp={() => {
              setPressed(false);
            }}
            onPointerLeave={() => {
              setPressed(false);
            }}
            onPointerCancel={() => {
              setPressed(false);
            }}
          >
            {children}
          </motion.div>
        </StateLayer>
      </FocusRing>
    </Ripple>
  );
}
