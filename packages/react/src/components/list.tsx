import { SurfaceAction } from '../lib/surface-action.js';
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, compElevation, typeStyle } from '../lib/token-utils.js';
import { FocusRing } from '../primitives/focus-ring.js';
import { Ripple } from '../primitives/ripple.js';
import { focusRingAttachmentStyle } from '../lib/pressable-shell.js';
import { Divider } from './divider.js';

export type ListItemLines = 1 | 2 | 3;

export interface ListProps {
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function List({ children, className, 'data-testid': testId }: ListProps) {
  return (
    <ul
      className={className}
      data-testid={testId}
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        width: '100%',
        minWidth: 240,
        borderRadius: compVar('list', 'container-shape'),
        background: compVar('list', 'item-container-color'),
      }}
    >
      {children}
    </ul>
  );
}

export interface ListItemProps {
  children?: ReactNode;
  headline: ReactNode;
  supportingText?: ReactNode;
  overline?: ReactNode;
  lines?: ListItemLines;
  leading?: ReactNode;
  trailing?: ReactNode;
  selected?: boolean;
  interactive?: boolean;
  divider?: boolean;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

export function ListItem({
  headline,
  supportingText,
  overline,
  lines = 1,
  leading,
  trailing,
  selected = false,
  interactive = false,
  divider = false,
  onClick,
  className,
  'data-testid': testId,
}: ListItemProps) {
  const itemShape = selected
    ? compVar('list', 'item-selected-container-shape')
    : compVar('list', 'item-container-expressive-shape');

  const itemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: compVar('list', 'item-between-space'),
    paddingBlockStart: compVar('list', 'item-top-space'),
    paddingBlockEnd: compVar('list', 'item-bottom-space'),
    paddingInlineStart: compVar('list-item', 'leading-space'),
    paddingInlineEnd: compVar('list-item', 'trailing-space'),
    borderRadius: itemShape,
    background: selected
      ? compVar('list', 'item-selected-container-color')
      : compVar('list', 'item-container-color'),
    boxShadow: compElevation('list-item'),
    minHeight:
      lines === 3
        ? compVar('list-item', 'three-line-container-height')
        : lines === 2
          ? compVar('list-item', 'two-line-container-height')
          : compVar('list-item', 'one-line-container-height'),
    cursor: interactive ? 'pointer' : undefined,
    position: 'relative',
    width: '100%',
  };

  const contentLayout: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: compVar('list', 'item-between-space'),
    width: '100%',
  };

  const headlineStyle: CSSProperties = {
    ...typeStyle('body-large'),
    fontFamily: compVar('list-item', 'label-text-font'),
    color: selected
      ? compVar('list', 'item-selected-label-text-color')
      : compVar('list-item', 'label-text-color'),
  };

  const supportingStyle: CSSProperties = {
    ...typeStyle('body-medium'),
    fontFamily: compVar('list-item', 'supporting-text-font'),
    color: selected
      ? compVar('list', 'item-selected-supporting-text-color')
      : compVar('list', 'item-supporting-text-color'),
  };

  const overlineStyle: CSSProperties = {
    ...typeStyle('label-small'),
    color: selected
      ? compVar('list', 'item-selected-overline-color')
      : compVar('list', 'item-overline-color'),
  };

  const iconStyle: CSSProperties = {
    width: compVar('list', 'item-leading-icon-size'),
    height: compVar('list', 'item-leading-icon-size'),
    color: selected
      ? compVar('list', 'item-selected-leading-icon-color')
      : compVar('list', 'item-leading-icon-color'),
    flexShrink: 0,
  };

  const trailingStyle: CSSProperties = {
    ...iconStyle,
    color: selected
      ? compVar('list', 'item-selected-trailing-icon-color')
      : compVar('list-item', 'trailing-icon-color'),
  };

  const itemContent = (
    <>
      {leading && <span style={iconStyle}>{leading}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {overline && lines >= 3 && <div style={overlineStyle}>{overline}</div>}
        <div style={headlineStyle}>{headline}</div>
        {supportingText && lines >= 2 && <div style={supportingStyle}>{supportingText}</div>}
      </div>
      {trailing && <span style={trailingStyle}>{trailing}</span>}
    </>
  );

  const item = (
    <li className={className} data-testid={testId} style={itemStyle}>
      {interactive ? (
        <FocusRing
          style={{ width: '100%', display: 'flex', ...focusRingAttachmentStyle(itemShape) }}
        >
          <Ripple
            style={{
              ...contentLayout,
              borderRadius: 'inherit',
            }}
          >
            <SurfaceAction onClick={onClick}>{itemContent}</SurfaceAction>
          </Ripple>
        </FocusRing>
      ) : (
        itemContent
      )}
    </li>
  );

  if (divider) {
    return (
      <>
        {item}
        <li aria-hidden style={{ listStyle: 'none' }}>
          <Divider variant="inset" />
        </li>
      </>
    );
  }

  return item;
}
