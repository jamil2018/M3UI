import {
  useState,
  useRef,
  useLayoutEffect,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { springs } from '@m3ui/motion';
import { useAnimate, useReducedMotionConfig } from 'motion/react';
import { MaterialShapes, useMorph } from '@m3ui/shapes';
import { FocusRing } from '../primitives/focus-ring.js';
import { Ripple } from '../primitives/ripple.js';
import { sysColor } from './token-utils.js';

export interface PressableShellProps {
  children: ReactNode;
  disabled?: boolean;
  shape: 'round' | 'square';
  /** Resting border-radius token for round shape */
  shapeRound?: string;
  /** Resting border-radius token for square shape */
  shapeSquare?: string;
  /** Pressed border-radius token — animated via springs.fastSpatial */
  pressedShape?: string;
  /** Expressive polygon morph endpoints (opt-in only; 1:1 surfaces) */
  morphFrom?: typeof MaterialShapes.circle;
  morphTo?: typeof MaterialShapes.circle;
  /** Drive morph progress (e.g. toggle selected state) instead of pointer press */
  morphActive?: boolean;
  stateLayerColor?: string;
  /** Hover state-layer color override for Ripple */
  hoverStateColor?: string;
  /** Hover state-layer opacity override for Ripple */
  hoverStateOpacity?: string;
  /** Pressed state-layer color override for Ripple */
  pressedStateColor?: string;
  /** Pressed state-layer opacity override for Ripple */
  pressedStateOpacity?: string;
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
    '--md-comp-focus-ring-shape': shapeRadius,
    '--md-comp-focus-ring-shape-start-start': shapeRadius,
    '--md-comp-focus-ring-shape-start-end': shapeRadius,
    '--md-comp-focus-ring-shape-end-end': shapeRadius,
    '--md-comp-focus-ring-shape-end-start': shapeRadius,
    borderRadius: shapeRadius,
  } as CSSProperties;
}

/**
 * Wraps interactive controls with an unclipped FocusRing, corner-radius press morph,
 * and a single Ripple (hover ::before + radial press ::after). Does not mount StateLayer.
 */
export function PressableShell({
  children,
  disabled = false,
  shape,
  shapeRound,
  shapeSquare,
  pressedShape,
  morphFrom,
  morphTo,
  morphActive,
  stateLayerColor,
  hoverStateColor,
  hoverStateOpacity,
  pressedStateColor,
  pressedStateOpacity,
  focusRingColor,
  focusRingInward = false,
  style,
  className,
  'data-testid': testId,
}: PressableShellProps) {
  const [pressed, setPressed] = useState(false);
  const reducedMotion = useReducedMotionConfig();

  const usesExpressivePolygon = morphFrom !== undefined || morphTo !== undefined;
  const from = morphFrom ?? (shape === 'round' ? MaterialShapes.circle : MaterialShapes.square);
  const to = morphTo ?? MaterialShapes.cookie4Sided;

  const { clipPath } = useMorph({
    from,
    to,
    active: usesExpressivePolygon ? (morphActive ?? pressed) : false,
  });

  const restRadius = (shape === 'round' ? shapeRound : shapeSquare) ?? 'inherit';
  const activeRadius = !disabled && pressed && pressedShape ? pressedShape : restRadius;
  const initialRadius = useRef(restRadius);
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useLayoutEffect(() => {
    const node = scope.current;
    if (!node) return;
    // Resolve CSS variables, calc() and multi-corner shapes before interpolating.
    // Motion cannot spring directly between a calc() string and a token reference.
    const current = getComputedStyle(node).borderRadius;
    node.style.borderRadius = activeRadius;
    const target = getComputedStyle(node).borderRadius;
    node.style.borderRadius = current;
    const animation = animate(
      node,
      { borderRadius: target },
      reducedMotion ? { duration: 0 } : pressed ? springs.fastSpatial : springs.defaultSpatial,
    );
    return () => animation.stop();
  }, [activeRadius, pressed, reducedMotion, animate, scope]);

  const focusRingStyle: CSSProperties = {
    display: 'inline-flex',
    width: style?.width,
    height: style?.height,
    flex: style?.flex,
    alignSelf: style?.alignSelf,
    ...focusRingAttachmentStyle(activeRadius),
    ...(focusRingColor
      ? {
          '--md-focus-ring-color': focusRingColor,
          '--md-comp-focus-ring-color': focusRingColor,
        }
      : {
          '--md-focus-ring-color': sysColor('secondary'),
          '--md-comp-focus-ring-color': sysColor('secondary'),
        }),
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
      setPressed(true);
    }
  };

  return (
    <FocusRing inward={focusRingInward} style={focusRingStyle}>
      <div
        ref={scope}
        data-testid={testId}
        className={className}
        style={{
          display: 'inline-flex',
          position: 'relative',
          borderRadius: initialRadius.current,
          clipPath: usesExpressivePolygon ? clipPath : 'none',
          ...style,
        }}
        onPointerDown={(event) => {
          if (!disabled && event.button === 0 && event.isPrimary !== false) setPressed(true);
        }}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        onKeyDown={handleKeyDown}
        onKeyUp={() => setPressed(false)}
        onBlur={() => setPressed(false)}
      >
        <Ripple
          disabled={disabled}
          color={stateLayerColor}
          hoverColor={hoverStateColor}
          hoverOpacity={hoverStateOpacity}
          pressedColor={pressedStateColor}
          pressedOpacity={pressedStateOpacity}
          style={{
            display: 'inline-flex',
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
          }}
        >
          {children}
        </Ripple>
      </div>
    </FocusRing>
  );
}
