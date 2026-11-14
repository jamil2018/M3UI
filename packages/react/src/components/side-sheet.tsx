import { useDirection } from '@base-ui/react/direction-provider';
import { M3PortalScope } from '../provider/m3-provider.js';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { AnimatePresence, motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import {
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from 'react';
import { Icon } from '@m3ui/icons';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { ScrimMotion } from '../lib/overlay-motion.js';

export type SideSheetVariant = 'standard' | 'modal';
export type SideSheetSide = 'start' | 'end';

export interface SideSheetProps {
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: SideSheetVariant;
  side?: SideSheetSide;
  headline?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function SideSheet({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  variant = 'modal',
  side = 'end',
  headline,
  actions,
  children,
  className,
  'data-testid': testId,
}: SideSheetProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isOpen = open ?? internalOpen;
  const handleOpenChange = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  const direction = useDirection();
  const isRight = (side === 'end') === (direction === 'ltr');
  const swipeDirection = isRight ? 'right' : 'left';
  const shape = compVar('navigation-drawer', 'container-shape');

  const popupStyle: CSSProperties = {
    width: compVar('navigation-drawer', 'container-width'),
    maxWidth: '100%',
    height: '100%',
    background: compVar('navigation-drawer', 'modal-container-color'),
    boxShadow: elevationShadow('level2'),
    display: 'flex',
    flexDirection: 'column',
    ...(side === 'start'
      ? { borderStartEndRadius: shape, borderEndEndRadius: shape }
      : { borderStartStartRadius: shape, borderEndStartRadius: shape }),
  };

  const triggerElement = trigger && isValidElement(trigger) ? (trigger as ReactElement) : undefined;
  const slideX = isRight ? '100%' : '-100%';

  return (
    <BaseDrawer.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      modal={variant === 'modal'}
      swipeDirection={swipeDirection}
    >
      {triggerElement && <BaseDrawer.Trigger render={triggerElement} />}
      <AnimatePresence>
        {isOpen && (
          <BaseDrawer.Portal keepMounted>
            <M3PortalScope>
              {variant === 'modal' && (
                <BaseDrawer.Backdrop
                  render={(props) => (
                    <ScrimMotion
                      {...props}
                      style={{
                        ...props.style,
                        position: 'fixed',
                        zIndex: 'var(--m3-overlay-layer, 1100)',
                        inset: 0,
                        background: compVar('scrim', 'container-color'),
                        opacity: 0.32,
                      }}
                    />
                  )}
                />
              )}
              <BaseDrawer.Viewport
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 'calc(var(--m3-overlay-layer, 1100) + 1)',
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: side === 'end' ? 'flex-end' : 'flex-start',
                  pointerEvents: 'none',
                }}
              >
                <BaseDrawer.Popup
                  className={className}
                  data-testid={testId}
                  style={{ ...popupStyle, pointerEvents: 'auto' }}
                  render={
                    <motion.div
                      initial={{ x: slideX, opacity: 1 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: slideX, opacity: 0 }}
                      transition={{ ...springs.defaultSpatial, opacity: springs.fastEffects }}
                    />
                  }
                >
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {(headline || actions) && (
                      <header
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: compVar('list', 'item-between-space'),
                          padding: compVar('list', 'divider-leading-space'),
                          borderBottom: `1px solid ${compVar('divider', 'color')}`,
                        }}
                      >
                        {headline && (
                          <h2 style={{ ...typeStyle('title-large'), flex: 1, margin: 0 }}>
                            {headline}
                          </h2>
                        )}
                        {actions}
                        <BaseDrawer.Close
                          aria-label="Close"
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Icon name="close" />
                        </BaseDrawer.Close>
                      </header>
                    )}
                    <BaseDrawer.Content
                      style={{
                        flex: 1,
                        overflow: 'auto',
                        padding: compVar('list', 'divider-leading-space'),
                      }}
                    >
                      {children}
                    </BaseDrawer.Content>
                  </div>
                </BaseDrawer.Popup>
              </BaseDrawer.Viewport>
            </M3PortalScope>
          </BaseDrawer.Portal>
        )}
      </AnimatePresence>
    </BaseDrawer.Root>
  );
}
