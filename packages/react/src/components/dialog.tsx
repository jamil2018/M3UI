
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { OverlayMotion, ScrimMotion } from '../lib/overlay-motion.js';
import { Button } from './button.js';

export interface DialogProps {
  trigger: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  icon?: ReactNode;
  headline: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

const dialogPopupStyle: CSSProperties = {
  background: compVar('dialog', 'container-color'),
  borderRadius: compVar('dialog', 'container-shape'),
  boxShadow: elevationShadow('level3'),
  padding: compVar('list', 'divider-leading-space'),
  maxWidth: 560,
  width: 'calc(100% - 48px)',
};

export function Dialog({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  icon,
  headline,
  body,
  actions,
  className,
  'data-testid': testId,
}: DialogProps) {
  return (
    <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <BaseDialog.Trigger render={trigger as React.ReactElement} />
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          render={(props) => (
            <ScrimMotion
              {...props}
              style={{
                ...props.style,
                position: 'fixed',
                inset: 0,
                background: compVar('scrim', 'container-color'),
                opacity: 0.32,
              }}
            />
          )}
        />
        <BaseDialog.Popup className={className} data-testid={testId}>
          <OverlayMotion style={dialogPopupStyle}>
            {icon && (
              <div
                style={{
                  color: compVar('dialog', 'icon-color'),
                  width: compVar('dialog', 'icon-size'),
                  marginBottom: compVar('list', 'item-top-space'),
                }}
              >
                {icon}
              </div>
            )}
            <BaseDialog.Title style={{ ...typeStyle('headline-small'), color: compVar('dialog', 'headline-color'), margin: 0 }}>
              {headline}
            </BaseDialog.Title>
            {body && (
              <BaseDialog.Description style={{ ...typeStyle('body-medium'), color: compVar('dialog', 'supporting-text-color'), marginTop: compVar('list', 'item-top-space') }}>
                {body}
              </BaseDialog.Description>
            )}
            {actions && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: compVar('list', 'item-between-space'), marginTop: compVar('list', 'divider-leading-space') }}>
                {actions}
              </div>
            )}
          </OverlayMotion>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export interface AlertDialogProps {
  trigger: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  icon?: ReactNode;
  headline: ReactNode;
  body?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
  'data-testid'?: string;
}

export function AlertDialog({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  icon,
  headline,
  body,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  className,
  'data-testid': testId,
}: AlertDialogProps) {
  return (
    <BaseAlertDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <BaseAlertDialog.Trigger render={trigger as React.ReactElement} />
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop style={{ position: 'fixed', inset: 0, background: compVar('scrim', 'container-color'), opacity: 0.32 }} />
        <BaseAlertDialog.Popup className={className} data-testid={testId}>
          <OverlayMotion style={dialogPopupStyle}>
            {icon && <div style={{ color: compVar('dialog', 'icon-color'), marginBottom: compVar('list', 'item-top-space') }}>{icon}</div>}
            <BaseAlertDialog.Title style={{ ...typeStyle('headline-small'), color: compVar('dialog', 'headline-color') }}>{headline}</BaseAlertDialog.Title>
            {body && (
              <BaseAlertDialog.Description style={{ ...typeStyle('body-medium'), color: compVar('dialog', 'supporting-text-color'), marginTop: compVar('list', 'item-top-space') }}>
                {body}
              </BaseAlertDialog.Description>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: compVar('list', 'item-between-space'), marginTop: compVar('list', 'divider-leading-space') }}>
              <BaseAlertDialog.Close render={<Button variant="text" onClick={onCancel}>{cancelLabel}</Button>} />
              <BaseAlertDialog.Close render={<Button variant="text" onClick={onConfirm}>{confirmLabel}</Button>} />
            </div>
          </OverlayMotion>
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}

export interface FullScreenDialogProps {
  trigger: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  headline: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function FullScreenDialog({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  headline,
  body,
  actions,
  className,
  'data-testid': testId,
}: FullScreenDialogProps) {
  const fullStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: compVar('dialog', 'container-color'),
    display: 'flex',
    flexDirection: 'column',
    padding: compVar('list', 'divider-leading-space'),
  };

  return (
    <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <BaseDialog.Trigger render={trigger as React.ReactElement} />
      <BaseDialog.Portal>
        <BaseDialog.Popup className={className} data-testid={testId}>
          <OverlayMotion fullScreen style={fullStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: compVar('list', 'item-between-space') }}>
              <BaseDialog.Close aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕
              </BaseDialog.Close>
              <BaseDialog.Title style={{ ...typeStyle('headline-small'), flex: 1 }}>{headline}</BaseDialog.Title>
              {actions}
            </div>
            {body && <div style={{ flex: 1, overflow: 'auto', marginTop: compVar('list', 'divider-leading-space'), ...typeStyle('body-medium') }}>{body}</div>}
          </OverlayMotion>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export function DialogAction({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <Button variant="text" onClick={onClick} style={{ color: compVar('dialog', 'action-label-text-color'), ...typeStyle('label-large') }}>
      {children}
    </Button>
  );
}
