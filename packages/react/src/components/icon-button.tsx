import { mergeProps } from '@base-ui/react/merge-props';
import { type ComponentPropsWithRef } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { Toggle } from '@base-ui/react/toggle';
import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  compVar,
  disabledContainerMix,
  disabledContentMix,
  iconButtonSizeTokens,
  ICON_BUTTON_SIZE_PREFIX,
  type ButtonSize,
} from '../lib/token-utils.js';
import { MaterialShapes } from '@m3ui/shapes';
import { PressableShell } from '../lib/pressable-shell.js';

export type IconButtonVariant = 'standard' | 'filled' | 'filled-tonal' | 'outlined';
export type IconButtonShape = 'round' | 'square';
export type IconButtonWidth = 'narrow' | 'default' | 'wide';

export interface IconButtonProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'onClick'
> {
  icon: ReactNode;
  'aria-label': string;
  variant?: IconButtonVariant;
  size?: ButtonSize;
  shape?: IconButtonShape;
  width?: IconButtonWidth;
  disabled?: boolean;
  selected?: boolean;
  defaultSelected?: boolean;
  toggle?: boolean;
  /** Opt-in polygon cookie morph (1:1 surfaces). Default uses corner-radius morph. */
  expressiveMorph?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

const VARIANT_PREFIX: Record<IconButtonVariant, string> = {
  standard: 'icon-button',
  filled: 'filled-icon-button',
  'filled-tonal': 'filled-tonal-icon-button',
  outlined: 'outlined-icon-button',
};

interface InteractionState {
  disabled: boolean;
  hovered: boolean;
  focused: boolean;
  pressed: boolean;
  selected: boolean;
}

function resolveIconColor(variant: IconButtonVariant, p: string, state: InteractionState): string {
  if (state.disabled) {
    return disabledContentMix(
      variant === 'standard' || variant === 'outlined'
        ? compVar(p, 'disabled-color')
        : compVar(p, 'disabled-icon-color'),
    );
  }
  if (state.selected) {
    if (state.pressed) return compVar(p, 'selected-pressed-icon-color');
    if (state.hovered) return compVar(p, 'selected-hover-icon-color');
    if (state.focused) return compVar(p, 'selected-focus-icon-color');
    return variant === 'filled' || variant === 'filled-tonal'
      ? compVar(p, 'selected-icon-color')
      : compVar(p, 'selected-color');
  }
  const unselected = variant === 'standard' ? 'unselected-' : '';
  if (state.pressed) return compVar(p, `${unselected}pressed-icon-color`);
  if (state.hovered) return compVar(p, `${unselected}hover-icon-color`);
  if (state.focused) return compVar(p, `${unselected}focus-icon-color`);
  return variant === 'filled' || variant === 'filled-tonal'
    ? compVar(p, 'icon-color')
    : compVar(p, 'color');
}

function getIconButtonVariantStyles(
  variant: IconButtonVariant,
  state: InteractionState,
  outlineWidth: string,
): CSSProperties {
  const p = VARIANT_PREFIX[variant];
  const color = resolveIconColor(variant, p, state);

  const base: CSSProperties = {
    color,
    background: 'transparent',
    border: 'none',
  };

  if (variant === 'filled' || variant === 'filled-tonal') {
    return {
      ...base,
      background: state.disabled
        ? disabledContainerMix(compVar(p, 'disabled-container-color'))
        : state.selected
          ? compVar(p, 'selected-container-color')
          : compVar(p, 'container-color'),
    };
  }

  if (variant === 'outlined') {
    return {
      ...base,
      background: state.selected
        ? state.disabled
          ? disabledContainerMix(compVar(p, 'selected-disabled-container-color'))
          : compVar(p, 'selected-container-color')
        : 'transparent',
      border: state.selected
        ? 'none'
        : `${outlineWidth} solid ${state.disabled ? disabledContainerMix(compVar(p, 'disabled-outline-color')) : compVar(p, 'outline-color')}`,
    };
  }

  return base;
}

function stateLayerTokens(p: string, selected: boolean) {
  if (selected) {
    return {
      hoverStateColor: compVar(p, 'selected-hover-state-layer-color'),
      hoverStateOpacity: compVar(p, 'selected-hover-state-layer-opacity'),
      pressedStateColor: compVar(p, 'selected-pressed-state-layer-color'),
      pressedStateOpacity: compVar(p, 'selected-pressed-state-layer-opacity'),
    };
  }
  const unselected = p === 'icon-button' ? 'unselected-' : '';
  return {
    hoverStateColor: compVar(p, `${unselected}hover-state-layer-color`),
    hoverStateOpacity: compVar(p, 'hover-state-layer-opacity'),
    pressedStateColor: compVar(p, `${unselected}pressed-state-layer-color`),
    pressedStateOpacity: compVar(p, 'pressed-state-layer-opacity'),
  };
}

export function IconButton({
  icon,
  'aria-label': ariaLabel,
  variant = 'standard',
  size = 'sm',
  shape = 'round',
  width = 'default',
  disabled = false,
  selected,
  defaultSelected = false,
  toggle = false,
  expressiveMorph = false,
  onSelectedChange,
  onClick,
  className,
  'data-testid': testId,
  ...nativeProps
}: IconButtonProps) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isSelected = selected ?? internalSelected;

  const tokens = iconButtonSizeTokens(size, width);
  const p = VARIANT_PREFIX[variant];
  const interaction: InteractionState = {
    disabled,
    hovered,
    focused,
    pressed,
    selected: isSelected,
  };
  const variantStyles = getIconButtonVariantStyles(variant, interaction, tokens.outlineWidth);
  const layers = stateLayerTokens(p, isSelected);

  const shapeRound = isSelected
    ? compVar(ICON_BUTTON_SIZE_PREFIX[size], 'selected-container-shape-round')
    : tokens.shapeRound;
  const shapeSquare = isSelected
    ? compVar(ICON_BUTTON_SIZE_PREFIX[size], 'selected-container-shape-square')
    : tokens.shapeSquare;

  const buttonStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: tokens.height,
    boxSizing: 'border-box',
    flexShrink: 0,
    paddingInlineStart: tokens.leadingSpace,
    paddingInlineEnd: tokens.trailingSpace,
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: 'inherit',
    ...variantStyles,
  };

  const iconStyle: CSSProperties = {
    width: tokens.iconSize,
    height: tokens.iconSize,
    color: variantStyles.color,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const interactionHandlers = {
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
  };

  const content = <span style={iconStyle}>{icon}</span>;
  const handleSelectedChange = (next: boolean) => {
    if (selected === undefined) setInternalSelected(next);
    onSelectedChange?.(next);
  };

  const inner = toggle ? (
    <Toggle
      pressed={isSelected}
      onPressedChange={handleSelectedChange}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      className={className}
      style={buttonStyle}
      {...mergeProps(nativeProps, interactionHandlers)}
    >
      {content}
    </Toggle>
  ) : (
    <BaseButton
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={buttonStyle}
      {...mergeProps(nativeProps, interactionHandlers)}
    >
      {content}
    </BaseButton>
  );

  const shell = (
    <PressableShell
      disabled={disabled}
      shape={shape}
      shapeRound={shapeRound}
      shapeSquare={shapeSquare}
      pressedShape={tokens.pressedShape}
      morphFrom={expressiveMorph ? MaterialShapes.circle : undefined}
      morphTo={expressiveMorph ? MaterialShapes.pentagon : undefined}
      morphActive={expressiveMorph && toggle ? isSelected : undefined}
      stateLayerColor={variantStyles.color}
      hoverStateColor={layers.hoverStateColor}
      hoverStateOpacity={layers.hoverStateOpacity}
      pressedStateColor={layers.pressedStateColor}
      pressedStateOpacity={layers.pressedStateOpacity}
      data-testid={testId}
    >
      {inner}
    </PressableShell>
  );

  return shell;
}
