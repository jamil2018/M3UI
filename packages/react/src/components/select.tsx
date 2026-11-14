import { M3PortalScope } from '../provider/m3-provider.js';

import { Select as BaseSelect } from '@base-ui/react/select';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '@m3ui/icons';
import {
  FieldDecorations,
  fieldLabelAnimate,
  fieldLabelStyles,
  fieldSupportingStyles,
  fieldTokenPrefix,
  fieldTrailingIconStyles,
  fieldTriggerStyles,
  type FieldVariant,
} from '../lib/field-internals.js';
import { StateLayer } from '../lib/state-layer.js';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { DialogMotionStyles } from '../lib/dialog-motion.js';
import { MenuMotionPopup } from '../lib/menu-motion.js';

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
  errorText?: string;
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
  overflowX: 'hidden',
  overflowY: 'auto',
  outline: 'none',
};

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  minHeight: compVar('list-item', 'one-line-container-height'),
  paddingBlock: compVar('list', 'item-top-space'),
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
  errorText,
  placeholder = 'Select…',
  className,
  'data-testid': testId,
}: SelectProps) {
  const labelId = useId();
  const supportingId = useId();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value ?? internalValue;
  const hasValue = Boolean(selectedValue);
  const floated = focused || open || hasValue;
  const notched = variant === 'outlined' && Boolean(label);
  const prefixToken = fieldTokenPrefix(variant);
  const interaction = { disabled, error, focused, hovered };

  return (
    <div
      className={className}
      data-testid={testId}
      style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%', minWidth: 200 }}
    >
      <BaseSelect.Root
        items={options}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => {
          if (next == null) return;
          if (value === undefined) setInternalValue(next);
          onValueChange?.(next);
        }}
        onOpenChange={setOpen}
        disabled={disabled}
      >
        <BaseSelect.Trigger
          style={fieldTriggerStyles(variant, interaction, { notched })}
          aria-invalid={error || undefined}
          aria-describedby={supportingText || errorText ? supportingId : undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-label={!label ? placeholder : undefined}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
          onMouseEnter={() => {
            setHovered(true);
          }}
          onMouseLeave={() => {
            setHovered(false);
          }}
        >
          <FieldDecorations
            variant={variant}
            prefix={prefixToken}
            state={interaction}
            label={label}
            floated={floated}
          />
          {label && (
            <motion.span
              id={labelId}
              style={fieldLabelStyles(prefixToken, interaction, floated, variant)}
              animate={fieldLabelAnimate(variant, floated)}
              transition={springs.fastSpatial}
            >
              {label}
            </motion.span>
          )}
          <BaseSelect.Value
            placeholder={placeholder}
            style={{
              flex: 1,
              textAlign: 'start',
              position: 'relative',
              zIndex: 1,
              opacity: !hasValue && label && !floated ? 0 : 1,
              paddingBlock: label
                ? `${compVar('list', 'divider-leading-space')} ${compVar('list', 'item-top-space')}`
                : undefined,
            }}
          />
          <BaseSelect.Icon style={{ display: 'inline-flex', position: 'relative', zIndex: 1 }}>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={springs.fastEffects}
              style={fieldTrailingIconStyles(prefixToken, interaction)}
            >
              <Icon name="arrow_drop_down" />
            </motion.span>
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <M3PortalScope>
            <DialogMotionStyles />
            <BaseSelect.Positioner
              sideOffset={4}
              style={{ zIndex: 'calc(var(--m3-overlay-layer, 1100) + 1)' }}
            >
              <BaseSelect.Popup
                render={(popupProps) => (
                  <MenuMotionPopup {...popupProps} style={{ ...popupStyle, ...popupProps.style }} />
                )}
              >
                <BaseSelect.List>
                  {options.map((opt) => {
                    const selected = opt.value === selectedValue;
                    return (
                      <BaseSelect.Item
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                        style={(state) => ({
                          ...itemStyle,
                          background:
                            selected || state.highlighted
                              ? compVar('list', 'item-selected-container-color')
                              : undefined,
                          padding: 0,
                          opacity: state.disabled ? 0.38 : 1,
                        })}
                      >
                        <StateLayer
                          states={['hover', 'pressed']}
                          disabled={opt.disabled}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            minHeight: compVar('list-item', 'one-line-container-height'),
                            paddingBlock: compVar('list', 'item-top-space'),
                            paddingInline: compVar('list', 'divider-leading-space'),
                            borderRadius: 'inherit',
                            gap: compVar('list', 'item-between-space'),
                          }}
                        >
                          <BaseSelect.ItemText style={{ flex: 1 }}>{opt.label}</BaseSelect.ItemText>
                          <BaseSelect.ItemIndicator>
                            <Icon name="check" size={18} />
                          </BaseSelect.ItemIndicator>
                        </StateLayer>
                      </BaseSelect.Item>
                    );
                  })}
                </BaseSelect.List>
              </BaseSelect.Popup>
            </BaseSelect.Positioner>
          </M3PortalScope>
        </BaseSelect.Portal>
      </BaseSelect.Root>
      {(supportingText || errorText) && (
        <span id={supportingId} style={fieldSupportingStyles(prefixToken, interaction)}>
          {error && errorText ? errorText : supportingText}
        </span>
      )}
    </div>
  );
}

/** Alias for M3 "Exposed Dropdown Menu" pattern */
export const ExposedDropdownMenu = Select;
export type ExposedDropdownMenuProps = SelectProps;
