
import { useState, type CSSProperties, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { MaterialShapes, useMorph } from '@m3ui/shapes';
import { StateLayer } from '../primitives/state-layer.js';
import { Ripple } from '../primitives/ripple.js';

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
  style?: CSSProperties;
  className?: string;
  'data-testid'?: string;
}

/** Wraps interactive controls with ripple, state layer, and Expressive polygon press morph */
export function PressableShell({
  children,
  disabled = false,
  shape,
  morphFrom,
  morphTo,
  morphActive,
  stateLayerColor,
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

  return (
    <Ripple disabled={disabled} color={stateLayerColor}>
      <StateLayer disabled={disabled} color={stateLayerColor} style={{ display: 'inline-flex' }}>
        <motion.div
          data-testid={testId}
          className={className}
          style={{
            display: 'inline-flex',
            clipPath,
            ...style,
          }}
          onPointerDown={() => !disabled && setPressed(true)}
          onPointerUp={() => { setPressed(false); }}
          onPointerLeave={() => { setPressed(false); }}
          onPointerCancel={() => { setPressed(false); }}
        >
          {children}
        </motion.div>
      </StateLayer>
    </Ripple>
  );
}
