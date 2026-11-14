import { mergeProps } from '@base-ui/react/merge-props';
import { Button as BaseButton } from '@base-ui/react/button';
import { useState, type CSSProperties, type ReactNode, type ComponentPropsWithRef } from 'react';
import {
  buttonSizeTokens,
  compElevation,
  compVar,
  disabledContainerMix,
  disabledContentMix,
  typeStyle,
  type ButtonSize,
} from '../lib/token-utils.js';
import { PressableShell } from '../lib/pressable-shell.js';

export type ButtonVariant = 'elevated' | 'filled' | 'filled-tonal' | 'outlined' | 'text';
export type ButtonShape = 'round' | 'square';

export interface ButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  disabled?: boolean;
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

const VARIANT_LAYOUT: Record<ButtonVariant, { height: string; iconSize?: string; shape: string }> =
  {
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

interface InteractionState {
  disabled: boolean;
  hovered: boolean;
  focused: boolean;
  pressed: boolean;
}

const SIZE_TYPOGRAPHY: Record<ButtonSize, CSSProperties> = {
  xs: typeStyle('label-large'),
  sm: typeStyle('label-large'),
  md: typeStyle('title-medium'),
  lg: typeStyle('headline-small'),
  xl: typeStyle('headline-large'),
};

function labelColor(variant: ButtonVariant, p: string, state: InteractionState): string {
  if (state.disabled) {
    return disabledContentMix(
      compVar(p, variant === 'text' ? 'disabled-label-color' : 'disabled-label-text-color'),
    );
  }
  if (state.pressed) return compVar(p, 'pressed-label-text-color');
  if (state.hovered) return compVar(p, 'hover-label-text-color');
  if (state.focused) return compVar(p, 'focus-label-text-color');
  return compVar(p, variant === 'text' ? 'label-color' : 'label-text-color');
}

function elevationFor(p: string, state: InteractionState): string {
  if (state.disabled) return compElevation(p, 'disabled-container-elevation');
  if (state.pressed) return compElevation(p, 'pressed-container-elevation');
  if (state.hovered) return compElevation(p, 'hover-container-elevation');
  if (state.focused) return compElevation(p, 'focus-container-elevation');
  return compElevation(p, 'container-elevation');
}

function outlineColor(p: string, state: InteractionState): string {
  if (state.disabled) return disabledContainerMix(compVar(p, 'disabled-outline-color'));
  if (state.pressed) return compVar(p, 'pressed-outline-color');
  // Spec names are focus/hover; ingested outlined-button tokens use focused/hovered.
  if (state.focused) return compVar(p, 'focused-outline-color');
  if (state.hovered) return compVar(p, 'hovered-outline-color');
  return compVar(p, 'outline-color');
}

function iconColor(variant: ButtonVariant, p: string, state: InteractionState): string {
  if (state.disabled) return disabledContentMix(compVar(p, 'disabled-icon-color'));
  if (state.pressed) return compVar(p, 'pressed-icon-color');
  // filled-tonal defines hover/focus icon tokens; others fall back to rest icon color.
  if (state.hovered) {
    return variant === 'filled-tonal'
      ? compVar(p, 'hover-icon-color')
      : VARIANT_ICON_COLOR[variant];
  }
  if (state.focused) {
    return variant === 'filled-tonal'
      ? compVar(p, 'focus-icon-color')
      : VARIANT_ICON_COLOR[variant];
  }
  return VARIANT_ICON_COLOR[variant];
}

function getVariantStyles(
  variant: ButtonVariant,
  state: InteractionState,
  outlineWidth: string,
): CSSProperties {
  const p = VARIANT_PREFIX[variant];
  const base: CSSProperties = {
    color: labelColor(variant, p, state),
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
  };

  switch (variant) {
    case 'elevated':
    case 'filled':
    case 'filled-tonal':
      return {
        ...base,
        background: state.disabled
          ? disabledContainerMix(compVar(p, 'disabled-container-color'))
          : compVar(p, 'container-color'),
        boxShadow: elevationFor(p, state),
      };
    case 'outlined':
      return {
        ...base,
        border: `${outlineWidth} solid ${outlineColor(p, state)}`,
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
  size = 'sm',
  shape = 'round',
  disabled = false,
  onClick,
  type = 'button',
  startIcon,
  endIcon,
  className,
  style,
  'data-testid': testId,
  ...nativeProps
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const tokens = buttonSizeTokens(size);
  const p = VARIANT_PREFIX[variant];
  const interaction: InteractionState = { disabled, hovered, focused, pressed };
  const variantStyles = getVariantStyles(variant, interaction, tokens.outlineWidth);

  const buttonStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.iconLabelSpace,
    height: tokens.height,
    minHeight: size === 'sm' ? VARIANT_LAYOUT[variant].height : tokens.height,
    paddingInlineStart: tokens.leadingSpace,
    paddingInlineEnd: tokens.trailingSpace,
    ['--button-variant-shape' as string]: VARIANT_LAYOUT[variant].shape,
    ...VARIANT_TYPOGRAPHY[variant],
    ...SIZE_TYPOGRAPHY[size],
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...variantStyles,
    width: style?.width ?? 'fit-content',
    borderRadius: 'inherit',
    ...style,
  };

  const iconStyle: CSSProperties = {
    width: tokens.iconSize,
    height: tokens.iconSize,
    minWidth: VARIANT_LAYOUT[variant].iconSize ?? tokens.iconSize,
    minHeight: VARIANT_LAYOUT[variant].iconSize ?? tokens.iconSize,
    color: iconColor(variant, p, interaction),
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
      hoverStateColor={compVar(p, 'hover-state-layer-color')}
      hoverStateOpacity={compVar(p, 'hover-state-layer-opacity')}
      pressedStateColor={compVar(p, 'pressed-state-layer-color')}
      pressedStateOpacity={compVar(p, 'pressed-state-layer-opacity')}
      data-testid={testId}
    >
      <BaseButton
        {...mergeProps(nativeProps, {
          onMouseEnter: () => !disabled && setHovered(true),
          onMouseLeave: () => {
            setHovered(false);
            setPressed(false);
          },
          onFocus: () => !disabled && setFocused(true),
          onBlur: () => setFocused(false),
          onPointerDown: () => !disabled && setPressed(true),
          onPointerUp: () => setPressed(false),
          onPointerCancel: () => setPressed(false),
        })}
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
