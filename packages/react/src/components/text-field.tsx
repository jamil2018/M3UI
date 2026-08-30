
import { Field as BaseField } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import {
  fieldIconStyles,
  fieldInputStyles,
  fieldLabelStyles,
  fieldSupportingStyles,
  fieldTokenPrefix,
  fieldWrapStyles,
  type FieldVariant,
} from '../lib/field-internals.js';
import { compVar, typeStyle } from '../lib/token-utils.js';

export type { FieldVariant as TextFieldVariant };

export interface TextFieldProps {
  variant?: FieldVariant;
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  supportingText?: string;
  errorText?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  prefix?: string;
  suffix?: string;
  counter?: boolean;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  name?: string;
  type?: string;
  className?: string;
  'data-testid'?: string;
}

export function TextField({
  variant = 'filled',
  label,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  disabled = false,
  error = false,
  supportingText,
  errorText,
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  counter = false,
  maxLength,
  multiline = false,
  rows = 3,
  name,
  type = 'text',
  className,
  'data-testid': testId,
}: TextFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const currentValue = value ?? internalValue;
  const hasValue = currentValue.length > 0;
  const floated = focused || hasValue;

  const prefixToken = fieldTokenPrefix(variant);
  const interaction = { disabled, error, focused, hovered };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: compVar('list', 'item-between-space'),
  };

  const inputStyle: CSSProperties = {
    ...fieldInputStyles(prefixToken, interaction, Boolean(label)),
    resize: multiline ? 'vertical' : undefined,
    minHeight: multiline
      ? `calc(${compVar('outlined-text-field', 'container-height')} * ${String(rows)})`
      : undefined,
  };

  const handleChange = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <BaseField.Root
      className={className}
      data-testid={testId}
      style={containerStyle}
      invalid={error}
      disabled={disabled}
    >
      <div
        style={fieldWrapStyles(variant, interaction, multiline)}
        onMouseEnter={() => { setHovered(true); }}
        onMouseLeave={() => { setHovered(false); }}
      >
        {leadingIcon && <span style={fieldIconStyles(prefixToken, interaction)}>{leadingIcon}</span>}
        {prefix && (
          <span style={{ ...typeStyle('body-large'), color: fieldInputStyles(prefixToken, interaction, false).color }}>
            {prefix}
          </span>
        )}
        {label && (
          <motion.label
            htmlFor={id}
            style={fieldLabelStyles(prefixToken, interaction, floated)}
            animate={{
              top: floated ? compVar('list', 'item-top-space') : '50%',
              transform: floated ? 'translateY(0)' : 'translateY(-50%)',
            }}
            transition={springs.fastSpatial}
          >
            {label}
          </motion.label>
        )}
        {multiline ? (
          <textarea
            id={id}
            name={name}
            rows={rows}
            value={currentValue}
            placeholder={!label ? placeholder : floated ? placeholder : undefined}
            disabled={disabled}
            maxLength={maxLength}
            onFocus={() => { setFocused(true); }}
            onBlur={() => { setFocused(false); }}
            onChange={(e) => { handleChange(e.target.value); }}
            style={inputStyle}
          />
        ) : (
          <BaseInput
            id={id}
            name={name}
            type={type}
            value={currentValue}
            placeholder={!label ? placeholder : floated ? placeholder : undefined}
            disabled={disabled}
            maxLength={maxLength}
            onFocus={() => { setFocused(true); }}
            onBlur={() => { setFocused(false); }}
            onValueChange={handleChange}
            style={inputStyle}
          />
        )}
        {suffix && (
          <span style={{ ...typeStyle('body-large'), color: fieldInputStyles(prefixToken, interaction, false).color }}>
            {suffix}
          </span>
        )}
        {trailingIcon && <span style={fieldIconStyles(prefixToken, interaction)}>{trailingIcon}</span>}
      </div>
      {(supportingText || errorText || counter) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: compVar('list', 'item-between-space') }}>
          <BaseField.Description style={fieldSupportingStyles(prefixToken, interaction)}>
            {error && errorText ? errorText : supportingText}
          </BaseField.Description>
          {counter && maxLength !== undefined && (
            <span style={fieldSupportingStyles(prefixToken, interaction)}>
              {currentValue.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </BaseField.Root>
  );
}
