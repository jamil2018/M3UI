
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';
import { StateLayer } from '../primitives/state-layer.js';
import { Ripple } from '../primitives/ripple.js';
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
  const itemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: compVar('list', 'item-between-space'),
    paddingBlock: compVar('list', 'item-bottom-space'),
    paddingInline: compVar('list', 'divider-leading-space'),
    borderRadius: compVar('list', 'item-container-expressive-shape'),
    background: selected ? compVar('list', 'item-selected-container-color') : compVar('list', 'item-container-color'),
    cursor: interactive ? 'pointer' : undefined,
    position: 'relative',
  };

  const headlineStyle: CSSProperties = {
    ...typeStyle('body-large'),
    color: compVar('list', 'item-label-text-color'),
  };

  const supportingStyle: CSSProperties = {
    ...typeStyle('body-medium'),
    color: compVar('list', 'item-supporting-text-color'),
  };

  const overlineStyle: CSSProperties = {
    ...typeStyle('label-small'),
    color: compVar('list', 'item-overline-color'),
  };

  const iconStyle: CSSProperties = {
    width: compVar('list', 'item-leading-icon-size'),
    height: compVar('list', 'item-leading-icon-size'),
    color: compVar('list', 'item-leading-icon-color'),
    flexShrink: 0,
  };

  const itemContent = (
    <>
      {leading && <span style={iconStyle}>{leading}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {overline && lines >= 3 && <div style={overlineStyle}>{overline}</div>}
        <div style={headlineStyle}>{headline}</div>
        {supportingText && lines >= 2 && <div style={supportingStyle}>{supportingText}</div>}
      </div>
      {trailing && <span style={iconStyle}>{trailing}</span>}
    </>
  );

  const item = (
    <li className={className} data-testid={testId} style={itemStyle} onClick={interactive ? onClick : undefined}>
      {interactive ? (
        <Ripple>
          <StateLayer style={{ display: 'flex', alignItems: 'center', gap: compVar('list', 'item-between-space'), width: '100%' }}>
            {itemContent}
          </StateLayer>
        </Ripple>
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
