import { mergeProps } from '@base-ui/react/merge-props';
import { type ComponentPropsWithRef } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { AnimatePresence, motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, compElevation, sysColor, sysShape, typeStyle } from '../lib/token-utils.js';
import { PressableShell } from '../lib/pressable-shell.js';

export type FabSize = 'standard' | 'medium' | 'large';
export type ExtendedFabSize = 'small' | 'medium' | 'large';
export type FabVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'primary-container'
  | 'secondary-container'
  | 'tertiary-container';

export interface FabProps extends Omit<ComponentPropsWithRef<'button'>, 'children' | 'onClick'> {
  icon: ReactNode;
  'aria-label': string;
  size?: FabSize;
  variant?: FabVariant;
  lowered?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

const FAB_SIZE_PREFIX: Record<FabSize, string> = {
  standard: 'fab-baseline',
  medium: 'fab-medium',
  large: 'fab-large',
};

const FAB_SHAPES: Record<FabSize, string> = {
  standard: compVar('fab-baseline', 'container-shape'),
  medium: sysShape('corner-large-increased'),
  large: compVar('fab-large', 'container-shape'),
};

const FAB_COLORS: Record<FabVariant, { container: string; content: string }> = {
  primary: { container: sysColor('primary'), content: sysColor('on-primary') },
  secondary: { container: sysColor('secondary'), content: sysColor('on-secondary') },
  tertiary: { container: sysColor('tertiary'), content: sysColor('on-tertiary') },
  'primary-container': {
    container: compVar('fab-primary-container', 'container-color'),
    content: compVar('fab-primary-container', 'icon-color'),
  },
  'secondary-container': {
    container: sysColor('secondary-container'),
    content: sysColor('on-secondary-container'),
  },
  'tertiary-container': {
    container: sysColor('tertiary-container'),
    content: sysColor('on-tertiary-container'),
  },
};

const PRESSED_SHAPE = compVar('button-large', 'pressed-container-shape');

function fabContainerElevation(
  variant: FabVariant,
  lowered: boolean,
  hovered: boolean,
  pressed: boolean,
  focused: boolean,
): string {
  if (lowered) {
    const p = 'extended-fab-primary';
    if (pressed) return compElevation(p, 'lowered-pressed-container-elevation');
    if (hovered) return compElevation(p, 'lowered-hover-container-elevation');
    if (focused) return compElevation(p, 'lowered-focus-container-elevation');
    return compElevation(p, 'lowered-container-elevation');
  }
  const p = variant === 'primary-container' ? 'fab-primary-container' : 'fab';
  if (pressed) return compElevation(p, 'pressed-container-elevation');
  if (hovered) {
    return compElevation(
      p,
      variant === 'primary-container' ? 'hovered-container-elevation' : 'hover-container-elevation',
    );
  }
  if (focused) {
    return compElevation(
      p,
      variant === 'primary-container' ? 'focused-container-elevation' : 'focus-container-elevation',
    );
  }
  return compElevation(p, 'container-elevation');
}

function extendedFabElevation(
  lowered: boolean,
  hovered: boolean,
  pressed: boolean,
  focused: boolean,
): string {
  const p = 'extended-fab-primary';
  if (lowered) {
    if (pressed) return compElevation(p, 'lowered-pressed-container-elevation');
    if (hovered) return compElevation(p, 'lowered-hover-container-elevation');
    if (focused) return compElevation(p, 'lowered-focus-container-elevation');
    return compElevation(p, 'lowered-container-elevation');
  }
  if (pressed) return compElevation(p, 'pressed-container-elevation');
  if (hovered) return compElevation(p, 'hover-container-elevation');
  if (focused) return compElevation(p, 'focus-container-elevation');
  return compElevation(p, 'container-elevation');
}

function fabStateLayers() {
  // State-layer tokens live on `fab` (not fab-primary-container).
  return {
    hoverStateColor: compVar('fab', 'hover-state-layer-color'),
    hoverStateOpacity: compVar('fab', 'hover-state-layer-opacity'),
    pressedStateColor: compVar('fab', 'pressed-state-layer-color'),
    pressedStateOpacity: compVar('fab', 'pressed-state-layer-opacity'),
  };
}

export function Fab({
  icon,
  'aria-label': ariaLabel,
  size = 'standard',
  variant = 'primary-container',
  lowered = false,
  disabled = false,
  onClick,
  className,
  'data-testid': testId,
  ...nativeProps
}: FabProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const sizePrefix = FAB_SIZE_PREFIX[size];
  const colors = FAB_COLORS[variant];
  const elevation = fabContainerElevation(variant, lowered, hovered, pressed, focused);
  const layers = fabStateLayers();
  const shape = FAB_SHAPES[size];

  const fabStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: compVar(sizePrefix, 'container-width'),
    height: compVar(sizePrefix, 'container-height'),
    borderRadius: 'inherit',
    background: disabled
      ? `color-mix(in srgb, ${sysColor('on-surface')} 12%, transparent)`
      : colors.container,
    color: disabled
      ? `color-mix(in srgb, ${sysColor('on-surface')} 38%, transparent)`
      : colors.content,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : elevation,
  };

  const iconStyle: CSSProperties = {
    width: compVar(sizePrefix, 'icon-size'),
    height: compVar(sizePrefix, 'icon-size'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <PressableShell
      disabled={disabled}
      shape="round"
      shapeRound={shape}
      pressedShape={PRESSED_SHAPE}
      stateLayerColor={colors.content}
      hoverStateColor={layers.hoverStateColor}
      hoverStateOpacity={layers.hoverStateOpacity}
      pressedStateColor={layers.pressedStateColor}
      pressedStateOpacity={layers.pressedStateOpacity}
      style={{ display: 'inline-flex' }}
      data-testid={testId}
    >
      <BaseButton
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
        className={className}
        style={fabStyle}
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
      >
        <span style={iconStyle}>{icon}</span>
      </BaseButton>
    </PressableShell>
  );
}

export interface ExtendedFabProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'onClick'
> {
  icon: ReactNode;
  label: string;
  size?: ExtendedFabSize;
  variant?: FabVariant;
  lowered?: boolean;
  /** When false, collapses the label with a spring width/opacity exit. Default true. */
  expanded?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

const EXTENDED_FAB_SIZE_PREFIX: Record<ExtendedFabSize, string> = {
  small: 'extended-fab-small',
  medium: 'extended-fab-medium',
  large: 'extended-fab-large',
};

const EXTENDED_FAB_SHAPES: Record<ExtendedFabSize, string> = {
  small: compVar('extended-fab-small', 'container-shape'),
  medium: compVar('extended-fab-primary', 'container-shape'),
  large: compVar('extended-fab-large', 'container-shape'),
};

const EXTENDED_FAB_TYPE: Record<ExtendedFabSize, string> = {
  small: 'title-medium',
  medium: 'title-large',
  large: 'headline-small',
};

export function ExtendedFab({
  icon,
  label,
  size = 'small',
  variant = 'primary-container',
  lowered = false,
  expanded = true,
  disabled = false,
  onClick,
  className,
  'data-testid': testId,
  ...nativeProps
}: ExtendedFabProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const sizePrefix = EXTENDED_FAB_SIZE_PREFIX[size];
  const colors =
    variant === 'primary-container'
      ? {
          container: compVar('extended-fab-primary', 'container-color'),
          content: compVar('extended-fab-primary', 'label-text-color'),
        }
      : FAB_COLORS[variant];
  const elevation = extendedFabElevation(lowered, hovered, pressed, focused);
  const layers = fabStateLayers();
  const shape = EXTENDED_FAB_SHAPES[size];

  const fabStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: expanded ? compVar(sizePrefix, 'icon-label-space') : 0,
    height: compVar(sizePrefix, 'container-height'),
    paddingInlineStart: compVar(sizePrefix, 'leading-space'),
    paddingInlineEnd: expanded
      ? compVar(sizePrefix, 'trailing-space')
      : compVar(sizePrefix, 'leading-space'),
    minWidth: compVar(sizePrefix, 'container-height'),
    borderRadius: 'inherit',
    background: disabled
      ? `color-mix(in srgb, ${sysColor('on-surface')} 12%, transparent)`
      : colors.container,
    color: disabled
      ? `color-mix(in srgb, ${sysColor('on-surface')} 38%, transparent)`
      : colors.content,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : elevation,
    ...typeStyle(EXTENDED_FAB_TYPE[size]),
  };

  const iconStyle: CSSProperties = {
    width: compVar(sizePrefix, 'icon-size'),
    height: compVar(sizePrefix, 'icon-size'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <PressableShell
      disabled={disabled}
      shape="round"
      shapeRound={shape}
      pressedShape={PRESSED_SHAPE}
      stateLayerColor={colors.content}
      hoverStateColor={layers.hoverStateColor}
      hoverStateOpacity={layers.hoverStateOpacity}
      pressedStateColor={layers.pressedStateColor}
      pressedStateOpacity={layers.pressedStateOpacity}
      style={{ display: 'inline-flex' }}
      data-testid={testId}
    >
      <BaseButton
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className={className}
        style={fabStyle}
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
      >
        <span style={iconStyle}>{icon}</span>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.span
              key="label"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={springs.fastSpatial}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </BaseButton>
    </PressableShell>
  );
}
