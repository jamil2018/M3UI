
import { Button as BaseButton } from '@base-ui/react/button';
import { type CSSProperties, type ReactNode } from 'react';
import {
  buttonSizeTokens,
  compVar,
  elevationShadow,
  type ButtonSize,
  typeStyle,
} from '../lib/token-utils.js';
import { PressableShell } from '../lib/pressable-shell.js';

export type ButtonVariant = 'elevated' | 'filled' | 'filled-tonal' | 'outlined' | 'text';
export type ButtonShape = 'round' | 'square';

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
}

const VARIANT_PREFIX: Record<ButtonVariant, string> = {
  elevated: 'elevated-button',
  filled: 'filled-button',
  'filled-tonal': 'filled-tonal-button',
  outlined: 'outlined-button',
  text: 'text-button',
};

function getVariantStyles(variant: ButtonVariant, disabled: boolean): CSSProperties {
  const p = VARIANT_PREFIX[variant];
  const labelKey = variant === 'text' ? 'label-color' : 'label-text-color';
  const base: CSSProperties = {
    color: disabled
      ? compVar(p, variant === 'text' ? 'disabled-label-color' : 'disabled-label-text-color')
      : compVar(p, labelKey),
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
  };

  switch (variant) {
    case 'elevated':
      return {
        ...base,
        background: disabled
          ? compVar(p, 'disabled-container-color')
          : compVar(p, 'container-color'),
        boxShadow: disabled ? elevationShadow('level0') : elevationShadow('level1'),
      };
    case 'filled':
      return {
        ...base,
        background: disabled
          ? compVar(p, 'disabled-container-color')
          : compVar(p, 'container-color'),
      };
    case 'filled-tonal':
      return {
        ...base,
        background: disabled
          ? compVar(p, 'disabled-container-color')
          : compVar(p, 'container-color'),
      };
    case 'outlined':
      return {
        ...base,
        border: `${compVar('button-medium', 'outlined-outline-width')} solid ${disabled ? compVar(p, 'disabled-outline-color') : compVar(p, 'outline-color')}`,
      };
    case 'text':
      return base;
    default:
      return base;
  }
}

export function Button({
  children,
  variant = 'filled',
  size = 'md',
  shape = 'round',
  disabled = false,
  onClick,
  type = 'button',
  startIcon,
  endIcon,
  className,
  style,
  'data-testid': testId,
}: ButtonProps) {
  const tokens = buttonSizeTokens(size);
  const variantStyles = getVariantStyles(variant, disabled);

  const buttonStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.iconLabelSpace,
    height: tokens.height,
    paddingInlineStart: tokens.leadingSpace,
    paddingInlineEnd: tokens.trailingSpace,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
    ...typeStyle('label-large'),
    ...variantStyles,
    width: '100%',
    borderRadius: 'inherit',
    ...style,
  };

  const iconStyle: CSSProperties = {
    width: tokens.iconSize,
    height: tokens.iconSize,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <PressableShell
      disabled={disabled}
      shape={shape}
      shapeRound={tokens.shapeRound}
      shapeSquare={tokens.shapeSquare}
      pressedShape={tokens.pressedShape}
      stateLayerColor={variantStyles.color}
      data-testid={testId}
    >
      <BaseButton
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={className}
        style={buttonStyle}
      >
        {startIcon && <span style={iconStyle}>{startIcon}</span>}
        <span>{children}</span>
        {endIcon && <span style={iconStyle}>{endIcon}</span>}
      </BaseButton>
    </PressableShell>
  );
}
