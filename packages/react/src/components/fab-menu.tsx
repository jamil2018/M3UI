import { Menu as BaseMenu } from '@base-ui/react/menu';
import { M3PortalScope } from '../provider/m3-provider.js';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { Icon } from '@m3ui/icons';
import { staggerDelay } from '@m3ui/shapes';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, elevationShadow, sysShape, typeStyle } from '../lib/token-utils.js';
import { PressableShell } from '../lib/pressable-shell.js';

export interface FabMenuAction {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface FabMenuProps {
  icon: ReactNode;
  closeIcon?: ReactNode;
  actions: FabMenuAction[];
  'aria-label': string;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function FabMenu({
  icon,
  closeIcon = <Icon name="close" />,
  actions,
  'aria-label': ariaLabel,
  disabled = false,
  className,
  'data-testid': testId,
}: FabMenuProps) {
  const [open, setOpen] = useState(false);

  const closeShape = compVar('fab-menu-baseline', 'close-button-container-shape');
  const openShape = sysShape('corner-full');
  const itemShape = compVar('fab-menu-baseline', 'list-item-container-shape');
  const pressedShape = compVar('button-large', 'pressed-container-shape');

  const rootStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: compVar('fab-menu-baseline', 'list-item-between-space'),
    minWidth: compVar('fab-menu-baseline', 'close-button-container-width'),
  };

  const fabStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: compVar('fab-menu-baseline', 'close-button-container-width'),
    height: compVar('fab-menu-baseline', 'close-button-container-height'),
    borderRadius: 'inherit',
    background: compVar('fab-primary-container', 'container-color'),
    color: compVar('fab-primary-container', 'icon-color'),
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: elevationShadow('level3'),
    zIndex: 2,
  };

  const menuContainerStyle: CSSProperties = {
    maxHeight: 'var(--available-height)',
    maxWidth: 'var(--available-width)',
    overflowY: 'auto',
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: compVar('fab-menu-baseline', 'list-item-between-space'),
    padding: compVar('fab-menu-baseline', 'close-button-between-space'),
  };

  const itemStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: compVar('fab-menu-baseline', 'list-item-icon-label-space'),
    height: compVar('fab-menu-baseline', 'list-item-container-height'),
    paddingInlineStart: compVar('fab-menu-baseline', 'list-item-leading-space'),
    paddingInlineEnd: compVar('fab-menu-baseline', 'list-item-trailing-space'),
    borderRadius: 'inherit',
    background: compVar('fab-primary-container', 'container-color'),
    color: compVar('fab-primary-container', 'icon-color'),
    border: 'none',
    cursor: 'pointer',
    boxShadow: elevationShadow('level3'),
    ...typeStyle('label-large'),
  };

  const iconBox: CSSProperties = {
    width: compVar('fab-menu-baseline', 'list-item-icon-size'),
    height: compVar('fab-menu-baseline', 'list-item-icon-size'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className={className} data-testid={testId} style={rootStyle}>
      <BaseMenu.Root open={open} onOpenChange={setOpen}>
        <BaseMenu.Portal>
          <M3PortalScope>
            <BaseMenu.Positioner
              side="top"
              align="end"
              sideOffset={8}
              collisionPadding={8}
              style={{ zIndex: 'calc(var(--m3-overlay-layer, 1100) + 1)' }}
            >
              <BaseMenu.Popup style={menuContainerStyle} aria-label="FAB actions">
                {actions.map((action, index) => {
                  const itemDisabled = disabled || Boolean(action.disabled);
                  return (
                    <motion.div
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.8, y: 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                        y: 12,
                        transition: { ...springs.fastSpatial, opacity: springs.fastEffects },
                      }}
                      transition={{
                        ...springs.defaultSpatial,
                        delay: staggerDelay(index) / 1000,
                        opacity: { ...springs.defaultEffects, delay: staggerDelay(index) / 1000 },
                      }}
                    >
                      <PressableShell
                        disabled={itemDisabled}
                        shape="round"
                        shapeRound={itemShape}
                        pressedShape={pressedShape}
                        stateLayerColor={compVar('fab-primary-container', 'icon-color')}
                        hoverStateColor={compVar('fab', 'hover-state-layer-color')}
                        hoverStateOpacity={compVar('fab', 'hover-state-layer-opacity')}
                        pressedStateColor={compVar('fab', 'pressed-state-layer-color')}
                        pressedStateOpacity={compVar('fab', 'pressed-state-layer-opacity')}
                        style={{ display: 'inline-flex', borderRadius: itemShape }}
                      >
                        <BaseMenu.Item
                          disabled={itemDisabled}
                          onClick={() => {
                            action.onClick?.();
                            setOpen(false);
                          }}
                          style={{
                            ...itemStyle,
                            cursor: itemDisabled ? 'not-allowed' : 'pointer',
                            opacity: itemDisabled
                              ? 'var(--md-sys-state-disabled-content-opacity)'
                              : 1,
                          }}
                        >
                          {action.icon && <span style={iconBox}>{action.icon}</span>}
                          <span>{action.label}</span>
                        </BaseMenu.Item>
                      </PressableShell>
                    </motion.div>
                  );
                })}
              </BaseMenu.Popup>
            </BaseMenu.Positioner>
          </M3PortalScope>
        </BaseMenu.Portal>

        <PressableShell
          disabled={disabled}
          shape="round"
          shapeRound={open ? openShape : closeShape}
          pressedShape={pressedShape}
          stateLayerColor={compVar('fab-primary-container', 'icon-color')}
          hoverStateColor={compVar('fab', 'hover-state-layer-color')}
          hoverStateOpacity={compVar('fab', 'hover-state-layer-opacity')}
          pressedStateColor={compVar('fab', 'pressed-state-layer-color')}
          pressedStateOpacity={compVar('fab', 'pressed-state-layer-opacity')}
          style={{ display: 'inline-flex', zIndex: 2 }}
        >
          <BaseMenu.Trigger
            aria-label={open ? 'Close menu' : ariaLabel}
            aria-expanded={open}
            disabled={disabled}
            style={fabStyle}
          >
            <motion.span
              style={{
                display: 'inline-flex',
                width: compVar('fab-menu-baseline', 'close-button-icon-size'),
                height: compVar('fab-menu-baseline', 'close-button-icon-size'),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              animate={{ rotate: 0 }}
              transition={springs.fastSpatial}
            >
              {open ? closeIcon : icon}
            </motion.span>
          </BaseMenu.Trigger>
        </PressableShell>
      </BaseMenu.Root>
    </div>
  );
}
