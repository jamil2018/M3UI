
import { Button as BaseButton } from '@base-ui/react/button';
import { type CSSProperties, type ReactNode } from 'react';
import {
  buttonSizeTokens,
  compElevation,
  compVar,
  type ButtonSize,
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

const VARIANT_ICON_COLOR: Record<ButtonVariant, string> = {
  elevated: compVar('elevated-button', 'icon-color'),
  filled: compVar('filled-button', 'icon-color'),
  'filled-tonal': compVar('filled-tonal-button', 'icon-color'),
  outlined: compVar('outlined-button', 'icon-color'),
  text: compVar('text-button', 'label-color'),
};

const VARIANT_LAYOUT: Record<ButtonVariant, { height: string; iconSize?: string; shape: string }> = {
  elevated: {
    height: compVar('elevated-button', 'container-height'),
    iconSize: compVar('elevated-button', 'icon-size'),
    shape: compVar('elevated-button', 'container-shape'),
  },
  filled: {
    height: compVar('filled-button', 'container-height'),
    iconSize: compVar('filled-button', 'icon-size'),
    shape: compVar('filled-button', 'container-shape'),
  },
  'filled-tonal': {
    height: compVar('filled-tonal-button', 'container-height'),
    iconSize: compVar('filled-tonal-button', 'icon-size'),
    shape: compVar('filled-tonal-button', 'container-shape'),
  },
  outlined: {
    height: compVar('outlined-button', 'container-height'),
    shape: compVar('outlined-button', 'container-shape'),
  },
  text: {
    height: compVar('text-button', 'container-height'),
    shape: compVar('text-button', 'container-shape'),
  },
};

const VARIANT_TYPOGRAPHY: Record<ButtonVariant, CSSProperties> = {
  elevated: {
    fontFamily: compVar('elevated-button', 'label-text-font'),
    fontSize: compVar('elevated-button', 'label-text-size'),
    lineHeight: compVar('elevated-button', 'label-text-line-height'),
    fontWeight: compVar('elevated-button', 'label-text-weight'),
  },
  filled: {
    fontFamily: compVar('filled-button', 'label-text-font'),
    fontSize: compVar('filled-button', 'label-text-size'),
    lineHeight: compVar('filled-button', 'label-text-line-height'),
    fontWeight: compVar('filled-button', 'label-text-weight'),
  },
  'filled-tonal': {
    fontFamily: compVar('filled-tonal-button', 'label-text-font'),
    fontSize: compVar('filled-tonal-button', 'label-text-size'),
    lineHeight: compVar('filled-tonal-button', 'label-text-line-height'),
    fontWeight: compVar('filled-tonal-button', 'label-text-weight'),
  },
  outlined: {
    fontFamily: compVar('outlined-button', 'label-text-font'),
    fontSize: compVar('outlined-button', 'label-text-size'),
    lineHeight: compVar('outlined-button', 'label-text-line-height'),
    fontWeight: compVar('outlined-button', 'label-text-weight'),
  },
  text: {
    fontFamily: compVar('text-button', 'label-text-font'),
    fontSize: compVar('text-button', 'label-text-size'),
    lineHeight: compVar('text-button', 'label-text-line-height'),
    fontWeight: compVar('text-button', 'label-text-weight'),
  },
};

const VARIANT_CONTRACT: Record<ButtonVariant, CSSProperties> = {
  elevated: {
    ['--elevated-shadow-color' as string]: compVar('elevated-button', 'container-shadow-color'),
    ['--elevated-disabled-container-opacity' as string]: compVar('elevated-button', 'disabled-container-opacity'),
    ['--elevated-disabled-icon-color' as string]: compVar('elevated-button', 'disabled-icon-color'),
    ['--elevated-disabled-label-color' as string]: compVar('elevated-button', 'disabled-label-text-color'),
    ['--elevated-disabled-label-opacity' as string]: compVar('elevated-button', 'disabled-label-text-opacity'),
    ['--elevated-focus-elevation' as string]: compElevation('elevated-button', 'focus-container-elevation'),
    ['--elevated-focus-label-color' as string]: compVar('elevated-button', 'focus-label-text-color'),
    ['--elevated-hover-elevation' as string]: compElevation('elevated-button', 'hover-container-elevation'),
    ['--elevated-hover-label-color' as string]: compVar('elevated-button', 'hover-label-text-color'),
    ['--elevated-hover-state-color' as string]: compVar('elevated-button', 'hover-state-layer-color'),
    ['--elevated-hover-state-opacity' as string]: compVar('elevated-button', 'hover-state-layer-opacity'),
    ['--elevated-label-color' as string]: compVar('elevated-button', 'label-text-color'),
    ['--elevated-pressed-elevation' as string]: compElevation('elevated-button', 'pressed-container-elevation'),
    ['--elevated-pressed-icon-color' as string]: compVar('elevated-button', 'pressed-icon-color'),
    ['--elevated-pressed-label-color' as string]: compVar('elevated-button', 'pressed-label-text-color'),
    ['--elevated-pressed-state-color' as string]: compVar('elevated-button', 'pressed-state-layer-color'),
    ['--elevated-pressed-state-opacity' as string]: compVar('elevated-button', 'pressed-state-layer-opacity'),
  },
  filled: {
    ['--filled-shadow-color' as string]: compVar('filled-button', 'container-shadow-color'),
    ['--filled-disabled-container-opacity' as string]: compVar('filled-button', 'disabled-container-opacity'),
    ['--filled-disabled-icon-color' as string]: compVar('filled-button', 'disabled-icon-color'),
    ['--filled-disabled-label-opacity' as string]: compVar('filled-button', 'disabled-label-text-opacity'),
    ['--filled-focus-elevation' as string]: compElevation('filled-button', 'focus-container-elevation'),
    ['--filled-focus-label-color' as string]: compVar('filled-button', 'focus-label-text-color'),
    ['--filled-hover-elevation' as string]: compElevation('filled-button', 'hover-container-elevation'),
    ['--filled-hover-label-color' as string]: compVar('filled-button', 'hover-label-text-color'),
    ['--filled-hover-state-color' as string]: compVar('filled-button', 'hover-state-layer-color'),
    ['--filled-hover-state-opacity' as string]: compVar('filled-button', 'hover-state-layer-opacity'),
    ['--filled-pressed-elevation' as string]: compElevation('filled-button', 'pressed-container-elevation'),
    ['--filled-pressed-icon-color' as string]: compVar('filled-button', 'pressed-icon-color'),
    ['--filled-pressed-label-color' as string]: compVar('filled-button', 'pressed-label-text-color'),
    ['--filled-pressed-state-color' as string]: compVar('filled-button', 'pressed-state-layer-color'),
    ['--filled-pressed-state-opacity' as string]: compVar('filled-button', 'pressed-state-layer-opacity'),
  },
  'filled-tonal': {
    ['--filled-tonal-shadow-color' as string]: compVar('filled-tonal-button', 'container-shadow-color'),
    ['--filled-tonal-disabled-container-opacity' as string]: compVar('filled-tonal-button', 'disabled-container-opacity'),
    ['--filled-tonal-disabled-icon-color' as string]: compVar('filled-tonal-button', 'disabled-icon-color'),
    ['--filled-tonal-disabled-label-opacity' as string]: compVar('filled-tonal-button', 'disabled-label-text-opacity'),
    ['--filled-tonal-focus-elevation' as string]: compElevation('filled-tonal-button', 'focus-container-elevation'),
    ['--filled-tonal-focus-icon-color' as string]: compVar('filled-tonal-button', 'focus-icon-color'),
    ['--filled-tonal-focus-label-color' as string]: compVar('filled-tonal-button', 'focus-label-text-color'),
    ['--filled-tonal-hover-elevation' as string]: compElevation('filled-tonal-button', 'hover-container-elevation'),
    ['--filled-tonal-hover-icon-color' as string]: compVar('filled-tonal-button', 'hover-icon-color'),
    ['--filled-tonal-hover-label-color' as string]: compVar('filled-tonal-button', 'hover-label-text-color'),
    ['--filled-tonal-hover-state-color' as string]: compVar('filled-tonal-button', 'hover-state-layer-color'),
    ['--filled-tonal-hover-state-opacity' as string]: compVar('filled-tonal-button', 'hover-state-layer-opacity'),
    ['--filled-tonal-pressed-elevation' as string]: compElevation('filled-tonal-button', 'pressed-container-elevation'),
    ['--filled-tonal-pressed-icon-color' as string]: compVar('filled-tonal-button', 'pressed-icon-color'),
    ['--filled-tonal-pressed-label-color' as string]: compVar('filled-tonal-button', 'pressed-label-text-color'),
    ['--filled-tonal-pressed-state-color' as string]: compVar('filled-tonal-button', 'pressed-state-layer-color'),
    ['--filled-tonal-pressed-state-opacity' as string]: compVar('filled-tonal-button', 'pressed-state-layer-opacity'),
  },
  outlined: {
    ['--outlined-disabled-icon-color' as string]: compVar('outlined-button', 'disabled-icon-color'),
    ['--outlined-disabled-label-opacity' as string]: compVar('outlined-button', 'disabled-label-text-opacity'),
    ['--outlined-disabled-outline-opacity' as string]: compVar('outlined-button', 'disabled-outline-opacity'),
    ['--outlined-focus-label-color' as string]: compVar('outlined-button', 'focus-label-text-color'),
    ['--outlined-hover-label-color' as string]: compVar('outlined-button', 'hover-label-text-color'),
    ['--outlined-hover-state-color' as string]: compVar('outlined-button', 'hover-state-layer-color'),
    ['--outlined-hover-state-opacity' as string]: compVar('outlined-button', 'hover-state-layer-opacity'),
    ['--outlined-outline-width' as string]: compVar('outlined-button', 'outline-width'),
    ['--outlined-pressed-icon-color' as string]: compVar('outlined-button', 'pressed-icon-color'),
    ['--outlined-pressed-label-color' as string]: compVar('outlined-button', 'pressed-label-text-color'),
    ['--outlined-pressed-outline-color' as string]: compVar('outlined-button', 'pressed-outline-color'),
    ['--outlined-pressed-state-color' as string]: compVar('outlined-button', 'pressed-state-layer-color'),
    ['--outlined-pressed-state-opacity' as string]: compVar('outlined-button', 'pressed-state-layer-opacity'),
  },
  text: {
    ['--text-disabled-icon-color' as string]: compVar('text-button', 'disabled-icon-color'),
    ['--text-disabled-label-color' as string]: compVar('text-button', 'disabled-label-text-color'),
    ['--text-disabled-label-opacity' as string]: compVar('text-button', 'disabled-label-text-opacity'),
    ['--text-focus-label-color' as string]: compVar('text-button', 'focus-label-text-color'),
    ['--text-hover-label-color' as string]: compVar('text-button', 'hover-label-text-color'),
    ['--text-hover-state-color' as string]: compVar('text-button', 'hover-state-layer-color'),
    ['--text-hover-state-opacity' as string]: compVar('text-button', 'hover-state-layer-opacity'),
    ['--text-icon-color' as string]: compVar('text-button', 'icon-color'),
    ['--text-label-color' as string]: compVar('text-button', 'label-text-color'),
    ['--text-pressed-icon-color' as string]: compVar('text-button', 'pressed-icon-color'),
    ['--text-pressed-label-color' as string]: compVar('text-button', 'pressed-label-text-color'),
    ['--text-pressed-state-color' as string]: compVar('text-button', 'pressed-state-layer-color'),
    ['--text-pressed-state-opacity' as string]: compVar('text-button', 'pressed-state-layer-opacity'),
  },
};

function getVariantStyles(variant: ButtonVariant, disabled: boolean, outlineWidth: string): CSSProperties {
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
        boxShadow: disabled ? compElevation(p, 'disabled-container-elevation') : compElevation(p),
      };
    case 'filled':
      return {
        ...base,
        background: disabled
          ? compVar(p, 'disabled-container-color')
          : compVar(p, 'container-color'),
        boxShadow: disabled ? compElevation(p, 'disabled-container-elevation') : compElevation(p),
      };
    case 'filled-tonal':
      return {
        ...base,
        background: disabled
          ? compVar(p, 'disabled-container-color')
          : compVar(p, 'container-color'),
        boxShadow: disabled ? compElevation(p, 'disabled-container-elevation') : compElevation(p),
      };
    case 'outlined':
      return {
        ...base,
        border: `${outlineWidth} solid ${disabled ? compVar(p, 'disabled-outline-color') : compVar(p, 'outline-color')}`,
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
  const variantStyles = getVariantStyles(variant, disabled, tokens.outlineWidth);

  const buttonStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.iconLabelSpace,
    height: tokens.height,
    minHeight: VARIANT_LAYOUT[variant].height,
    paddingInlineStart: tokens.leadingSpace,
    paddingInlineEnd: tokens.trailingSpace,
    ['--button-variant-shape' as string]: VARIANT_LAYOUT[variant].shape,
    ...VARIANT_TYPOGRAPHY[variant],
    ...VARIANT_CONTRACT[variant],
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
    ...variantStyles,
    width: '100%',
    borderRadius: 'inherit',
    ...style,
  };

  const iconStyle: CSSProperties = {
    width: tokens.iconSize,
    height: tokens.iconSize,
    minWidth: VARIANT_LAYOUT[variant].iconSize ?? tokens.iconSize,
    minHeight: VARIANT_LAYOUT[variant].iconSize ?? tokens.iconSize,
    color: VARIANT_ICON_COLOR[variant],
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
