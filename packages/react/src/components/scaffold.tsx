
import { type CSSProperties, type ReactNode } from 'react';
import { compVar } from '../lib/token-utils.js';
import { InsetProvider, M3_INSET_BOTTOM, M3_INSET_TOP, M3_FAB_OFFSET, useRegisterInset } from '../lib/inset-context.js';

export interface ScaffoldProps {
  children: ReactNode;
  topAppBar?: ReactNode;
  bottomAppBar?: ReactNode;
  navigationBar?: ReactNode;
  navigationRail?: ReactNode;
  navigationDrawer?: ReactNode;
  fab?: ReactNode;
  snackbar?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function Scaffold({
  children,
  topAppBar,
  bottomAppBar,
  navigationBar,
  navigationRail,
  navigationDrawer,
  fab,
  snackbar,
  className,
  'data-testid': testId,
}: ScaffoldProps) {
  const mainStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    paddingTop: `var(${M3_INSET_TOP}, 0px)`,
    paddingBottom: `var(${M3_INSET_BOTTOM}, 0px)`,
    overflow: 'auto',
  };

  const fabStyle: CSSProperties = {
    position: 'fixed',
    bottom: `calc(var(${M3_INSET_BOTTOM}, 0px) + var(${M3_FAB_OFFSET}, 0px))`,
    insetInlineEnd: compVar('list', 'divider-leading-space'),
    zIndex: 95,
  };

  return (
    <InsetProvider className={className} data-testid={testId} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {topAppBar}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {navigationDrawer}
        {navigationRail}
        <main style={mainStyle}>{children}</main>
      </div>
      {bottomAppBar}
      {navigationBar}
      {fab && <div style={fabStyle}><FabAnchor>{fab}</FabAnchor></div>}
      {snackbar}
    </InsetProvider>
  );
}

export { M3_INSET_TOP, M3_INSET_BOTTOM, M3_FAB_OFFSET } from '../lib/inset-context.js';
export { SNACKBAR_OFFSET_VAR } from './snackbar.js';
export function FabAnchor({ children, offset }: { children: ReactNode; offset?: string }) {
  useRegisterInset('fab', offset ?? compVar('fab-medium', 'container-height'));
  return <>{children}</>;
}
