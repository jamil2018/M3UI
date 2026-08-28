
import { Toast as BaseToast } from '@base-ui/react/toast';
import { motion } from 'motion/react';
import { presets } from '@m3ui/motion';
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';

/** Offset for Phase 3 FAB / bottom app bar — set via CSS on ancestor */
export const SNACKBAR_OFFSET_VAR = '--m3ui-snackbar-offset-bottom';

const snackbarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: compVar('list', 'item-between-space'),
  minWidth: 280,
  maxWidth: 560,
  paddingBlock: compVar('list', 'item-bottom-space'),
  paddingInline: compVar('list', 'divider-leading-space'),
  background: compVar('snackbar', 'container-color'),
  color: compVar('snackbar', 'supporting-text-color'),
  borderRadius: compVar('snackbar', 'container-shape'),
  boxShadow: `0 var(--md-sys-elevation-level3) calc(var(--md-sys-elevation-level3) * 2) rgba(0, 0, 0, var(--md-sys-elevation-level3-shadow-opacity))`,
  ...typeStyle('body-medium'),
};

const actionStyle: CSSProperties = {
  ...typeStyle('label-large'),
  color: compVar('snackbar', 'action-label-text-color'),
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: compVar('list', 'item-top-space'),
  marginInlineStart: 'auto',
  flexShrink: 0,
};

function SnackbarToasts() {
  const { toasts } = BaseToast.useToastManager();

  return (
    <>
      {toasts.map((toast) => (
        <BaseToast.Root key={toast.id} toast={toast} style={{ pointerEvents: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={presets.spatial.enter}
            style={snackbarStyle}
          >
            <BaseToast.Title style={{ flex: 1 }} />
            {toast.actionProps && <BaseToast.Action style={actionStyle} {...toast.actionProps} />}
            <BaseToast.Close
              aria-label="Dismiss"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: compVar('snackbar', 'icon-color'),
                padding: 4,
                marginInlineStart: toast.actionProps ? 0 : 'auto',
              }}
            >
              ✕
            </BaseToast.Close>
          </motion.div>
        </BaseToast.Root>
      ))}
    </>
  );
}

export interface SnackbarProviderProps {
  children: ReactNode;
  limit?: number;
}

export function SnackbarProvider({ children, limit = 3 }: SnackbarProviderProps) {
  return (
    <BaseToast.Provider limit={limit}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport
          style={{
            position: 'fixed',
            bottom: `calc(16px + var(${SNACKBAR_OFFSET_VAR}, 0px))`,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: 8,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <SnackbarToasts />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

export interface SnackbarOptions {
  message: ReactNode;
  action?: { label: string; onClick: () => void };
  timeout?: number;
}

export function useSnackbar() {
  const manager = BaseToast.useToastManager();

  return {
    ...manager,
    show: (options: SnackbarOptions) =>
      manager.add({
        title: options.message,
        timeout: options.timeout ?? 5000,
        actionProps: options.action
          ? { onClick: options.action.onClick, children: options.action.label }
          : undefined,
      }),
  };
}

/** Convenience wrapper combining provider and toast rendering */
export function Snackbar({ children }: { children: ReactNode }) {
  return <SnackbarProvider>{children}</SnackbarProvider>;
}

export { BaseToast as SnackbarPrimitive };
