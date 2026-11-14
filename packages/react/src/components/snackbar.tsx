import { M3PortalScope } from '../provider/m3-provider.js';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { AnimatePresence, motion } from 'motion/react';
import { presets } from '@m3ui/motion';
import { Icon } from '@m3ui/icons';
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { Ripple } from '../primitives/ripple.js';

/** Offset for Phase 3 FAB / bottom app bar — set via CSS on ancestor */
export const SNACKBAR_OFFSET_VAR = '--m3ui-snackbar-offset-bottom';

const snackbarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: compVar('list', 'item-between-space'),
  minWidth: 'min(344px, calc(100vw - 32px))',
  maxWidth: 'min(672px, calc(100vw - 32px))',
  boxSizing: 'border-box',
  overflowWrap: 'anywhere',
  minHeight: compVar('snackbar', 'single-line-container-height'),
  paddingBlock: compVar('list', 'item-bottom-space'),
  paddingInline: compVar('list', 'divider-leading-space'),
  background: compVar('snackbar', 'container-color'),
  color: compVar('snackbar', 'supporting-text-color'),
  borderRadius: compVar('snackbar', 'container-shape'),
  boxShadow: elevationShadow('level3'),
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

const closeStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: compVar('snackbar', 'icon-color'),
  padding: compVar('list', 'item-top-space'),
  display: 'inline-flex',
  width: compVar('snackbar', 'icon-size'),
  height: compVar('snackbar', 'icon-size'),
  alignItems: 'center',
  justifyContent: 'center',
};

function SnackbarToasts() {
  const { toasts } = BaseToast.useToastManager();

  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <BaseToast.Root key={toast.id} toast={toast} style={{ pointerEvents: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95, transition: { ...presets.spatial.exit, opacity: presets.effects.exit } }}
            transition={{ ...presets.spatial.enter, opacity: presets.effects.enter }}
            style={snackbarStyle}
          >
            <BaseToast.Title style={{ flex: 1 }} />
            {toast.actionProps && (
              <Ripple style={{ marginInlineStart: 'auto', flexShrink: 0, borderRadius: compVar('snackbar', 'container-shape') }}>
                <BaseToast.Action style={actionStyle} {...toast.actionProps} />
              </Ripple>
            )}
            <Ripple
              style={{
                marginInlineStart: toast.actionProps ? 0 : 'auto',
                borderRadius: '50%',
                display: 'inline-flex',
              }}
            >
              <BaseToast.Close aria-label="Dismiss" style={closeStyle}>
                <Icon name="close" />
              </BaseToast.Close>
            </Ripple>
          </motion.div>
        </BaseToast.Root>
      ))}
    </AnimatePresence>
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
      <BaseToast.Portal><M3PortalScope>
        <BaseToast.Viewport
          style={{
            position: 'fixed',
            bottom: `calc(${compVar('floating-toolbar', 'container-external-padding')} + var(${SNACKBAR_OFFSET_VAR}, 0px))`,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: compVar('fab-menu-baseline', 'list-item-between-space'),
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <SnackbarToasts />
        </BaseToast.Viewport>
      </M3PortalScope></BaseToast.Portal>
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
