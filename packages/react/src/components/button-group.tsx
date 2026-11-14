import { useDirection } from '@base-ui/react/direction-provider';
import { Button as BaseButton } from '@base-ui/react/button';
import { motion, useReducedMotionConfig } from 'motion/react';
import { springs } from '@m3ui/motion';
import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { buttonSizeTokens, compVar, type ButtonSize, typeStyle } from '../lib/token-utils.js';
import { PressableShell } from '../lib/pressable-shell.js';
import { EXPRESSIVE_PATTERNS } from '@m3ui/shapes';

export type ButtonGroupVariant = 'standard' | 'connected';
export type ButtonGroupButtonVariant = 'filled' | 'filled-tonal' | 'outlined';

export interface ButtonGroupProps {
  children: ReactNode;
  variant?: ButtonGroupVariant;
  buttonVariant?: ButtonGroupButtonVariant;
  size?: ButtonSize;
  className?: string;
  'data-testid'?: string;
}

export interface ButtonGroupItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
  /** Injected by ButtonGroup */
  isFirst?: boolean;
  isLast?: boolean;
  isPressed?: boolean;
  groupVariant?: ButtonGroupVariant;
  buttonVariant?: ButtonGroupButtonVariant;
  size?: ButtonSize;
}

const { widenFactor, compressFactor } = EXPRESSIVE_PATTERNS.buttonGroupBump;

const BUTTON_VARIANT_PREFIX: Record<ButtonGroupButtonVariant, string> = {
  filled: 'filled-button',
  'filled-tonal': 'filled-tonal-button',
  outlined: 'outlined-button',
};

function useGroupTokens(variant: ButtonGroupVariant) {
  if (variant === 'connected') {
    const height = compVar('connected-button-group-small', 'container-height');
    return {
      betweenSpace: compVar('connected-button-group-small', 'between-space'),
      height,
      shape: `min(${compVar('connected-button-group-small', 'container-shape')}, calc(${height} / 2))`,
      innerCorner: compVar('connected-button-group-small', 'inner-corner-corner-size'),
    };
  }
  const height = compVar('button-group-small', 'container-height');
  return {
    betweenSpace: compVar('button-group-small', 'between-space'),
    height,
    shape: `min(${compVar('button-medium', 'container-shape-round')}, calc(${height} / 2))`,
    innerCorner: `min(${compVar('button-medium', 'container-shape-round')}, calc(${height} / 2))`,
  };
}

function connectedRadii(isFirst: boolean, isLast: boolean, outer: string, inner: string): string {
  if (isFirst && isLast) return outer;
  if (isFirst) return `${outer} ${inner} ${inner} ${outer}`;
  if (isLast) return `${inner} ${outer} ${outer} ${inner}`;
  return inner;
}

export function ButtonGroup({
  children,
  variant = 'standard',
  buttonVariant = 'filled',
  size = 'md',
  className,
  'data-testid': testId,
}: ButtonGroupProps) {
  const tokens = useGroupTokens(variant);
  const items = Children.toArray(children);
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotionConfig();

  const groupStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'stretch',
    gap: tokens.betweenSpace,
    borderRadius: variant === 'connected' ? tokens.shape : undefined,
  };

  return (
    <div className={className} data-testid={testId} style={groupStyle} role="group">
      {items.map((child, index) => {
        if (!isValidElement(child)) return child;
        const flex =
          pressedIndex === index
            ? widenFactor
            : pressedIndex !== null && (pressedIndex === index - 1 || pressedIndex === index + 1)
              ? compressFactor
              : 1;

        return (
          <motion.div
            key={index}
            initial={false}
            style={{ display: 'flex', flexBasis: '0%', flexGrow: 1, flexShrink: 1, minWidth: 0 }}
            animate={{ flexGrow: flex }}
            transition={reducedMotion ? { duration: 0 } : springs.fastSpatial}
            onPointerDown={() => {
              if (!(child.props as ButtonGroupItemProps).disabled) setPressedIndex(index);
            }}
            onPointerUp={() => {
              setPressedIndex(null);
            }}
            onPointerLeave={() => {
              setPressedIndex(null);
            }}
            onPointerCancel={() => {
              setPressedIndex(null);
            }}
            onKeyDown={(event) => {
              if (
                (event.key === ' ' || event.key === 'Enter') &&
                !(child.props as ButtonGroupItemProps).disabled
              )
                setPressedIndex(index);
            }}
            onKeyUp={() => setPressedIndex(null)}
            onBlur={() => setPressedIndex(null)}
          >
            {cloneElement(child as ReactElement<ButtonGroupItemProps>, {
              isFirst: index === 0,
              isLast: index === items.length - 1,
              isPressed: pressedIndex === index,
              groupVariant: variant,
              buttonVariant,
              size,
            })}
          </motion.div>
        );
      })}
    </div>
  );
}

export function ButtonGroupItem({
  children,
  onClick,
  disabled = false,
  className,
  'data-testid': testId,
  isFirst = true,
  isLast = true,
  isPressed = false,
  groupVariant = 'standard',
  buttonVariant = 'filled',
  size = 'md',
}: ButtonGroupItemProps) {
  const direction = useDirection();
  const groupTokens = useGroupTokens(groupVariant);
  const sizeTokens = buttonSizeTokens(size);
  const p = BUTTON_VARIANT_PREFIX[buttonVariant];
  const pressedShape = compVar('button-medium', 'pressed-container-shape');

  const restRadius =
    groupVariant === 'connected'
      ? connectedRadii(
          direction === 'rtl' ? isLast : isFirst,
          direction === 'rtl' ? isFirst : isLast,
          groupTokens.shape,
          groupTokens.innerCorner,
        )
      : groupTokens.shape;

  const itemStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: groupTokens.height,
    paddingInline: sizeTokens.leadingSpace,
    ...typeStyle('label-large'),
    background:
      buttonVariant === 'outlined'
        ? 'transparent'
        : disabled
          ? compVar(p, 'disabled-container-color')
          : compVar(p, 'container-color'),
    color: disabled ? compVar(p, 'disabled-label-text-color') : compVar(p, 'label-text-color'),
    border:
      buttonVariant === 'outlined'
        ? `${sizeTokens.outlineWidth} solid ${disabled ? compVar(p, 'disabled-outline-color') : compVar(p, 'outline-color')}`
        : 'none',
    borderRadius: 'inherit',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
  };

  return (
    <PressableShell
      disabled={disabled}
      shape="round"
      shapeRound={isPressed ? pressedShape : restRadius}
      pressedShape={pressedShape}
      stateLayerColor={itemStyle.color}
      hoverStateColor={compVar(p, 'hover-state-layer-color')}
      hoverStateOpacity={compVar(p, 'hover-state-layer-opacity')}
      pressedStateColor={compVar(p, 'pressed-state-layer-color')}
      pressedStateOpacity={compVar(p, 'pressed-state-layer-opacity')}
      style={{ display: 'flex', width: '100%', borderRadius: restRadius }}
      data-testid={testId}
    >
      <BaseButton
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={className}
        style={itemStyle}
      >
        {children}
      </BaseButton>
    </PressableShell>
  );
}
