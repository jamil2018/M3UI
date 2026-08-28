
import { Button as BaseButton } from '@base-ui/react/button';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { MaterialShapes, useMorph } from '@m3ui/shapes';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle, type ButtonSize, BUTTON_SIZE_PREFIX } from '../lib/token-utils.js';
import { StateLayer } from '../primitives/state-layer.js';
import { Ripple } from '../primitives/ripple.js';
import { PopupMotion } from '../lib/popup-motion.js';

export interface SplitButtonProps {
  children: ReactNode;
  menuItems: ReactNode;
  variant?: 'filled' | 'filled-tonal' | 'outlined';
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

const VARIANT_PREFIX = {
  filled: 'filled-button',
  'filled-tonal': 'filled-tonal-button',
  outlined: 'outlined-button',
} as const;

function splitButtonSizePrefix(size: ButtonSize): string {
  const map: Record<ButtonSize, string> = {
    xs: 'split-button-xsmall',
    sm: 'split-button-small',
    md: 'split-button-medium',
    lg: 'split-button-large',
    xl: 'split-button-xlarge',
  };
  return map[size];
}

export function SplitButton({
  children,
  menuItems,
  variant = 'filled',
  size = 'md',
  disabled = false,
  onClick,
  className,
  'data-testid': testId,
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const [leadingPressed, setLeadingPressed] = useState(false);
  const p = VARIANT_PREFIX[variant];
  const sizeP = splitButtonSizePrefix(size);
  const btnP = BUTTON_SIZE_PREFIX[size];

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'stretch',
    gap: open ? compVar(sizeP, 'between-space') : 0,
    height: compVar(sizeP, 'container-height'),
    borderRadius: compVar(sizeP, 'container-shape'),
  };

  const segmentBase: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
    ...typeStyle('label-large'),
    background:
      variant === 'outlined'
        ? 'transparent'
        : compVar(p, 'container-color'),
    color: compVar(p, variant === 'outlined' ? 'label-text-color' : 'label-text-color'),
  };

  const leadingStyle: CSSProperties = {
    ...segmentBase,
    paddingInlineStart: compVar(sizeP, 'leading-button-leading-space'),
    paddingInlineEnd: compVar(sizeP, 'leading-button-trailing-space'),
    borderRadius: `${compVar(sizeP, 'container-shape')} 0 0 ${compVar(sizeP, 'container-shape')}`,
    border: variant === 'outlined'
      ? `${compVar(btnP, 'outlined-outline-width')} solid ${compVar(p, 'outline-color')}`
      : undefined,
    borderInlineEnd: variant === 'outlined' ? 'none' : undefined,
  };

  const trailingStyle: CSSProperties = {
    ...segmentBase,
    paddingInlineStart: compVar(sizeP, 'trailing-button-leading-space'),
    paddingInlineEnd: compVar(sizeP, 'trailing-button-trailing-space'),
    borderRadius: `0 ${compVar(sizeP, 'container-shape')} ${compVar(sizeP, 'container-shape')} 0`,
    border: variant === 'outlined'
      ? `${compVar(btnP, 'outlined-outline-width')} solid ${compVar(p, 'outline-color')}`
      : undefined,
    minWidth: compVar(sizeP, 'trailing-button-leading-space'),
  };

  const { clipPath } = useMorph({
    from: MaterialShapes.pill,
    to: MaterialShapes.square,
    active: open || leadingPressed,
    transition: springs.fastSpatial,
  });

  return (
    <motion.div
      className={className}
      data-testid={testId}
      style={{ ...containerStyle, clipPath: open ? undefined : clipPath }}
      animate={{ gap: open ? 4 : 0 }}
      transition={springs.fastSpatial}
    >
      <Ripple disabled={disabled}>
        <StateLayer disabled={disabled} style={{ display: 'inline-flex' }}>
          <BaseButton
            type="button"
            disabled={disabled}
            onClick={onClick}
            style={leadingStyle}
            onPointerDown={() => !disabled && setLeadingPressed(true)}
            onPointerUp={() => setLeadingPressed(false)}
            onPointerLeave={() => setLeadingPressed(false)}
          >
            {children}
          </BaseButton>
        </StateLayer>
      </Ripple>

      <BaseMenu.Root open={open} onOpenChange={setOpen}>
        <BaseMenu.Trigger
          disabled={disabled}
          style={trailingStyle}
          aria-label="Show menu"
        >
          <motion.span
            style={{
              display: 'inline-flex',
              width: compVar(sizeP, 'trailing-icon-size'),
              height: compVar(sizeP, 'trailing-icon-size'),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            animate={{ rotate: open ? 180 : 0 }}
            transition={springs.fastEffects}
          >
            ▾
          </motion.span>
        </BaseMenu.Trigger>
        <BaseMenu.Portal>
          <BaseMenu.Positioner sideOffset={4}>
            <PopupMotion>
              <BaseMenu.Popup
                style={{
                  background: compVar('menu', 'container-color'),
                  borderRadius: compVar('menu', 'container-shape'),
                  padding: compVar('list', 'item-top-space'),
                  minWidth: 160,
                  outline: 'none',
                  zIndex: 1000,
                }}
              >
                <BaseMenu.Viewport>{menuItems}</BaseMenu.Viewport>
              </BaseMenu.Popup>
            </PopupMotion>
          </BaseMenu.Positioner>
        </BaseMenu.Portal>
      </BaseMenu.Root>
    </motion.div>
  );
}
