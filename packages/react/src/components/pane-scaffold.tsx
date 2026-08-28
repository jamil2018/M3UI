
import { motion, AnimatePresence } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar } from '../lib/token-utils.js';
import { useM3Message } from '../lib/i18n.js';
import { useWindowSizeClass, sizeClassAtLeast, WindowSizeClassProvider, type WindowSizeClass } from '../lib/window-size-class.js';
import { useM3 } from '../provider/m3-provider.js';
import { IconButton } from './icon-button.js';

export type PaneLayout = 'list-detail' | 'supporting-pane';

export interface PaneScaffoldProps {
  layout?: PaneLayout;
  list: ReactNode;
  detail: ReactNode;
  /** Optional supporting pane content (supporting-pane layout). */
  supporting?: ReactNode;
  /** Controlled detail visibility on compact. */
  showDetail?: boolean;
  defaultShowDetail?: boolean;
  onShowDetailChange?: (show: boolean) => void;
  onBack?: () => void;
  listTitle?: ReactNode;
  detailTitle?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function PaneScaffold({
  layout = 'list-detail',
  list,
  detail,
  supporting,
  showDetail: controlledShowDetail,
  defaultShowDetail = false,
  onShowDetailChange,
  onBack,
  listTitle,
  detailTitle,
  className,
  'data-testid': testId,
}: PaneScaffoldProps) {
  const { direction } = useM3();
  const { sizeClass } = useWindowSizeClass();
  const backLabel = useM3Message('pane.back');
  const isCompact = !sizeClassAtLeast(sizeClass, 'medium');
  const isDualPane = sizeClassAtLeast(sizeClass, 'expanded');

  const [internalShowDetail, setInternalShowDetail] = useState(defaultShowDetail);
  const showDetail = controlledShowDetail ?? internalShowDetail;
  const setShowDetail = (v: boolean) => {
    if (controlledShowDetail === undefined) setInternalShowDetail(v);
    onShowDetailChange?.(v);
  };

  const handleBack = () => {
    setShowDetail(false);
    onBack?.();
  };

  const slideOffset = direction === 'rtl' ? -24 : 24;

  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isDualPane ? 'row' : 'column',
    height: '100%',
    minHeight: 320,
    background: compVar('list', 'item-container-color'),
    borderRadius: compVar('list', 'item-container-expressive-shape'),
    overflow: 'hidden',
  };

  const paneStyle = (flex: number): CSSProperties => ({
    flex,
    minWidth: 0,
    overflow: 'auto',
    borderInlineEnd: isDualPane ? `1px solid ${compVar('divider', 'color')}` : undefined,
  });

  return (
    <div className={className} data-testid={testId} data-layout={layout} data-size-class={sizeClass} style={rootStyle}>
      {(!isCompact || !showDetail) && (
        <div style={paneStyle(isDualPane ? (layout === 'supporting-pane' ? 1 : 1) : 1)} data-testid="pane-list">
          {listTitle && (
            <div style={{ padding: compVar('list', 'divider-leading-space'), fontWeight: 500 }}>{listTitle}</div>
          )}
          {list}
        </div>
      )}

      {isDualPane && layout === 'supporting-pane' && supporting && (
        <div style={paneStyle(1)} data-testid="pane-supporting">
          {supporting}
        </div>
      )}

      <AnimatePresence mode="wait">
        {(isDualPane || showDetail) && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: isDualPane ? 0 : slideOffset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isDualPane ? 0 : slideOffset }}
            transition={springs.defaultSpatial}
            style={paneStyle(isDualPane ? 2 : 1)}
            data-testid="pane-detail"
          >
            {isCompact && (
              <IconButton aria-label={backLabel} icon="←" variant="standard" onClick={handleBack} data-testid="pane-back" />
            )}
            {detailTitle && (
              <div style={{ padding: compVar('list', 'divider-leading-space'), fontWeight: 500 }}>{detailTitle}</div>
            )}
            {detail}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Wrap pane scaffolds with container size class measurement. */
export function PaneScaffoldRoot({
  children,
  defaultSizeClass,
  className,
  style,
}: {
  children: ReactNode;
  defaultSizeClass?: WindowSizeClass;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <WindowSizeClassProvider defaultSizeClass={defaultSizeClass} className={className} style={style}>
      {children}
    </WindowSizeClassProvider>
  );
}

export type { PaneLayout as PaneScaffoldLayout };
