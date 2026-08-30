
import { Button as BaseButton } from '@base-ui/react/button';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, compElevation, sysColor, sysShape, typeStyle } from '../lib/token-utils.js';
import { StateLayer } from '../primitives/state-layer.js';
import { Ripple } from '../primitives/ripple.js';

export type FabSize = 'standard' | 'medium' | 'large';
export type ExtendedFabSize = 'small' | 'medium' | 'large';
export type FabVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'primary-container'
  | 'secondary-container'
  | 'tertiary-container';

export interface FabProps {
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

const FAB_CONTRACT: CSSProperties = {
  ['--fab-container-color' as string]: compVar('fab', 'container-color'),
  ['--fab-container-elevation' as string]: compElevation('fab'),
  ['--fab-container-height' as string]: compVar('fab', 'container-height'),
  ['--fab-container-shadow-color' as string]: compVar('fab', 'container-shadow-color'),
  ['--fab-container-shape' as string]: compVar('fab', 'container-shape'),
  ['--fab-container-width' as string]: compVar('fab', 'container-width'),
  ['--fab-focus-elevation' as string]: compElevation('fab', 'focus-container-elevation'),
  ['--fab-focus-icon-color' as string]: compVar('fab', 'focus-icon-color'),
  ['--fab-focus-label-color' as string]: compVar('fab', 'focus-label-text-color'),
  ['--fab-hover-elevation' as string]: compElevation('fab', 'hover-container-elevation'),
  ['--fab-hover-icon-color' as string]: compVar('fab', 'hover-icon-color'),
  ['--fab-hover-label-color' as string]: compVar('fab', 'hover-label-text-color'),
  ['--fab-hover-state-color' as string]: compVar('fab', 'hover-state-layer-color'),
  ['--fab-hover-state-opacity' as string]: compVar('fab', 'hover-state-layer-opacity'),
  ['--fab-icon-color' as string]: compVar('fab', 'icon-color'),
  ['--fab-icon-size' as string]: compVar('fab', 'icon-size'),
  ['--fab-label-color' as string]: compVar('fab', 'label-text-color'),
  ['--fab-pressed-elevation' as string]: compElevation('fab', 'pressed-container-elevation'),
  ['--fab-pressed-icon-color' as string]: compVar('fab', 'pressed-icon-color'),
  ['--fab-pressed-label-color' as string]: compVar('fab', 'pressed-label-text-color'),
  ['--fab-pressed-state-color' as string]: compVar('fab', 'pressed-state-layer-color'),
  ['--fab-pressed-state-opacity' as string]: compVar('fab', 'pressed-state-layer-opacity'),
};

const FAB_COLORS: Record<FabVariant, { container: string; content: string }> = {
  primary: { container: sysColor('primary'), content: sysColor('on-primary') },
  secondary: { container: sysColor('secondary'), content: sysColor('on-secondary') },
  tertiary: { container: sysColor('tertiary'), content: sysColor('on-tertiary') },
  'primary-container': {
    container: compVar('fab-primary-container', 'container-color'),
    content: compVar('fab-primary-container', 'icon-color'),
  },
  'secondary-container': { container: sysColor('secondary-container'), content: sysColor('on-secondary-container') },
  'tertiary-container': { container: sysColor('tertiary-container'), content: sysColor('on-tertiary-container') },
};

function fabContainerElevation(
  variant: FabVariant,
  lowered: boolean,
  hovered: boolean,
  pressed: boolean,
): string {
  const p = 'fab-primary-container';
  if (variant !== 'primary-container') {
    return compElevation(p);
  }
  if (lowered) {
    if (pressed) return compElevation(p, 'pressed-container-elevation');
    if (hovered) return compElevation(p, 'hovered-container-elevation');
    return compElevation(p, 'container-elevation');
  }
  if (pressed) return compElevation(p, 'pressed-container-elevation');
  if (hovered) return compElevation(p, 'hovered-container-elevation');
  return compElevation(p, 'container-elevation');
}

function extendedFabElevation(lowered: boolean, hovered: boolean, pressed: boolean): string {
  const p = 'extended-fab-primary';
  if (lowered) {
    if (pressed) return compElevation(p, 'lowered-pressed-container-elevation');
    if (hovered) return compElevation(p, 'lowered-hover-container-elevation');
    return compElevation(p, 'lowered-container-elevation');
  }
  if (pressed) return compElevation(p, 'pressed-container-elevation');
  if (hovered) return compElevation(p, 'hover-container-elevation');
  return compElevation(p, 'container-elevation');
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
}: FabProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const sizePrefix = FAB_SIZE_PREFIX[size];
  const colors = FAB_COLORS[variant];
  const elevation = fabContainerElevation(variant, lowered, hovered, pressed);

  const fabStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: compVar(sizePrefix, 'container-width'),
    height: compVar(sizePrefix, 'container-height'),
    borderRadius: FAB_SHAPES[size],
    background: disabled ? `color-mix(in srgb, ${sysColor('on-surface')} 12%, transparent)` : colors.container,
    color: disabled ? `color-mix(in srgb, ${sysColor('on-surface')} 38%, transparent)` : colors.content,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...FAB_CONTRACT,
  };

  const iconStyle: CSSProperties = {
    width: compVar(sizePrefix, 'icon-size'),
    height: compVar(sizePrefix, 'icon-size'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Ripple disabled={disabled} color={colors.content} style={{ display: 'inline-flex', borderRadius: FAB_SHAPES[size] }}>
      <StateLayer disabled={disabled} color={colors.content} style={{ display: 'inline-flex', borderRadius: 'inherit' }}>
        <motion.div
          data-testid={testId}
          style={{ display: 'inline-flex', borderRadius: 'inherit', boxShadow: disabled ? 'none' : elevation }}
          animate={{ boxShadow: disabled ? 'none' : elevation }}
          transition={springs.fastSpatial}
          onPointerDown={() => !disabled && setPressed(true)}
          onPointerUp={() => { setPressed(false); }}
          onPointerLeave={() => { setPressed(false); }}
          onMouseEnter={() => !disabled && setHovered(true)}
          onMouseLeave={() => { setHovered(false); }}
        >
          <BaseButton
            aria-label={ariaLabel}
            disabled={disabled}
            onClick={onClick}
            className={className}
            style={fabStyle}
          >
            <span style={iconStyle}>{icon}</span>
          </BaseButton>
        </motion.div>
      </StateLayer>
    </Ripple>
  );
}

export interface ExtendedFabProps {
  icon: ReactNode;
  label: string;
  size?: ExtendedFabSize;
  variant?: FabVariant;
  lowered?: boolean;
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
  disabled = false,
  onClick,
  className,
  'data-testid': testId,
}: ExtendedFabProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const sizePrefix = EXTENDED_FAB_SIZE_PREFIX[size];
  const colors = variant === 'primary-container'
    ? {
        container: compVar('extended-fab-primary', 'container-color'),
        content: compVar('extended-fab-primary', 'label-text-color'),
      }
    : FAB_COLORS[variant];
  const elevation = extendedFabElevation(lowered, hovered, pressed);

  const fabStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: compVar(sizePrefix, 'icon-label-space'),
    height: compVar(sizePrefix, 'container-height'),
    paddingInlineStart: compVar(sizePrefix, 'leading-space'),
    paddingInlineEnd: compVar(sizePrefix, 'trailing-space'),
    minWidth: compVar(sizePrefix, 'container-height'),
    borderRadius: EXTENDED_FAB_SHAPES[size],
    background: disabled ? `color-mix(in srgb, ${sysColor('on-surface')} 12%, transparent)` : colors.container,
    color: disabled ? `color-mix(in srgb, ${sysColor('on-surface')} 38%, transparent)` : colors.content,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
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
    <Ripple disabled={disabled} color={colors.content} style={{ display: 'inline-flex', borderRadius: EXTENDED_FAB_SHAPES[size] }}>
      <StateLayer disabled={disabled} color={colors.content} style={{ display: 'inline-flex', borderRadius: 'inherit' }}>
        <motion.div
          data-testid={testId}
          style={{ display: 'inline-flex', borderRadius: 'inherit', boxShadow: disabled ? 'none' : elevation }}
          animate={{ boxShadow: disabled ? 'none' : elevation }}
          transition={springs.fastSpatial}
          onPointerDown={() => !disabled && setPressed(true)}
          onPointerUp={() => { setPressed(false); }}
          onPointerLeave={() => { setPressed(false); }}
          onMouseEnter={() => !disabled && setHovered(true)}
          onMouseLeave={() => { setHovered(false); }}
        >
          <BaseButton
            disabled={disabled}
            onClick={onClick}
            className={className}
            style={fabStyle}
          >
            <span style={iconStyle}>{icon}</span>
            <span>{label}</span>
          </BaseButton>
        </motion.div>
      </StateLayer>
    </Ripple>
  );
}
