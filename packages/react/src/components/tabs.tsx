import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';
import { FocusRing } from '../primitives/focus-ring.js';
import { Ripple } from '../primitives/ripple.js';

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

function tabLabelColor(prefix: string, selected: boolean): string {
  return selected
    ? compVar(prefix, 'active-label-text-color')
    : compVar(prefix, 'inactive-label-text-color');
}

function tabIconColor(prefix: string, selected: boolean): string {
  return selected ? compVar(prefix, 'active-icon-color') : compVar(prefix, 'inactive-icon-color');
}

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
  const [internalValue, setInternalValue] = useState(defaultValue ?? items[0]?.value);
  const selectedValue = value ?? internalValue;

  const handleValueChange = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const rootStyle: CSSProperties = {
    width: '100%',
  };

  const listStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    height: compVar(prefix, 'container-height'),
    background: compVar(prefix, 'container-color'),
    borderBottom: `${compVar(prefix, 'divider-height')} solid ${compVar(prefix, 'divider-color')}`,
    overflowX: layout === 'scrollable' ? 'auto' : 'hidden',
  };

  const indicatorBaseStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left:
      variant === 'primary'
        ? 'calc(var(--active-tab-left) + var(--active-tab-width) * 0.2)'
        : 'var(--active-tab-left)',
    width:
      variant === 'primary'
        ? 'max(24px, calc(var(--active-tab-width) * 0.6))'
        : 'var(--active-tab-width)',
    pointerEvents: 'none',
  };

  const indicatorStyle: CSSProperties =
    variant === 'primary'
      ? {
          ...indicatorBaseStyle,
          height: compVar('primary-navigation-tab', 'active-indicator-height'),
          background: compVar('primary-navigation-tab', 'active-indicator-color'),
          borderRadius: `${compVar('primary-navigation-tab', 'active-indicator-shape')} ${compVar('primary-navigation-tab', 'active-indicator-shape')} 0px 0px`,
        }
      : {
          ...indicatorBaseStyle,
          height: compVar('secondary-navigation-tab', 'active-indicator-height'),
          background: compVar('secondary-navigation-tab', 'active-indicator-color'),
          borderRadius: 0,
        };

  return (
    <BaseTabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={handleValueChange}
      className={className}
      data-testid={testId}
      data-variant={variant}
      data-layout={layout}
      style={rootStyle}
    >
      <BaseTabs.List style={listStyle}>
        {items.map((item) => (
          <TabTrigger
            key={item.value}
            item={item}
            variant={variant}
            layout={layout}
            itemCount={items.length}
            selected={item.value === selectedValue}
          />
        ))}
        <BaseTabs.Indicator
          render={(props) => {
            const measured =
              parseFloat(String(props.style?.['--active-tab-width' as keyof CSSProperties] ?? 0)) >
              0;
            return (
              <motion.span
                key={measured ? 'measured' : 'unmeasured'}
                initial={false}
                {...(props as object)}
                layout
                transition={springs.fastSpatial}
                style={{
                  ...props.style,
                  ...indicatorStyle,
                }}
              />
            );
          }}
        />
      </BaseTabs.List>
      {items.map((item) => (
        <BaseTabs.Panel
          key={item.value}
          value={item.value}
          style={{ padding: compVar('list', 'divider-leading-space') }}
        >
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
  selected: boolean;
}

function TabTrigger({ item, variant, layout, itemCount, selected }: TabTriggerProps) {
  const prefix = VARIANT_PREFIX[variant];
  const flex = layout === 'fixed' ? 1 / itemCount : undefined;
  const stacked = Boolean(item.icon);
  const labelColor = tabLabelColor(prefix, selected);

  return (
    <BaseTabs.Tab
      value={item.value}
      disabled={item.disabled}
      style={{
        flex,
        minWidth:
          layout === 'scrollable'
            ? compVar('primary-navigation-tab', 'icon-and-label-text-container-height')
            : undefined,
        display: 'inline-flex',
        height: stacked
          ? compVar('primary-navigation-tab', 'icon-and-label-text-container-height')
          : '100%',
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: item.disabled ? 'not-allowed' : 'pointer',
        opacity: item.disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
        color: labelColor,
      }}
    >
      <FocusRing style={{ width: '100%', height: '100%', display: 'inline-flex' }}>
        <Ripple
          color={labelColor}
          disabled={item.disabled}
          style={{
            display: 'inline-flex',
            flexDirection: stacked ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: compVar('list', 'item-top-space'),
            width: '100%',
            height: '100%',
            paddingInline: compVar('list', 'item-between-space'),
            ...typeStyle('title-small'),
            color: labelColor,
          }}
        >
          {item.icon && (
            <span
              style={{
                width: compVar(prefix, 'icon-size'),
                height: compVar(prefix, 'icon-size'),
                display: 'inline-flex',
                color: tabIconColor(prefix, selected),
              }}
            >
              {item.icon}
            </span>
          )}
          {item.label}
        </Ripple>
      </FocusRing>
    </BaseTabs.Tab>
  );
}

export { BaseTabs as TabsPrimitive };
