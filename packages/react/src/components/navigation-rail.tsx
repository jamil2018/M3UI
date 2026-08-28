
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode } from 'react';
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
  const [internal, setInternal] = useState(defaultValue ?? destinations[0]?.value ?? '');
  const active = controlled ?? internal;
  const expanded = mode === 'expanded';
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
            <IconButton aria-label="Open menu" icon="☰" variant="standard" size="md" onClick={onMenuClick} />
          )}
          {expanded && header}
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: compVar('navigation-rail-collapsed', 'item-vertical-space'), width: '100%' }}>
        {destinations.map((dest) => (
          <RailItem key={dest.value} destination={dest} active={dest.value === active} expanded={expanded} onSelect={() => select(dest.value)} />
        ))}
      </div>

      {fab && (
        <div style={{ padding: compVar('list', 'item-top-space'), display: 'flex', justifyContent: 'center' }}>
          {fab}
        </div>
      )}
    </aside>
  );

  if (modal) {
    return (
      <BaseDrawer.Root defaultOpen>
        <BaseDrawer.Portal>
          <BaseDrawer.Backdrop style={{ background: compVar('scrim', 'container-color'), opacity: 0.32 }} />
          <BaseDrawer.Popup swipeDirection="left">
            <motion.div initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={springs.defaultSpatial}>
              {railContent}
            </motion.div>
          </BaseDrawer.Popup>
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
  onSelect: () => void;
}

function RailItem({ destination, active, expanded, onSelect }: RailItemProps) {
  const indicatorHeight = expanded
    ? compVar('navigation-rail-horizontal-item', 'active-indicator-height')
    : compVar('navigation-rail-vertical-item', 'active-indicator-height');
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
          background: active ? compVar('navigation-rail-color', 'item-active-indicator') : 'transparent',
          borderRadius: compVar('navigation-rail-baseline-item', 'active-indicator-shape'),
          cursor: 'pointer',
          color: active
            ? compVar('navigation-rail-color', 'item-active-label-text')
            : compVar('navigation-rail-color', 'item-inactive-label-text'),
        }}
      >
        <span
          style={{
            width: compVar('navigation-rail-baseline-item', 'icon-size'),
            height: compVar('navigation-rail-baseline-item', 'icon-size'),
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: active
              ? compVar('navigation-rail-color', 'item-active-icon')
              : compVar('navigation-rail-color', 'item-inactive-icon'),
          }}
        >
          {destination.icon}
        </span>
        {expanded && <span style={{ ...typeStyle('label-large'), flex: 1, textAlign: 'start' }}>{destination.label}</span>}
        {!expanded && (
          <span style={{ ...typeStyle('label-medium'), maxWidth: indicatorWidth, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {destination.label}
          </span>
        )}
      </button>
    </PressableShell>
  );
}

export { Fab as NavigationRailFabSlot };
