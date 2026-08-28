
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, sysShape, typeStyle } from '../lib/token-utils.js';

export type TabsVariant = 'primary' | 'secondary';
export type TabsLayout = 'fixed' | 'scrollable';

export interface TabItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  panel: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  variant?: TabsVariant;
  layout?: TabsLayout;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  'data-testid'?: string;
}

const VARIANT_PREFIX: Record<TabsVariant, string> = {
  primary: 'primary-navigation-tab',
  secondary: 'secondary-navigation-tab',
};

export function Tabs({
  items,
  variant = 'primary',
  layout = 'fixed',
  value,
  defaultValue,
  onValueChange,
  className,
  'data-testid': testId,
}: TabsProps) {
  const prefix = VARIANT_PREFIX[variant];

  const rootStyle: CSSProperties = {
    width: '100%',
  };

  const listStyle: CSSProperties = {
    display: 'flex',
    height: compVar(prefix, 'container-height'),
    background: compVar(prefix, 'container-color'),
    borderBottom:
      variant === 'secondary'
        ? `${compVar('secondary-navigation-tab', 'divider-height')} solid ${compVar('secondary-navigation-tab', 'divider-color')}`
        : undefined,
    overflowX: layout === 'scrollable' ? 'auto' : 'hidden',
  };

  return (
    <BaseTabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={onValueChange}
      className={className}
      data-testid={testId}
      data-variant={variant}
      data-layout={layout}
      style={rootStyle}
    >
      <BaseTabs.List style={listStyle}>
        {items.map((item) => (
          <TabTrigger key={item.value} item={item} variant={variant} layout={layout} itemCount={items.length} />
        ))}
        {variant === 'primary' && (
          <BaseTabs.Indicator
            render={(props) => (
              <motion.span
                {...props}
                transition={springs.fastSpatial}
                style={{
                  ...props.style,
                  height: compVar('primary-navigation-tab', 'active-indicator-height'),
                  background: compVar('primary-navigation-tab', 'active-indicator-color'),
                  borderRadius: sysShape('corner-full'),
                }}
              />
            )}
          />
        )}
      </BaseTabs.List>
      {items.map((item) => (
        <BaseTabs.Panel key={item.value} value={item.value} style={{ padding: compVar('list', 'divider-leading-space') }}>
          {item.panel}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}

interface TabTriggerProps {
  item: TabItem;
  variant: TabsVariant;
  layout: TabsLayout;
  itemCount: number;
}

function TabTrigger({ item, variant, layout, itemCount }: TabTriggerProps) {
  const prefix = VARIANT_PREFIX[variant];
  const flex = layout === 'fixed' ? 1 / itemCount : undefined;

  return (
    <BaseTabs.Tab
      value={item.value}
      disabled={item.disabled}
      style={{
        flex,
        minWidth: layout === 'scrollable' ? compVar('primary-navigation-tab', 'icon-and-label-text-container-height') : undefined,
        display: 'inline-flex',
        flexDirection: item.icon ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compVar('list', 'item-top-space'),
        height: '100%',
        paddingInline: compVar('list', 'item-between-space'),
        border: 'none',
        background: 'transparent',
        cursor: item.disabled ? 'not-allowed' : 'pointer',
        ...typeStyle('title-small'),
        opacity: item.disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
      }}
    >
      {item.icon && (
        <span
          style={{
            width: compVar(prefix, 'icon-size'),
            height: compVar(prefix, 'icon-size'),
            display: 'inline-flex',
          }}
        >
          {item.icon}
        </span>
      )}
      {item.label}
    </BaseTabs.Tab>
  );
}

export { BaseTabs as TabsPrimitive };
