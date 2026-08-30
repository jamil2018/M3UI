
import { Button as BaseButton } from '@base-ui/react/button';
import { Toggle } from '@base-ui/react/toggle';
import { type CSSProperties, type ReactNode } from 'react';
import {
  compVar,
  iconButtonSizeTokens,
  ICON_BUTTON_SIZE_PREFIX,
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

const VARIANT_LAYOUT: Record<IconButtonVariant, CSSProperties> = {
  standard: {
    minHeight: compVar('icon-button', 'icon-size'),
    minWidth: compVar('icon-button', 'icon-size'),
    ['--icon-button-icon-size' as string]: compVar('icon-button', 'icon-size'),
    ['--icon-button-disabled-opacity' as string]: compVar('icon-button', 'disabled-icon-opacity'),
    ['--icon-button-focus-icon-color' as string]: compVar('icon-button', 'focus-icon-color'),
    ['--icon-button-hover-icon-color' as string]: compVar('icon-button', 'hover-icon-color'),
    ['--icon-button-hover-state-color' as string]: compVar('icon-button', 'hover-state-layer-color'),
    ['--icon-button-hover-state-opacity' as string]: compVar('icon-button', 'hover-state-layer-opacity'),
    ['--icon-button-pressed-icon-color' as string]: compVar('icon-button', 'pressed-icon-color'),
    ['--icon-button-pressed-state-color' as string]: compVar('icon-button', 'pressed-state-layer-color'),
    ['--icon-button-pressed-state-opacity' as string]: compVar('icon-button', 'pressed-state-layer-opacity'),
    ['--icon-button-selected-focus-icon-color' as string]: compVar('icon-button', 'selected-focus-icon-color'),
    ['--icon-button-selected-hover-icon-color' as string]: compVar('icon-button', 'selected-hover-icon-color'),
    ['--icon-button-selected-hover-state-color' as string]: compVar('icon-button', 'selected-hover-state-layer-color'),
    ['--icon-button-selected-hover-state-opacity' as string]: compVar('icon-button', 'selected-hover-state-layer-opacity'),
    ['--icon-button-selected-pressed-icon-color' as string]: compVar('icon-button', 'selected-pressed-icon-color'),
    ['--icon-button-selected-pressed-state-color' as string]: compVar('icon-button', 'selected-pressed-state-layer-color'),
    ['--icon-button-selected-pressed-state-opacity' as string]: compVar('icon-button', 'selected-pressed-state-layer-opacity'),
    ['--icon-button-state-layer-height' as string]: compVar('icon-button', 'state-layer-height'),
    ['--icon-button-state-layer-shape' as string]: compVar('icon-button', 'state-layer-shape'),
    ['--icon-button-state-layer-width' as string]: compVar('icon-button', 'state-layer-width'),
  },
  filled: {
    minHeight: compVar('filled-icon-button', 'container-height'),
    minWidth: compVar('filled-icon-button', 'container-width'),
    borderRadius: compVar('filled-icon-button', 'container-shape'),
    ['--filled-icon-button-icon-size' as string]: compVar('filled-icon-button', 'icon-size'),
    ['--filled-icon-button-disabled-container-opacity' as string]: compVar('filled-icon-button', 'disabled-container-opacity'),
    ['--filled-icon-button-disabled-icon-opacity' as string]: compVar('filled-icon-button', 'disabled-icon-opacity'),
    ['--filled-icon-button-focus-icon-color' as string]: compVar('filled-icon-button', 'focus-icon-color'),
    ['--filled-icon-button-hover-icon-color' as string]: compVar('filled-icon-button', 'hover-icon-color'),
    ['--filled-icon-button-hover-state-color' as string]: compVar('filled-icon-button', 'hover-state-layer-color'),
    ['--filled-icon-button-hover-state-opacity' as string]: compVar('filled-icon-button', 'hover-state-layer-opacity'),
    ['--filled-icon-button-pressed-icon-color' as string]: compVar('filled-icon-button', 'pressed-icon-color'),
    ['--filled-icon-button-pressed-state-color' as string]: compVar('filled-icon-button', 'pressed-state-layer-color'),
    ['--filled-icon-button-pressed-state-opacity' as string]: compVar('filled-icon-button', 'pressed-state-layer-opacity'),
  },
  'filled-tonal': {
    minHeight: compVar('filled-tonal-icon-button', 'container-height'),
    minWidth: compVar('filled-tonal-icon-button', 'container-width'),
    borderRadius: compVar('filled-tonal-icon-button', 'container-shape'),
    ['--filled-tonal-icon-button-icon-size' as string]: compVar('filled-tonal-icon-button', 'icon-size'),
    ['--filled-tonal-icon-button-disabled-container-opacity' as string]: compVar('filled-tonal-icon-button', 'disabled-container-opacity'),
    ['--filled-tonal-icon-button-disabled-icon-opacity' as string]: compVar('filled-tonal-icon-button', 'disabled-icon-opacity'),
    ['--filled-tonal-icon-button-focus-icon-color' as string]: compVar('filled-tonal-icon-button', 'focus-icon-color'),
    ['--filled-tonal-icon-button-hover-icon-color' as string]: compVar('filled-tonal-icon-button', 'hover-icon-color'),
    ['--filled-tonal-icon-button-hover-state-color' as string]: compVar('filled-tonal-icon-button', 'hover-state-layer-color'),
    ['--filled-tonal-icon-button-hover-state-opacity' as string]: compVar('filled-tonal-icon-button', 'hover-state-layer-opacity'),
    ['--filled-tonal-icon-button-pressed-icon-color' as string]: compVar('filled-tonal-icon-button', 'pressed-icon-color'),
    ['--filled-tonal-icon-button-pressed-state-color' as string]: compVar('filled-tonal-icon-button', 'pressed-state-layer-color'),
    ['--filled-tonal-icon-button-pressed-state-opacity' as string]: compVar('filled-tonal-icon-button', 'pressed-state-layer-opacity'),
  },
  outlined: {},
};

function getIconButtonVariantStyles(
  variant: IconButtonVariant,
  disabled: boolean,
  selected: boolean,
  outlineWidth: string,
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
      border: `${outlineWidth} solid ${disabled ? compVar(p, 'disabled-outline-color') : compVar(p, 'outline-color')}`,
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
  const variantStyles = getIconButtonVariantStyles(variant, disabled, selected, tokens.outlineWidth);

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
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
    borderRadius: 'inherit',
    ...VARIANT_LAYOUT[variant],
    ...variantStyles,
  };

  const iconStyle: CSSProperties = {
    width: tokens.iconSize,
    height: tokens.iconSize,
    color: variantStyles.color ?? compVar(VARIANT_PREFIX[variant], 'icon-color'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const content = <span style={iconStyle}>{icon}</span>;
  const inner = toggle ? (
    <span className={className} style={buttonStyle}>{content}</span>
  ) : (
    <BaseButton
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={buttonStyle}
    >
      {content}
    </BaseButton>
  );

  const shell = (
    <PressableShell
      disabled={disabled}
      shape={shape}
      shapeRound={selected ? compVar(ICON_BUTTON_SIZE_PREFIX[size], 'selected-container-shape-round') : tokens.shapeRound}
      shapeSquare={selected ? compVar(ICON_BUTTON_SIZE_PREFIX[size], 'selected-container-shape-square') : tokens.shapeSquare}
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
        onClick={onClick}
        style={{ display: 'inline-flex', padding: 0, border: 'none', background: 'transparent' }}
      >
        {shell}
      </Toggle>
    );
  }

  return shell;
}
