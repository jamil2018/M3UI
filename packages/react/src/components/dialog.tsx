
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { type CSSProperties, type ReactNode, type Ref, type RefObject } from 'react';
import { Icon } from '@m3ui/icons';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import {
  DialogMotionContainer,
  DialogMotionStyles,
  useDialogMotionRefs,
  useDialogWaapi,
} from '../lib/dialog-motion.js';
import { composeRefs } from '../lib/use-popup-waapi.js';
import { OverlayMotion } from '../lib/overlay-motion.js';
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

const dialogInset = compVar('button-medium', 'leading-space');
const dialogActionGap = compVar('list', 'item-between-space');

const dialogPopupStyle: CSSProperties = {
  background: compVar('dialog', 'container-color'),
  borderRadius: compVar('dialog', 'container-shape'),
  boxShadow: elevationShadow('level3'),
  maxWidth: `min(calc(${dialogInset} * 23), calc(100% - calc(${dialogInset} * 2)))`,
  width: `calc(100% - calc(${dialogInset} * 2))`,
};

interface DialogWaapiShellRenderProps {
  scrimRef: RefObject<HTMLDivElement | null>;
  popupRef: Ref<HTMLDivElement>;
  containerRef: RefObject<HTMLDivElement | null>;
  headlineRef: RefObject<HTMLHeadingElement | null>;
  contentRef: RefObject<HTMLParagraphElement | null>;
  actionsRef: RefObject<HTMLDivElement | null>;
  className?: string;
  testId?: string;
  popupStyle: CSSProperties;
}

function DialogWaapiShell({
  children,
  className,
  testId,
  popupStyle = dialogPopupStyle,
}: {
  children: (props: DialogWaapiShellRenderProps) => ReactNode;
  className?: string;
  testId?: string;
  popupStyle?: CSSProperties;
}) {
  const {
    popupRef,
    scrimRef,
    containerRef,
    headlineRef,
    contentRef,
    actionsRef,
    getElements,
  } = useDialogMotionRefs();
  const waapiRef = useDialogWaapi(getElements);

  return (
    <>
      <DialogMotionStyles />
      {children({
        scrimRef,
        popupRef: composeRefs(waapiRef, popupRef),
        containerRef,
        headlineRef,
        contentRef,
        actionsRef,
        className,
        testId,
        popupStyle,
      })}
    </>
  );
}

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
        <DialogWaapiShell className={className} testId={testId}>
          {({ scrimRef, popupRef, containerRef, headlineRef, contentRef, actionsRef, popupStyle: style }) => (
            <>
              <BaseDialog.Backdrop
                render={(props) => (
                  <div
                    {...props}
                    ref={composeRefs(props.ref as Ref<HTMLDivElement> | undefined, scrimRef)}
                    style={{
                      ...props.style,
                      position: 'fixed',
                      inset: 0,
                      background: compVar('scrim', 'container-color'),
                      opacity: 0.32,
                    }}
                    aria-hidden
                  />
                )}
              />
              <BaseDialog.Popup ref={popupRef} className={className} data-testid={testId} style={style}>
                <DialogMotionContainer containerRef={containerRef}>
                  {icon && (
                    <div
                      style={{
                        color: compVar('dialog', 'icon-color'),
                        width: compVar('dialog', 'icon-size'),
                        height: compVar('dialog', 'icon-size'),
                        marginTop: dialogInset,
                        marginInline: dialogInset,
                        marginBottom: compVar('list', 'item-between-space'),
                      }}
                    >
                      {icon}
                    </div>
                  )}
                  <BaseDialog.Title
                    ref={headlineRef}
                    style={{
                      ...typeStyle('headline-small'),
                      color: compVar('dialog', 'headline-color'),
                      margin: 0,
                      padding: icon ? `0 ${dialogInset}` : `${dialogInset} ${dialogInset} 0`,
                    }}
                  >
                    {headline}
                  </BaseDialog.Title>
                  {body && (
                    <BaseDialog.Description
                      ref={contentRef}
                      style={{
                        ...typeStyle('body-medium'),
                        color: compVar('dialog', 'supporting-text-color'),
                        marginTop: icon ? compVar('list', 'item-top-space') : 0,
                        padding: dialogInset,
                      }}
                    >
                      {body}
                    </BaseDialog.Description>
                  )}
                  {actions && (
                    <div
                      ref={actionsRef}
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: dialogActionGap,
                        padding: `${compVar('list', 'divider-leading-space')} ${dialogInset} ${dialogInset}`,
                      }}
                    >
                      {actions}
                    </div>
                  )}
                </DialogMotionContainer>
              </BaseDialog.Popup>
            </>
          )}
        </DialogWaapiShell>
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
        <DialogWaapiShell className={className} testId={testId}>
          {({ scrimRef, popupRef, containerRef, headlineRef, contentRef, actionsRef, popupStyle: style }) => (
            <>
              <BaseAlertDialog.Backdrop
                render={(props) => (
                  <div
                    {...props}
                    ref={composeRefs(props.ref as Ref<HTMLDivElement> | undefined, scrimRef)}
                    style={{
                      ...props.style,
                      position: 'fixed',
                      inset: 0,
                      background: compVar('scrim', 'container-color'),
                      opacity: 0.32,
                    }}
                    aria-hidden
                  />
                )}
              />
              <BaseAlertDialog.Popup ref={popupRef} className={className} data-testid={testId} style={style}>
                <DialogMotionContainer containerRef={containerRef}>
                  {icon && (
                    <div
                      style={{
                        color: compVar('dialog', 'icon-color'),
                        width: compVar('dialog', 'icon-size'),
                        height: compVar('dialog', 'icon-size'),
                        marginTop: dialogInset,
                        marginInline: dialogInset,
                        marginBottom: compVar('list', 'item-between-space'),
                      }}
                    >
                      {icon}
                    </div>
                  )}
                  <BaseAlertDialog.Title
                    ref={headlineRef}
                    style={{
                      ...typeStyle('headline-small'),
                      color: compVar('dialog', 'headline-color'),
                      margin: 0,
                      padding: icon ? `0 ${dialogInset}` : `${dialogInset} ${dialogInset} 0`,
                    }}
                  >
                    {headline}
                  </BaseAlertDialog.Title>
                  {body && (
                    <BaseAlertDialog.Description
                      ref={contentRef}
                      style={{
                        ...typeStyle('body-medium'),
                        color: compVar('dialog', 'supporting-text-color'),
                        marginTop: icon ? compVar('list', 'item-top-space') : 0,
                        padding: dialogInset,
                      }}
                    >
                      {body}
                    </BaseAlertDialog.Description>
                  )}
                  <div
                    ref={actionsRef}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: dialogActionGap,
                      padding: `${compVar('list', 'divider-leading-space')} ${dialogInset} ${dialogInset}`,
                    }}
                  >
                    <BaseAlertDialog.Close render={<Button variant="text" onClick={onCancel}>{cancelLabel}</Button>} />
                    <BaseAlertDialog.Close render={<Button variant="text" onClick={onConfirm}>{confirmLabel}</Button>} />
                  </div>
                </DialogMotionContainer>
              </BaseAlertDialog.Popup>
            </>
          )}
        </DialogWaapiShell>
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
    padding: dialogInset,
  };

  return (
    <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <BaseDialog.Trigger render={trigger as React.ReactElement} />
      <BaseDialog.Portal>
        <BaseDialog.Popup className={className} data-testid={testId}>
          <OverlayMotion fullScreen style={fullStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: dialogActionGap }}>
              <BaseDialog.Close aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Icon name="close" />
              </BaseDialog.Close>
              <BaseDialog.Title style={{ ...typeStyle('headline-small'), color: compVar('dialog', 'headline-color'), flex: 1 }}>
                {headline}
              </BaseDialog.Title>
              {actions}
            </div>
            {body && (
              <div
                style={{
                  flex: 1,
                  overflow: 'auto',
                  marginTop: compVar('list', 'divider-leading-space'),
                  color: compVar('dialog', 'supporting-text-color'),
                  ...typeStyle('body-medium'),
                }}
              >
                {body}
              </div>
            )}
          </OverlayMotion>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export function DialogAction({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <Button variant="text" onClick={onClick}>
      {children}
    </Button>
  );
}
