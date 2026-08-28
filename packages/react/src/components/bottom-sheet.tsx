
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { type CSSProperties, type ReactElement, type ReactNode, isValidElement } from 'react';
import { compVar, elevationShadow, sysShape } from '../lib/token-utils.js';
import { OverlayMotion, ScrimMotion } from '../lib/overlay-motion.js';

export type BottomSheetVariant = 'standard' | 'modal';

export interface BottomSheetProps {
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: BottomSheetVariant;
  snapPoints?: Array<number | string>;
  defaultSnapPoint?: number | string;
  children: ReactNode;
  showHandle?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function BottomSheet({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  variant = 'modal',
  snapPoints,
  defaultSnapPoint,
  children,
  showHandle = true,
  className,
  'data-testid': testId,
}: BottomSheetProps) {
  const popupStyle: CSSProperties = {
    background: compVar('sheet-bottom', 'docked-container-color'),
    borderStartStartRadius: compVar('sheet-bottom', 'docked-container-shape'),
    borderStartEndRadius: compVar('sheet-bottom', 'docked-container-shape'),
    boxShadow: elevationShadow('level1'),
    maxHeight: '95vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const handleStyle: CSSProperties = {
    width: compVar('sheet-bottom', 'docked-drag-handle-width'),
    height: compVar('sheet-bottom', 'docked-drag-handle-height'),
    borderRadius: sysShape('corner-full'),
    background: compVar('sheet-bottom', 'docked-drag-handle-color'),
    margin: `${compVar('list', 'item-top-space')} auto`,
    flexShrink: 0,
  };

  const triggerElement = trigger && isValidElement(trigger) ? (trigger as ReactElement) : undefined;

  return (
    <BaseDrawer.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={variant === 'modal'}
      snapPoints={snapPoints}
      defaultSnapPoint={defaultSnapPoint}
      swipeDirection="down"
    >
      {triggerElement && <BaseDrawer.Trigger render={triggerElement} />}
      <BaseDrawer.Portal>
        {variant === 'modal' && (
          <BaseDrawer.Backdrop
            render={(props) => (
              <ScrimMotion {...props} style={{ ...props.style, position: 'fixed', inset: 0, background: compVar('scrim', 'container-color'), opacity: 0.32 }} />
            )}
          />
        )}
        <BaseDrawer.Viewport style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'flex-end', pointerEvents: 'none' }}>
          <BaseDrawer.Popup className={className} data-testid={testId} style={{ ...popupStyle, pointerEvents: 'auto', width: '100%' }}>
            <OverlayMotion style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              {showHandle && <div role="presentation" style={handleStyle} aria-hidden />}
              <BaseDrawer.Content style={{ flex: 1, overflow: 'auto', padding: compVar('list', 'divider-leading-space') }}>{children}</BaseDrawer.Content>
            </OverlayMotion>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}
