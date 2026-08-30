
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { type CSSProperties, type ReactElement, type ReactNode, isValidElement } from 'react';
import { Icon } from '@m3ui/icons';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { OverlayMotion, ScrimMotion } from '../lib/overlay-motion.js';

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
  const swipeDirection = side === 'end' ? 'right' : 'left';

  const popupStyle: CSSProperties = {
    width: compVar('navigation-drawer', 'container-width'),
    maxWidth: '100%',
    height: '100%',
    background: compVar('navigation-drawer', 'modal-container-color'),
    boxShadow: elevationShadow('level2'),
    display: 'flex',
    flexDirection: 'column',
    borderRadius: side === 'end' ? compVar('navigation-drawer', 'container-shape') : undefined,
  };

  const triggerElement = trigger && isValidElement(trigger) ? (trigger as ReactElement) : undefined;

  return (
    <BaseDrawer.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={variant === 'modal'} swipeDirection={swipeDirection}>
      {triggerElement && <BaseDrawer.Trigger render={triggerElement} />}
      <BaseDrawer.Portal>
        {variant === 'modal' && (
          <BaseDrawer.Backdrop
            render={(props) => (
              <ScrimMotion {...props} style={{ ...props.style, position: 'fixed', inset: 0, background: compVar('scrim', 'container-color'), opacity: 0.32 }} />
            )}
          />
        )}
        <BaseDrawer.Viewport
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: side === 'end' ? 'flex-end' : 'flex-start',
            pointerEvents: 'none',
          }}
        >
          <BaseDrawer.Popup className={className} data-testid={testId} style={{ ...popupStyle, pointerEvents: 'auto' }}>
            <OverlayMotion style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                  {headline && <h2 style={{ ...typeStyle('title-large'), flex: 1, margin: 0 }}>{headline}</h2>}
                  {actions}
                  <BaseDrawer.Close aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Icon name="close" />
                  </BaseDrawer.Close>
                </header>
              )}
              <BaseDrawer.Content style={{ flex: 1, overflow: 'auto', padding: compVar('list', 'divider-leading-space') }}>{children}</BaseDrawer.Content>
            </OverlayMotion>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}
