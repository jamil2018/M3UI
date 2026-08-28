
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';
import { StateLayer } from '../primitives/state-layer.js';
import { Ripple } from '../primitives/ripple.js';

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
        borderRadius: compVar('outlined-segmented-button', 'shape'),
        border: `${compVar('outlined-segmented-button', 'outline-width')} solid ${compVar('outlined-segmented-button', 'outline-color')}`,
        overflow: 'hidden',
      }}
    >
      {children}
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
}: SegmentedButtonItemProps) {
  const itemStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: compVar('button-medium', 'icon-label-space'),
    height: compVar('outlined-segmented-button', 'container-height'),
    paddingInline: compVar('button-medium', 'leading-space'),
    ...typeStyle('label-large'),
    background: 'transparent',
    color: compVar('outlined-segmented-button', 'disabled-label-text-color'),
    border: 'none',
    borderInlineEnd: `${compVar('outlined-segmented-button', 'outline-width')} solid ${compVar('outlined-segmented-button', 'outline-color')}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
  };

  const iconStyle: CSSProperties = {
    width: compVar('button-medium', 'icon-size'),
    height: compVar('button-medium', 'icon-size'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Ripple disabled={disabled}>
      <StateLayer disabled={disabled} style={{ display: 'inline-flex' }}>
        <Toggle
          value={value}
          disabled={disabled}
          className={className}
          data-testid={testId}
          style={itemStyle}
        >
          {icon && <span style={iconStyle}>{icon}</span>}
          {label ?? children}
        </Toggle>
      </StateLayer>
    </Ripple>
  );
}
