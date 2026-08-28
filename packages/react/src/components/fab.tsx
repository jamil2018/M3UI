
import { Button as BaseButton } from '@base-ui/react/button';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { StateLayer } from '../primitives/state-layer.js';
import { Ripple } from '../primitives/ripple.js';

export type FabSize = 'small' | 'medium' | 'large';

export interface FabProps {
  icon: ReactNode;
  'aria-label': string;
  size?: FabSize;
  lowered?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

const FAB_SIZE_PREFIX: Record<FabSize, string> = {
  small: 'fab-small',
  medium: 'fab-medium',
  large: 'fab-large',
};

export function Fab({
  icon,
  'aria-label': ariaLabel,
  size = 'medium',
  lowered = false,
  disabled = false,
  onClick,
  className,
  'data-testid': testId,
}: FabProps) {
  const [pressed, setPressed] = useState(false);
  const sizePrefix = FAB_SIZE_PREFIX[size];
  const containerPrefix = 'fab-primary-container';

  const elevation = lowered
    ? 'level1'
    : pressed
      ? compVar(containerPrefix, 'pressed-container-elevation').includes('level')
        ? 'level3'
        : 'level3'
      : 'level3';

  const fabStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: compVar(sizePrefix, 'container-width'),
    height: compVar(sizePrefix, 'container-height'),
    borderRadius: compVar(sizePrefix, 'container-shape'),
    background: disabled
      ? compVar(containerPrefix, 'disabled-container-color')
      : compVar(containerPrefix, 'container-color'),
    color: disabled
      ? compVar(containerPrefix, 'disabled-icon-color')
      : compVar(containerPrefix, 'icon-color'),
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
    boxShadow: disabled ? elevationShadow('level0') : elevationShadow(elevation),
  };

  const iconStyle: CSSProperties = {
    width: compVar(sizePrefix, 'icon-size'),
    height: compVar(sizePrefix, 'icon-size'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Ripple disabled={disabled}>
      <StateLayer disabled={disabled}>
        <motion.div
          data-testid={testId}
          animate={{ boxShadow: disabled ? elevationShadow('level0') : elevationShadow(lowered ? 'level1' : 'level3') }}
          transition={springs.fastSpatial}
          onPointerDown={() => !disabled && setPressed(true)}
          onPointerUp={() => { setPressed(false); }}
          onPointerLeave={() => { setPressed(false); }}
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
  size?: FabSize;
  lowered?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

const EXTENDED_FAB_SIZE_PREFIX: Record<FabSize, string> = {
  small: 'extended-fab-small',
  medium: 'extended-fab-medium',
  large: 'extended-fab-large',
};

export function ExtendedFab({
  icon,
  label,
  size = 'medium',
  lowered = false,
  disabled = false,
  onClick,
  className,
  'data-testid': testId,
}: ExtendedFabProps) {
  const [pressed, setPressed] = useState(false);
  const sizePrefix = EXTENDED_FAB_SIZE_PREFIX[size];
  const containerPrefix = 'extended-fab-primary';

  const fabStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: compVar(sizePrefix, 'icon-label-space'),
    height: compVar(sizePrefix, 'container-height'),
    paddingInlineStart: compVar(sizePrefix, 'leading-space'),
    paddingInlineEnd: compVar(sizePrefix, 'trailing-space'),
    borderRadius: compVar(sizePrefix, 'container-shape'),
    background: disabled
      ? compVar(containerPrefix, 'disabled-container-color')
      : compVar(containerPrefix, 'container-color'),
    color: disabled
      ? compVar(containerPrefix, 'disabled-label-text-color')
      : compVar(containerPrefix, 'label-text-color'),
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
    ...typeStyle('label-large'),
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
    <Ripple disabled={disabled}>
      <StateLayer disabled={disabled}>
        <motion.div
          data-testid={testId}
          animate={{
            boxShadow: disabled
              ? elevationShadow('level0')
              : elevationShadow(lowered || pressed ? 'level1' : 'level3'),
          }}
          transition={springs.fastSpatial}
          onPointerDown={() => !disabled && setPressed(true)}
          onPointerUp={() => { setPressed(false); }}
          onPointerLeave={() => { setPressed(false); }}
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
