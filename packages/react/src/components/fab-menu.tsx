
import { Button as BaseButton } from '@base-ui/react/button';
import { AnimatePresence, motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { MaterialShapes, useMorph, staggerDelay } from '@m3ui/shapes';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { StateLayer } from '../primitives/state-layer.js';
import { Ripple } from '../primitives/ripple.js';

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
  closeIcon = '✕',
  actions,
  'aria-label': ariaLabel,
  disabled = false,
  className,
  'data-testid': testId,
}: FabMenuProps) {
  const [open, setOpen] = useState(false);

  const { clipPath } = useMorph({
    from: MaterialShapes.circle,
    to: MaterialShapes.pill,
    active: open,
    transition: springs.defaultSpatial,
    width: 56,
    height: Math.max(56, actions.length * 60 + 16),
  });

  const rootStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: compVar('fab-menu-baseline', 'list-item-between-space'),
  };

  const fabStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: compVar('fab-menu-baseline', 'close-button-container-width'),
    height: compVar('fab-menu-baseline', 'close-button-container-height'),
    borderRadius: compVar('fab-menu-baseline', 'close-button-container-shape'),
    background: compVar('fab-primary-container', 'container-color'),
    color: compVar('fab-primary-container', 'icon-color'),
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: elevationShadow('level3'),
    zIndex: 2,
  };

  const menuContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: compVar('fab-menu-baseline', 'list-item-between-space'),
    padding: compVar('fab-menu-baseline', 'close-button-between-space'),
    clipPath: open ? clipPath : undefined,
  };

  const itemStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: compVar('fab-menu-baseline', 'list-item-icon-label-space'),
    height: compVar('fab-menu-baseline', 'list-item-container-height'),
    paddingInlineStart: compVar('fab-menu-baseline', 'list-item-leading-space'),
    paddingInlineEnd: compVar('fab-menu-baseline', 'list-item-trailing-space'),
    borderRadius: compVar('fab-menu-baseline', 'list-item-container-shape'),
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
      <AnimatePresence>
        {open && (
          <motion.div
            style={menuContainerStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springs.defaultEffects}
            role="menu"
            aria-label="FAB actions"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{
                  ...springs.defaultSpatial,
                  delay: staggerDelay(index) / 1000,
                }}
              >
                <Ripple>
                  <StateLayer style={{ display: 'inline-flex', borderRadius: 'inherit' }}>
                    <BaseButton
                      type="button"
                      role="menuitem"
                      disabled={action.disabled}
                      onClick={() => {
                        action.onClick?.();
                        setOpen(false);
                      }}
                      style={itemStyle}
                    >
                      {action.icon && <span style={iconBox}>{action.icon}</span>}
                      <span>{action.label}</span>
                    </BaseButton>
                  </StateLayer>
                </Ripple>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Ripple disabled={disabled}>
        <StateLayer disabled={disabled} style={{ display: 'inline-flex', borderRadius: 'inherit' }}>
          <BaseButton
            type="button"
            aria-label={open ? 'Close menu' : ariaLabel}
            aria-expanded={open}
            disabled={disabled}
            onClick={() => { setOpen((v) => !v); }}
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
              animate={{ rotate: open ? 45 : 0 }}
              transition={springs.fastEffects}
            >
              {open ? closeIcon : icon}
            </motion.span>
          </BaseButton>
        </StateLayer>
      </Ripple>
    </div>
  );
}
