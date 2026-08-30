
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { Children, cloneElement, isValidElement, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';
import { StateLayer } from '../primitives/state-layer.js';
import { Ripple } from '../primitives/ripple.js';

const SEGMENT_PREFIX = 'outlined-segmented-button';

function segmentedItemStyles(selected: boolean, disabled: boolean, lastItem: boolean): CSSProperties {
  const sel = selected ? 'selected' : 'unselected';
  return {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: compVar('button-medium', 'icon-label-space'),
    height: compVar(SEGMENT_PREFIX, 'container-height'),
    paddingInline: compVar('button-medium', 'leading-space'),
    ...typeStyle('label-large'),
    background: selected && !disabled ? compVar(SEGMENT_PREFIX, 'selected-container-color') : 'transparent',
    color: disabled
      ? compVar(SEGMENT_PREFIX, 'disabled-label-text-color')
      : compVar(SEGMENT_PREFIX, `${sel}-label-text-color`),
    border: 'none',
    borderInlineEnd: lastItem
      ? 'none'
      : `${compVar(SEGMENT_PREFIX, 'outline-width')} solid ${compVar(SEGMENT_PREFIX, 'outline-color')}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
  };
}

export interface SegmentedButtonProps {
  children: ReactNode;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function SegmentedButton({
  children,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  disabled = false,
  className,
  'data-testid': testId,
}: SegmentedButtonProps) {
  return (
    <ToggleGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      multiple={multiple}
      disabled={disabled}
      className={className}
      data-testid={testId}
      style={{
        display: 'inline-flex',
        borderRadius: compVar(SEGMENT_PREFIX, 'shape'),
        border: `${compVar(SEGMENT_PREFIX, 'outline-width')} solid ${compVar(SEGMENT_PREFIX, 'outline-color')}`,
        overflow: 'hidden',
      }}
    >
      {Children.toArray(children).map((child, index, items) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<SegmentedButtonItemProps>, {
              'data-last-item': index === items.length - 1,
            } as SegmentedButtonItemProps & { 'data-last-item': boolean })
          : child,
      )}
    </ToggleGroup>
  );
}

export interface SegmentedButtonItemProps {
  value: string;
  children?: ReactNode;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function SegmentedButtonItem({
  value,
  children,
  label,
  icon,
  disabled = false,
  className,
  'data-testid': testId,
  'data-last-item': lastItem = false,
}: SegmentedButtonItemProps & { 'data-last-item'?: boolean }) {
  const [selected, setSelected] = useState(false);

  const iconStyle: CSSProperties = {
    width: compVar(SEGMENT_PREFIX, 'icon-size'),
    height: compVar(SEGMENT_PREFIX, 'icon-size'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: disabled
      ? compVar(SEGMENT_PREFIX, 'disabled-label-text-color')
      : compVar(SEGMENT_PREFIX, `${selected ? 'selected' : 'unselected'}-icon-color`),
  };

  return (
    <Ripple disabled={disabled} style={{ display: 'inline-flex' }}>
      <StateLayer disabled={disabled} style={{ display: 'inline-flex' }}>
        <Toggle
          value={value}
          disabled={disabled}
          onPressedChange={setSelected}
          className={className}
          data-testid={testId}
          style={segmentedItemStyles(selected, disabled, lastItem)}
        >
          {icon && <span style={iconStyle}>{icon}</span>}
          {label ?? children}
        </Toggle>
      </StateLayer>
    </Ripple>
  );
}
