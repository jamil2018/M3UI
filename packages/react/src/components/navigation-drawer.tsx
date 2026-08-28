
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { PressableShell } from '../lib/pressable-shell.js';
import { Divider } from './divider.js';
import { Badge } from './badge.js';

export type NavigationDrawerVariant = 'standard' | 'modal';

export interface NavigationDrawerItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: number;
  disabled?: boolean;
}

export interface NavigationDrawerSection {
  headline?: ReactNode;
  items: NavigationDrawerItem[];
}

export interface NavigationDrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: NavigationDrawerVariant;
  sections: NavigationDrawerSection[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  header?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function NavigationDrawer({
  open,
  defaultOpen = true,
  onOpenChange,
  variant = 'standard',
  sections,
  value,
  defaultValue,
  onValueChange,
  header,
  className,
  'data-testid': testId,
}: NavigationDrawerProps) {
  const drawerStyle: CSSProperties = {
    width: compVar('navigation-drawer', 'container-width'),
    maxWidth: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background:
      variant === 'modal'
        ? compVar('navigation-drawer', 'modal-container-color')
        : compVar('navigation-drawer', 'standard-container-color'),
    boxShadow: variant === 'modal' ? elevationShadow('level1') : elevationShadow('level0'),
    borderRadius: variant === 'modal' ? compVar('navigation-drawer', 'container-shape') : undefined,
  };

  const content = (
    <div className={className} data-testid={testId} style={drawerStyle}>
      {header && (
        <div style={{ padding: compVar('list', 'divider-leading-space'), ...typeStyle('title-large') }}>{header}</div>
      )}
      <nav aria-label="Navigation drawer" style={{ flex: 1, overflow: 'auto', padding: compVar('list', 'item-top-space') }}>
        {sections.map((section, si) => (
          <div key={si}>
            {section.headline && (
              <div
                style={{
                  paddingInline: compVar('list', 'divider-leading-space'),
                  paddingBlock: compVar('list', 'item-top-space'),
                  ...typeStyle('title-small'),
                  color: compVar('navigation-drawer', 'headline-color'),
                }}
              >
                {section.headline}
              </div>
            )}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {section.items.map((item) => (
                <DrawerNavItem
                  key={item.value}
                  item={item}
                  selected={value != null ? item.value === value : item.value === defaultValue}
                  onSelect={() => onValueChange?.(item.value)}
                />
              ))}
            </ul>
            {si < sections.length - 1 && <Divider variant="inset" style={{ marginBlock: compVar('list', 'item-top-space') }} />}
          </div>
        ))}
      </nav>
    </div>
  );

  if (variant === 'standard') {
    return content;
  }

  return (
    <BaseDrawer.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} swipeDirection="left">
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop style={{ background: compVar('scrim', 'container-color'), opacity: 0.32 }} />
        <BaseDrawer.Popup>
          <motion.div initial={{ x: -32, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -32, opacity: 0 }} transition={springs.defaultSpatial}>
            {content}
          </motion.div>
        </BaseDrawer.Popup>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}

interface DrawerNavItemProps {
  item: NavigationDrawerItem;
  selected: boolean;
  onSelect: () => void;
}

function DrawerNavItem({ item, selected, onSelect }: DrawerNavItemProps) {
  return (
    <li>
      <PressableShell
        shape="round"
        shapeRound={compVar('navigation-drawer', 'active-indicator-shape')}
        shapeSquare={compVar('navigation-drawer', 'active-indicator-shape')}
        pressedShape={compVar('navigation-drawer', 'active-indicator-shape')}
        disabled={item.disabled}
      >
        <button
          type="button"
          disabled={item.disabled}
          aria-current={selected ? 'page' : undefined}
          onClick={onSelect}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: compVar('list', 'item-between-space'),
            width: '100%',
            minHeight: compVar('navigation-drawer', 'active-indicator-height'),
            paddingInline: compVar('list', 'divider-leading-space'),
            border: 'none',
            background: selected ? compVar('navigation-drawer', 'active-indicator-color') : 'transparent',
            borderRadius: compVar('navigation-drawer', 'active-indicator-shape'),
            cursor: item.disabled ? 'not-allowed' : 'pointer',
            color: selected
              ? compVar('navigation-drawer', 'active-label-text-color')
              : compVar('navigation-drawer', 'inactive-label-text-color'),
            ...typeStyle('label-large'),
            opacity: item.disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
          }}
        >
          {item.icon && (
            <span
              style={{
                width: compVar('navigation-drawer', 'icon-size'),
                height: compVar('navigation-drawer', 'icon-size'),
                display: 'inline-flex',
                color: selected
                  ? compVar('navigation-drawer', 'active-icon-color')
                  : compVar('navigation-drawer', 'inactive-icon-color'),
              }}
            >
              {item.icon}
            </span>
          )}
          <span style={{ flex: 1, textAlign: 'start' }}>{item.label}</span>
          {item.badge != null && item.badge > 0 && <Badge count={item.badge} />}
        </button>
      </PressableShell>
    </li>
  );
}

export interface NavigationDrawerTriggerProps {
  children: ReactNode;
}

export function NavigationDrawerTrigger({ children }: NavigationDrawerTriggerProps) {
  return <BaseDrawer.Trigger render={children as React.ReactElement} />;
}
