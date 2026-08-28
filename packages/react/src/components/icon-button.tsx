
import { Button as BaseButton } from '@base-ui/react/button';
import { Toggle } from '@base-ui/react/toggle';
import { type CSSProperties, type ReactNode } from 'react';
import {
  compVar,
  iconButtonSizeTokens,
  type ButtonSize,
} from '../lib/token-utils.js';
import { MaterialShapes } from '@m3ui/shapes';
import { PressableShell } from '../lib/pressable-shell.js';

export type IconButtonVariant = 'standard' | 'filled' | 'filled-tonal' | 'outlined';
export type IconButtonShape = 'round' | 'square';
export type IconButtonWidth = 'narrow' | 'default' | 'wide';

export interface IconButtonProps {
  icon: ReactNode;
  'aria-label': string;
  variant?: IconButtonVariant;
  size?: ButtonSize;
  shape?: IconButtonShape;
  width?: IconButtonWidth;
  disabled?: boolean;
  selected?: boolean;
  toggle?: boolean;
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

function getIconButtonVariantStyles(
  variant: IconButtonVariant,
  disabled: boolean,
  selected: boolean,
): CSSProperties {
  const p = VARIANT_PREFIX[variant];
  const colorKey = selected ? 'selected-color' : 'color';
  const disabledKey = 'disabled-color';

  const base: CSSProperties = {
    color: disabled ? compVar(p, disabledKey) : compVar(p, colorKey),
    background: 'transparent',
    border: 'none',
  };

  if (variant === 'filled') {
    return {
      ...base,
      background: disabled
        ? compVar(p, 'disabled-container-color')
        : selected
          ? compVar(p, 'selected-container-color')
          : compVar(p, 'container-color'),
      color: disabled
        ? compVar(p, 'disabled-icon-color')
        : selected
          ? compVar(p, 'selected-icon-color')
          : compVar(p, 'icon-color'),
    };
  }

  if (variant === 'filled-tonal') {
    return {
      ...base,
      background: disabled
        ? compVar(p, 'disabled-container-color')
        : selected
          ? compVar(p, 'selected-container-color')
          : compVar(p, 'container-color'),
      color: disabled
        ? compVar(p, 'disabled-icon-color')
        : selected
          ? compVar(p, 'selected-icon-color')
          : compVar(p, 'icon-color'),
    };
  }

  if (variant === 'outlined') {
    return {
      ...base,
      border: `${compVar('medium-icon-button', 'outlined-outline-width')} solid ${disabled ? compVar(p, 'disabled-outline-color') : compVar(p, 'outline-color')}`,
    };
  }

  return base;
}

export function IconButton({
  icon,
  'aria-label': ariaLabel,
  variant = 'standard',
  size = 'md',
  shape = 'round',
  width = 'default',
  disabled = false,
  selected = false,
  toggle = false,
  onSelectedChange,
  onClick,
  className,
  'data-testid': testId,
}: IconButtonProps) {
  const tokens = iconButtonSizeTokens(size, width);
  const variantStyles = getIconButtonVariantStyles(variant, disabled, selected);

  const buttonStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: tokens.height,
    minWidth: tokens.height,
    paddingInlineStart: tokens.leadingSpace,
    paddingInlineEnd: tokens.trailingSpace,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
    borderRadius: 'inherit',
    ...variantStyles,
  };

  const iconStyle: CSSProperties = {
    width: tokens.iconSize,
    height: tokens.iconSize,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const inner = (
    <BaseButton
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={buttonStyle}
    >
      <span style={iconStyle}>{icon}</span>
    </BaseButton>
  );

  const shell = (
    <PressableShell
      disabled={disabled}
      shape={shape}
      shapeRound={tokens.shapeRound}
      shapeSquare={tokens.shapeSquare}
      pressedShape={tokens.pressedShape}
      morphFrom={selected ? MaterialShapes.pentagon : MaterialShapes.circle}
      morphTo={selected ? MaterialShapes.circle : MaterialShapes.pentagon}
      morphActive={toggle ? selected : undefined}
      stateLayerColor={variantStyles.color}
      data-testid={testId}
    >
      {inner}
    </PressableShell>
  );

  if (toggle) {
    return (
      <Toggle
        pressed={selected}
        onPressedChange={onSelectedChange}
        disabled={disabled}
        aria-label={ariaLabel}
        style={{ display: 'inline-flex', padding: 0, border: 'none', background: 'transparent' }}
      >
        {shell}
      </Toggle>
    );
  }

  return shell;
}
