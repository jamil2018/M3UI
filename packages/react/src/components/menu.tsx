
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { type CSSProperties, type ReactElement, type ReactNode, isValidElement } from 'react';
import { Icon } from '@m3ui/icons';
import { compVar, compElevation, typeStyle } from '../lib/token-utils.js';
import { DialogMotionStyles } from '../lib/dialog-motion.js';
import { MenuMotionPopup } from '../lib/menu-motion.js';
import { Divider } from './divider.js';

const popupStyle: CSSProperties = {
  background: compVar('menu', 'container-color'),
  borderRadius: compVar('menu', 'container-shape'),
  boxShadow: compElevation('menu'),
  ['--menu-shadow-color' as string]: compVar('menu', 'container-shadow-color'),
  paddingBlock: compVar('list', 'item-top-space'),
  minWidth: 180,
  outline: 'none',
  zIndex: 1000,
};

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: compVar('list', 'item-between-space'),
  paddingBlock: compVar('list', 'item-top-space'),
  paddingInline: compVar('list', 'divider-leading-space'),
  ...typeStyle('body-large'),
  color: compVar('list-item', 'label-text-color'),
  cursor: 'pointer',
  borderRadius: compVar('list-item', 'container-shape'),
  outline: 'none',
};

function MenuPopupWrapper({
  children,
  style,
  openingUpwards = false,
  ...props
}: {
  children: ReactNode;
  style?: CSSProperties;
  openingUpwards?: boolean;
  'data-testid'?: string;
}) {
  return (
    <BaseMenu.Portal>
      <DialogMotionStyles />
      <BaseMenu.Positioner sideOffset={4}>
        <BaseMenu.Popup
          render={(popupProps) => (
            <MenuMotionPopup
              {...popupProps}
              {...props}
              openingUpwards={openingUpwards}
              style={{ ...popupStyle, ...style, ...popupProps.style }}
            >
              {children}
            </MenuMotionPopup>
          )}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export interface MenuProps {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  'data-testid'?: string;
}

export function Menu({ trigger, children, open, defaultOpen, onOpenChange, className, 'data-testid': testId }: MenuProps) {
  const triggerElement = isValidElement(trigger) ? (trigger as ReactElement) : <span>{trigger}</span>;

  return (
    <BaseMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <BaseMenu.Trigger render={triggerElement} />
      <MenuPopupWrapper data-testid={testId} style={className ? undefined : undefined}>
        <BaseMenu.Viewport className={className}>{children}</BaseMenu.Viewport>
      </MenuPopupWrapper>
    </BaseMenu.Root>
  );
}

export interface MenuItemProps {
  children: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

export function MenuItem({
  children,
  leadingIcon,
  trailingIcon,
  shortcut,
  disabled = false,
  onClick,
  className,
  'data-testid': testId,
}: MenuItemProps) {
  const iconStyle: CSSProperties = {
    width: compVar('list', 'item-leading-icon-size'),
    height: compVar('list', 'item-leading-icon-size'),
    color: compVar('menu', 'menu-list-item-leading-icon-color'),
    flexShrink: 0,
  };

  return (
    <BaseMenu.Item
      disabled={disabled}
      onClick={onClick}
      className={className}
      data-testid={testId}
      style={itemStyle}
    >
      {leadingIcon && <span style={iconStyle}>{leadingIcon}</span>}
      <span style={{ flex: 1 }}>{children}</span>
      {shortcut && (
        <span style={{ ...typeStyle('label-small'), opacity: 0.6, marginInlineStart: 'auto' }}>{shortcut}</span>
      )}
      {trailingIcon && <span style={iconStyle}>{trailingIcon}</span>}
    </BaseMenu.Item>
  );
}

export function MenuDivider() {
  return (
    <BaseMenu.Group>
      <li aria-hidden style={{ listStyle: 'none', padding: '4px 0' }}>
        <Divider variant="inset" />
      </li>
    </BaseMenu.Group>
  );
}

export interface MenuSubmenuProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function MenuSubmenu({ trigger, children }: MenuSubmenuProps) {
  return (
    <BaseMenu.SubmenuRoot>
      <BaseMenu.SubmenuTrigger style={itemStyle}>{trigger}<Icon name="chevron_right" size={18} /></BaseMenu.SubmenuTrigger>
      <BaseMenu.Portal>
        <DialogMotionStyles />
        <BaseMenu.Positioner side="inline-end" sideOffset={4}>
          <BaseMenu.Popup
            render={(popupProps) => (
              <MenuMotionPopup {...popupProps} style={{ ...popupStyle, ...popupProps.style }}>
                <BaseMenu.Viewport>{children}</BaseMenu.Viewport>
              </MenuMotionPopup>
            )}
          />
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.SubmenuRoot>
  );
}

export interface ContextMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function ContextMenu({ trigger, children, className, 'data-testid': testId }: ContextMenuProps) {
  return (
    <BaseContextMenu.Root>
      <BaseContextMenu.Trigger className={className} data-testid={testId}>
        {trigger}
      </BaseContextMenu.Trigger>
      <BaseContextMenu.Portal>
        <DialogMotionStyles />
        <BaseContextMenu.Positioner sideOffset={4}>
          <BaseContextMenu.Popup
            render={(popupProps) => (
              <MenuMotionPopup {...popupProps} style={{ ...popupStyle, ...popupProps.style }}>
                {children}
              </MenuMotionPopup>
            )}
          />
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    </BaseContextMenu.Root>
  );
}

export function ContextMenuItem(props: MenuItemProps) {
  return (
    <BaseContextMenu.Item
      disabled={props.disabled}
      onClick={props.onClick}
      className={props.className}
      data-testid={props['data-testid']}
      style={itemStyle}
    >
      {props.leadingIcon && <span>{props.leadingIcon}</span>}
      <span style={{ flex: 1 }}>{props.children}</span>
      {props.shortcut && <span style={{ ...typeStyle('label-small'), opacity: 0.6 }}>{props.shortcut}</span>}
    </BaseContextMenu.Item>
  );
}

export interface MenubarProps {
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function Menubar({ children, className, 'data-testid': testId }: MenubarProps) {
  return (
    <BaseMenubar
      className={className}
      data-testid={testId}
      style={{
        display: 'flex',
        gap: compVar('list', 'item-between-space'),
        padding: compVar('list', 'item-top-space'),
        background: compVar('menu', 'container-color'),
        borderRadius: compVar('menu', 'container-shape'),
      }}
    >
      {children}
    </BaseMenubar>
  );
}

export interface MenubarMenuProps {
  label: ReactNode;
  children: ReactNode;
}

export function MenubarMenu({ label, children }: MenubarMenuProps) {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger
        style={{
          ...typeStyle('label-large'),
          padding: compVar('list', 'item-between-space'),
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          borderRadius: compVar('list', 'item-container-expressive-shape'),
        }}
      >
        {label}
      </BaseMenu.Trigger>
      <MenuPopupWrapper>
        <BaseMenu.Viewport>{children}</BaseMenu.Viewport>
      </MenuPopupWrapper>
    </BaseMenu.Root>
  );
}

export { BaseMenu as MenuPrimitive };
