import { M3PortalScope } from '../provider/m3-provider.js';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { Icon } from '@m3ui/icons';
import { useId, useState, type ReactNode } from 'react';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { PressableShell } from '../lib/pressable-shell.js';
import { IconButton } from './icon-button.js';
import { Fab } from './fab.js';

export type NavigationRailMode = 'collapsed' | 'expanded' | 'modal';

export interface NavigationRailDestination {
  value: string;
  label: ReactNode;
  icon: ReactNode;
  badge?: number;
}

export interface NavigationRailProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  destinations: NavigationRailDestination[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  mode?: NavigationRailMode;
  fab?: ReactNode;
  menuButton?: boolean;
  onMenuClick?: () => void;
  header?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function NavigationRail({
  open,
  defaultOpen = true,
  onOpenChange,
  destinations,
  value: controlled,
  defaultValue,
  onValueChange,
  mode = 'collapsed',
  fab,
  menuButton = false,
  onMenuClick,
  header,
  className,
  'data-testid': testId,
}: NavigationRailProps) {
  const railId = useId();
  const [internal, setInternal] = useState(defaultValue ?? destinations[0]?.value ?? '');
  const active = controlled ?? internal;
  const expanded = mode !== 'collapsed';
  const modal = mode === 'modal';

  const select = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onValueChange?.(v);
  };

  const width = expanded
    ? compVar('navigation-rail-expanded', 'container-width-minimum')
    : compVar('navigation-rail-collapsed', 'container-width');

  const railContent = (
    <aside
      className={className}
      data-testid={testId}
      data-mode={mode}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: expanded ? 'stretch' : 'center',
        width,
        minHeight: '100%',
        paddingTop: compVar('navigation-rail-collapsed', 'top-space'),
        background: modal
          ? compVar('navigation-rail-expanded', 'modal-container-color')
          : compVar('navigation-rail-collapsed', 'container-color'),
        boxShadow: modal ? elevationShadow('level2') : elevationShadow('level0'),
        transition: `width var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard)`,
      }}
      aria-label="Navigation rail"
    >
      {modal && (
        <BaseDrawer.Close
          render={<IconButton aria-label="Close navigation" icon={<Icon name="close" />} />}
        />
      )}
      {(menuButton || header) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: compVar('list', 'item-between-space'),
            paddingInline: compVar('navigation-rail-horizontal-item', 'leading-space'),
            marginBottom: compVar('navigation-rail-baseline-item', 'header-space-minimum'),
          }}
        >
          {menuButton && (
            <IconButton
              aria-label="Open menu"
              icon={<Icon name="menu" />}
              variant="standard"
              size="md"
              onClick={onMenuClick}
            />
          )}
          {expanded && header}
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: compVar('navigation-rail-collapsed', 'item-vertical-space'),
          width: '100%',
        }}
      >
        {destinations.map((dest) => (
          <RailItem
            key={dest.value}
            destination={dest}
            active={dest.value === active}
            expanded={expanded}
            layoutId={`${railId}-indicator`}
            onSelect={() => {
              select(dest.value);
            }}
          />
        ))}
      </div>

      {fab && (
        <div
          style={{
            padding: compVar('list', 'item-top-space'),
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {fab}
        </div>
      )}
    </aside>
  );

  if (modal) {
    return (
      <BaseDrawer.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <BaseDrawer.Portal>
          <M3PortalScope>
            <BaseDrawer.Backdrop
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 'var(--m3-overlay-layer, 1100)',
                background: compVar('scrim', 'container-color'),
                opacity: 0.32,
              }}
            />
            <BaseDrawer.Popup
              aria-label="Navigation"
              style={{
                position: 'fixed',
                insetBlock: 0,
                insetInlineStart: 0,
                zIndex: 'calc(var(--m3-overlay-layer, 1100) + 1)',
                maxWidth: 'calc(100vw - 24px)',
                overflow: 'auto',
              }}
            >
              <motion.div
                style={{ height: '100%' }}
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={springs.defaultSpatial}
              >
                {railContent}
              </motion.div>
            </BaseDrawer.Popup>
          </M3PortalScope>
        </BaseDrawer.Portal>
      </BaseDrawer.Root>
    );
  }

  return (
    <motion.div animate={{ width }} transition={springs.defaultSpatial}>
      {railContent}
    </motion.div>
  );
}

interface RailItemProps {
  destination: NavigationRailDestination;
  active: boolean;
  expanded: boolean;
  layoutId: string;
  onSelect: () => void;
}

function RailItem({ destination, active, expanded, layoutId, onSelect }: RailItemProps) {
  const indicatorWidth = expanded
    ? 'auto'
    : compVar('navigation-rail-vertical-item', 'active-indicator-width');

  return (
    <PressableShell
      shape="round"
      shapeRound={compVar('navigation-rail-baseline-item', 'active-indicator-shape')}
      shapeSquare={compVar('navigation-rail-baseline-item', 'active-indicator-shape')}
      pressedShape={compVar('navigation-rail-baseline-item', 'active-indicator-shape')}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? 'page' : undefined}
        style={{
          display: 'flex',
          flexDirection: expanded ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: expanded ? 'flex-start' : 'center',
          gap: expanded
            ? compVar('navigation-rail-horizontal-item', 'icon-label-space')
            : compVar('navigation-rail-vertical-item', 'icon-label-space'),
          width: expanded ? '100%' : indicatorWidth,
          minHeight: compVar('navigation-rail-baseline-item', 'container-height'),
          marginInline: expanded ? 0 : 'auto',
          paddingInline: expanded ? compVar('navigation-rail-horizontal-item', 'leading-space') : 0,
          border: 'none',
          background: 'transparent',
          borderRadius: compVar('navigation-rail-baseline-item', 'active-indicator-shape'),
          cursor: 'pointer',
          position: 'relative',
          color: active
            ? compVar('navigation-rail-color', 'item-active-label-text')
            : compVar('navigation-rail-color', 'item-inactive-label-text'),
        }}
      >
        {expanded && active && (
          <motion.span
            layoutId={layoutId}
            transition={springs.fastSpatial}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              borderRadius: compVar('navigation-rail-baseline-item', 'active-indicator-shape'),
              background: compVar('navigation-rail-color', 'item-active-indicator'),
              zIndex: 0,
            }}
            aria-hidden
          />
        )}
        <span
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: expanded
              ? compVar('navigation-rail-baseline-item', 'icon-size')
              : compVar('navigation-rail-vertical-item', 'active-indicator-width'),
            height: expanded
              ? compVar('navigation-rail-baseline-item', 'icon-size')
              : compVar('navigation-rail-vertical-item', 'active-indicator-height'),
            borderRadius: compVar('navigation-rail-baseline-item', 'active-indicator-shape'),
          }}
        >
          {!expanded && active && (
            <motion.span
              layoutId={layoutId}
              transition={springs.fastSpatial}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: compVar('navigation-rail-baseline-item', 'active-indicator-shape'),
                background: compVar('navigation-rail-color', 'item-active-indicator'),
                zIndex: 0,
              }}
              aria-hidden
            />
          )}
          <span
            style={{
              width: compVar('navigation-rail-baseline-item', 'icon-size'),
              height: compVar('navigation-rail-baseline-item', 'icon-size'),
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              color: active
                ? compVar('navigation-rail-color', 'item-active-icon')
                : compVar('navigation-rail-color', 'item-inactive-icon'),
            }}
          >
            {destination.icon}
          </span>
        </span>
        {expanded && (
          <span style={{ ...typeStyle('label-large'), flex: 1, textAlign: 'start', zIndex: 1 }}>
            {destination.label}
          </span>
        )}
        {!expanded && (
          <span
            style={{
              ...typeStyle('label-medium'),
              maxWidth: indicatorWidth,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              zIndex: 1,
            }}
          >
            {destination.label}
          </span>
        )}
      </button>
    </PressableShell>
  );
}

export { Fab as NavigationRailFabSlot };
