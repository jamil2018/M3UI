import { useDirection } from '@base-ui/react/direction-provider';
import { M3PortalScope } from '../provider/m3-provider.js';
import { Button as BaseButton } from '@base-ui/react/button';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Icon } from '@m3ui/icons';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle, type ButtonSize, BUTTON_SIZE_PREFIX } from '../lib/token-utils.js';
import { PressableShell } from '../lib/pressable-shell.js';
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
  const direction = useDirection();
  const corners = (start: string, end: string) =>
    direction === 'rtl' ? `${end} ${start} ${start} ${end}` : `${start} ${end} ${end} ${start}`;
  const p = VARIANT_PREFIX[variant];
  const sizeP = splitButtonSizePrefix(size);
  const btnP = BUTTON_SIZE_PREFIX[size];
  const height = compVar(sizeP, 'container-height');
  const outerShape = `min(${compVar(sizeP, 'container-shape')}, calc(${height} / 2))`;
  const innerCorner = compVar(sizeP, 'inner-corner-corner-size');
  const innerPressedCorner = compVar(sizeP, 'inner-pressed-corner-corner-size');
  const pressedShape = compVar(btnP, 'pressed-container-shape');
  const betweenSpace = compVar(sizeP, 'between-space');

  const leadingRestRadius = corners(outerShape, innerCorner);
  const trailingRestRadius = corners(innerCorner, outerShape);
  const leadingPressedRadius = corners(outerShape, innerPressedCorner);
  const trailingPressedRadius = corners(innerPressedCorner, outerShape);
  const leadingOpenRadius = corners(outerShape, pressedShape);
  const trailingOpenRadius = outerShape;

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'stretch',
    gap: betweenSpace,
    height: compVar(sizeP, 'container-height'),
    borderRadius: outerShape,
  };

  const segmentBase: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
    ...typeStyle('label-large'),
    background:
      variant === 'outlined'
        ? 'transparent'
        : disabled
          ? compVar(p, 'disabled-container-color')
          : compVar(p, 'container-color'),
    color: disabled ? compVar(p, 'disabled-label-text-color') : compVar(p, 'label-text-color'),
  };

  const leadingStyle: CSSProperties = {
    ...segmentBase,
    paddingInlineStart: compVar(sizeP, 'leading-button-leading-space'),
    paddingInlineEnd: compVar(sizeP, 'leading-button-trailing-space'),
    borderRadius: 'inherit',
    border:
      variant === 'outlined'
        ? `${compVar(btnP, 'outlined-outline-width')} solid ${disabled ? compVar(p, 'disabled-outline-color') : compVar(p, 'outline-color')}`
        : undefined,
  };

  const trailingStyle: CSSProperties = {
    ...segmentBase,
    paddingInlineStart: compVar(sizeP, 'trailing-button-leading-space'),
    paddingInlineEnd: compVar(sizeP, 'trailing-button-trailing-space'),
    borderRadius: 'inherit',
    border:
      variant === 'outlined'
        ? `${compVar(btnP, 'outlined-outline-width')} solid ${disabled ? compVar(p, 'disabled-outline-color') : compVar(p, 'outline-color')}`
        : undefined,
    minWidth: compVar(sizeP, 'trailing-button-leading-space'),
  };

  return (
    <div className={className} data-testid={testId} style={containerStyle}>
      <PressableShell
        disabled={disabled}
        shape="round"
        shapeRound={open ? leadingOpenRadius : leadingRestRadius}
        pressedShape={open ? leadingOpenRadius : leadingPressedRadius}
        stateLayerColor={segmentBase.color}
        hoverStateColor={compVar(p, 'hover-state-layer-color')}
        hoverStateOpacity={compVar(p, 'hover-state-layer-opacity')}
        pressedStateColor={compVar(p, 'pressed-state-layer-color')}
        pressedStateOpacity={compVar(p, 'pressed-state-layer-opacity')}
        style={{ display: 'inline-flex' }}
      >
        <BaseButton type="button" disabled={disabled} onClick={onClick} style={leadingStyle}>
          {children}
        </BaseButton>
      </PressableShell>

      <BaseMenu.Root open={open} onOpenChange={setOpen}>
        <PressableShell
          disabled={disabled}
          shape="round"
          shapeRound={open ? trailingOpenRadius : trailingRestRadius}
          pressedShape={open ? pressedShape : trailingPressedRadius}
          stateLayerColor={segmentBase.color}
          hoverStateColor={compVar(p, 'hover-state-layer-color')}
          hoverStateOpacity={compVar(p, 'hover-state-layer-opacity')}
          pressedStateColor={compVar(p, 'pressed-state-layer-color')}
          pressedStateOpacity={compVar(p, 'pressed-state-layer-opacity')}
          style={{ display: 'inline-flex' }}
        >
          <BaseMenu.Trigger disabled={disabled} style={trailingStyle} aria-label="Show menu">
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
              <Icon name="keyboard_arrow_down" />
            </motion.span>
          </BaseMenu.Trigger>
        </PressableShell>
        <BaseMenu.Portal>
          <M3PortalScope>
            <BaseMenu.Positioner
              sideOffset={4}
              style={{ zIndex: 'calc(var(--m3-overlay-layer, 1100) + 1)' }}
            >
              <PopupMotion>
                <BaseMenu.Popup
                  style={{
                    background: compVar('menu', 'container-color'),
                    borderRadius: compVar('menu', 'container-shape'),
                    padding: compVar('list', 'item-top-space'),
                    minWidth: 160,
                    outline: 'none',
                    zIndex: 'calc(var(--m3-overlay-layer, 1100) + 1)',
                  }}
                >
                  <BaseMenu.Viewport>{menuItems}</BaseMenu.Viewport>
                </BaseMenu.Popup>
              </PopupMotion>
            </BaseMenu.Positioner>
          </M3PortalScope>
        </BaseMenu.Portal>
      </BaseMenu.Root>
    </div>
  );
}
