import { Field as BaseField } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { parseDate, CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
import { useId, useState, useCallback } from 'react';
import {
  FieldDecorations,
  FieldFloatingLabel,
  fieldInputStyles,
  fieldSupportingStyles,
  fieldTokenPrefix,
  fieldWrapStyles,
  type FieldVariant,
} from '../lib/field-internals.js';
import { compVar, typeStyle } from '../lib/token-utils.js';
import { useM3I18n, useM3Message } from '../lib/i18n.js';

export type DateInputVariant = FieldVariant;

export interface DateInputProps {
  variant?: DateInputVariant;
  label?: string;
  value?: CalendarDate | null;
  defaultValue?: CalendarDate | null;
  onValueChange?: (value: CalendarDate | null) => void;
  onValidityChange?: (valid: boolean) => void;
  disabled?: boolean;
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
  isDateUnavailable?: (date: CalendarDate) => boolean;
  locale?: string;
  supportingText?: string;
  name?: string;
  className?: string;
  'data-testid'?: string;
}

/** Locale-aware date segment patterns. */
function getDateSegments(locale: string): {
  order: ('day' | 'month' | 'year')[];
  separator: string;
} {
  const parts = new Intl.DateTimeFormat(locale).formatToParts(new Date(2024, 11, 31));
  const order: ('day' | 'month' | 'year')[] = [];
  let separator = '/';
  for (const p of parts) {
    if (p.type === 'literal' && p.value.trim()) separator = p.value.trim();
    if (p.type === 'day') order.push('day');
    if (p.type === 'month') order.push('month');
    if (p.type === 'year') order.push('year');
  }
  if (order.length === 0) return { order: ['month', 'day', 'year'], separator: '/' };
  return { order, separator };
}

function formatCalendarDate(date: CalendarDate, locale: string): string {
  const jsDate = new Date(date.year, date.month - 1, date.day);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(jsDate);
}

function parseInputValue(raw: string, locale: string): CalendarDate | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const { order, separator } = getDateSegments(locale);
  const segments = trimmed.split(separator);
  if (
    segments.length !== 3 ||
    segments.some((part, i) => !/^\d+$/.test(part) || (order[i] === 'year' && part.length !== 4))
  )
    return null;
  const parts = segments.map(Number);
  if (parts.some((n) => Number.isNaN(n))) return null;
  let day = 1;
  let month = 1;
  let year = 2000;
  order.forEach((seg, i) => {
    const val = parts[i];
    if (val == null) return;
    if (seg === 'day') day = val;
    if (seg === 'month') month = val;
    if (seg === 'year') year = val < 100 ? 2000 + val : val;
  });
  try {
    return parseDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  } catch {
    return null;
  }
}

function segmentLength(seg: 'day' | 'month' | 'year'): number {
  return seg === 'year' ? 4 : 2;
}

function maskInput(raw: string, locale: string): string {
  const { order, separator } = getDateSegments(locale);
  const maxLen = order.reduce((sum, seg) => sum + segmentLength(seg), 0);
  const digits = raw.replace(/\D/g, '').slice(0, maxLen);
  let result = '';
  let idx = 0;
  for (let i = 0; i < order.length; i++) {
    const len = segmentLength(order[i]!);
    const part = digits.slice(idx, idx + len);
    if (!part) break;
    if (i > 0) result += separator;
    result += part;
    idx += part.length;
    if (digits.length <= idx) break;
  }
  return result;
}

export function DateInput({
  variant = 'outlined',
  label,
  value,
  defaultValue,
  onValueChange,
  onValidityChange,
  disabled = false,
  minValue,
  maxValue,
  isDateUnavailable,
  locale: localeProp,
  supportingText,
  name,
  className,
  'data-testid': testId,
}: DateInputProps) {
  const id = useId();
  const { locale: ctxLocale } = useM3I18n();
  const locale = localeProp ?? ctxLocale;
  const invalidMsg = useM3Message('dateInput.invalidDate');
  const placeholder = useM3Message('dateInput.placeholder');

  const initialText =
    (value ?? defaultValue) != null ? formatCalendarDate((value ?? defaultValue)!, locale) : '';
  const [internalText, setInternalText] = useState(initialText);
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const valueKey = value?.toString() ?? value;
  const [previous, setPrevious] = useState({ valueKey, locale });
  if (previous.valueKey !== valueKey || previous.locale !== locale) {
    setPrevious({ valueKey, locale });
    if (value !== undefined) setInternalText(value ? formatCalendarDate(value, locale) : '');
  }
  const textValue = internalText;

  const prefixToken = fieldTokenPrefix(variant);
  const interaction = { disabled, error, focused, hovered };
  const floated = focused || textValue.length > 0;
  const notched = variant === 'outlined' && Boolean(label);

  const validate = useCallback(
    (parsed: CalendarDate | null, raw: string): boolean => {
      if (!raw.trim()) {
        setError(false);
        return true;
      }
      if (!parsed) {
        setError(true);
        return false;
      }
      if (minValue && parsed.compare(minValue) < 0) {
        setError(true);
        return false;
      }
      if (maxValue && parsed.compare(maxValue) > 0) {
        setError(true);
        return false;
      }
      if (isDateUnavailable?.(parsed)) {
        setError(true);
        return false;
      }
      setError(false);
      return true;
    },
    [minValue, maxValue, isDateUnavailable],
  );

  const handleChange = (raw: string) => {
    const masked = maskInput(raw, locale);
    setInternalText(masked);
    const parsed = parseInputValue(masked, locale);
    if (parsed || !masked) {
      const valid = validate(parsed, masked);
      onValidityChange?.(valid);
      if (valid) onValueChange?.(parsed);
    } else {
      setError(false);
      onValidityChange?.(false);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    const parsed = parseInputValue(textValue, locale);
    validate(parsed, textValue);
  };

  return (
    <BaseField.Root
      name={name}
      invalid={error}
      disabled={disabled}
      className={className}
      data-testid={testId}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        width: '100%',
        minWidth: 0,
      }}
    >
      <div
        style={fieldWrapStyles(variant, interaction, { notched })}
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
          <FieldFloatingLabel
            variant={variant}
            prefix={prefixToken}
            state={interaction}
            label={label}
            floated={floated}
            htmlFor={id}
          />
        )}
        <BaseInput
          id={id}
          value={textValue}
          onValueChange={handleChange}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={!label ? placeholder : floated ? placeholder : undefined}
          inputMode="numeric"
          aria-invalid={error}
          style={fieldInputStyles(prefixToken, interaction, Boolean(label))}
        />
      </div>
      {error && (
        <BaseField.Error
          match={error}
          style={{
            ...typeStyle('body-small'),
            color: compVar(prefixToken, 'error-supporting-text-color'),
          }}
        >
          {error ? invalidMsg : supportingText}
        </BaseField.Error>
      )}
      {!error && supportingText && (
        <BaseField.Description style={fieldSupportingStyles(prefixToken, interaction)}>
          {supportingText}
        </BaseField.Description>
      )}
    </BaseField.Root>
  );
}

export { formatCalendarDate, parseInputValue, getDateSegments, maskInput, today, getLocalTimeZone };
