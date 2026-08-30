
import { Select as BaseSelect } from '@base-ui/react/select';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '@m3ui/icons';
import {
  fieldIconStyles,
  fieldSupportingStyles,
  fieldToken,
  fieldTokenPrefix,
  fieldTriggerStyles,
  type FieldVariant,
} from '../lib/field-internals.js';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { PopupMotion } from '../lib/popup-motion.js';

export type SelectVariant = FieldVariant;

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  variant?: SelectVariant;
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  error?: boolean;
  supportingText?: string;
  placeholder?: string;
  className?: string;
  'data-testid'?: string;
}

const popupStyle: CSSProperties = {
  background: compVar('menu', 'container-color'),
  borderRadius: compVar('menu', 'container-shape'),
  boxShadow: elevationShadow('level2'),
  paddingBlock: compVar('list', 'item-top-space'),
  maxHeight: `calc(${compVar('outlined-text-field', 'container-height')} * 5)`,
  overflow: 'auto',
  outline: 'none',
};

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  paddingBlock: compVar('list', 'item-one-line-container-height'),
  paddingInline: compVar('list', 'divider-leading-space'),
  ...typeStyle('body-large'),
  color: compVar('list', 'item-label-text-color'),
  cursor: 'pointer',
  borderRadius: compVar('list', 'item-container-shape'),
};

export function Select({
  variant = 'outlined',
  label,
  value,
  defaultValue,
  onValueChange,
  options,
  disabled = false,
  error = false,
  supportingText,
  placeholder = 'Select…',
  className,
  'data-testid': testId,
}: SelectProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const prefixToken = fieldTokenPrefix(variant);
  const interaction = { disabled, error, focused, hovered };

  return (
    <div className={className} data-testid={testId} style={{ display: 'flex', flexDirection: 'column', gap: compVar('list', 'item-between-space') }}>
      <BaseSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange ? (next) => { if (next != null) onValueChange(next); } : undefined}
        disabled={disabled}
      >
        {label && (
          <BaseSelect.Label
            style={{
              ...typeStyle('body-small'),
              color: fieldToken(prefixToken, 'label-color', interaction),
              position: 'static',
              transform: 'none',
              pointerEvents: 'auto',
            }}
          >
            {label}
          </BaseSelect.Label>
        )}
        <BaseSelect.Trigger
          style={fieldTriggerStyles(variant, interaction)}
          onFocus={() => { setFocused(true); }}
          onBlur={() => { setFocused(false); }}
          onMouseEnter={() => { setHovered(true); }}
          onMouseLeave={() => { setHovered(false); }}
        >
          <BaseSelect.Value placeholder={placeholder} style={{ flex: 1, textAlign: 'start' }} />
          <BaseSelect.Icon style={fieldIconStyles(prefixToken, interaction)}>▾</BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={4} style={{ zIndex: 1000 }}>
            <PopupMotion>
              <BaseSelect.Popup style={popupStyle}>
                <BaseSelect.List>
                  {options.map((opt) => (
                    <BaseSelect.Item key={opt.value} value={opt.value} disabled={opt.disabled} style={itemStyle}>
                      <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                      <BaseSelect.ItemIndicator><Icon name="check" size={18} /></BaseSelect.ItemIndicator>
                    </BaseSelect.Item>
                  ))}
                </BaseSelect.List>
              </BaseSelect.Popup>
            </PopupMotion>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
      {supportingText && (
        <span style={fieldSupportingStyles(prefixToken, interaction)}>{supportingText}</span>
      )}
    </div>
  );
}

/** Alias for M3 "Exposed Dropdown Menu" pattern */
export const ExposedDropdownMenu = Select;
export type ExposedDropdownMenuProps = SelectProps;
