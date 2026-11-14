import { modalPopupLayout } from '../lib/modal-layout.js';
import { M3PortalScope } from '../provider/m3-provider.js';

import { ToggleGroup } from '@base-ui/react/toggle-group';
import { Toggle } from '@base-ui/react/toggle';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Input as BaseInput } from '@base-ui/react/input';
import { motion, AnimatePresence } from 'motion/react';
import { springs } from '@m3ui/motion';
import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { useM3Message } from '../lib/i18n.js';
import { OverlayMotion, ScrimMotion } from '../lib/overlay-motion.js';
import { Button } from './button.js';

export type TimePickerVariant = 'dial' | 'input';
export type TimeFormat = '12h' | '24h';

export interface TimeValue {
  hour: number;
  minute: number;
  period?: 'AM' | 'PM';
}

export interface TimePickerProps {
  variant?: TimePickerVariant;
  format?: TimeFormat;
  value?: TimeValue;
  defaultValue?: TimeValue;
  onValueChange?: (value: TimeValue) => void;
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  'data-testid'?: string;
}

const DIAL_SIZE = 256;
const OUTER_RADIUS = 100;
const INNER_RADIUS = 68;

function normalizeHour(h: number, format: TimeFormat, period?: 'AM' | 'PM'): number {
  if (format === '24h') return ((h % 24) + 24) % 24;
  let hour = h % 12;
  if (hour === 0) hour = 12;
  if (period === 'PM' && hour < 12) return hour === 12 ? 12 : hour + 12;
  if (period === 'AM' && hour >= 12) return hour - 12;
  return hour;
}

function to12Hour(hour24: number): { hour: number; period: 'AM' | 'PM' } {
  const period: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM';
  let hour = hour24 % 12;
  if (hour === 0) hour = 12;
  return { hour, period };
}

function from12Hour(hour: number, period: 'AM' | 'PM'): number {
  if (period === 'AM') return hour === 12 ? 0 : hour;
  return hour === 12 ? 12 : hour + 12;
}

function angleForValue(value: number, max: number): number {
  return (value / max) * 360 - 90;
}

function valueFromAngle(angle: number, max: number): number {
  const a = (angle + 90 + 360) % 360;
  const v = Math.round((a / 360) * max) % max;
  return v;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function TimeDial({
  value,
  onChange,
  format,
  selecting,
  onSelectingChange,
}: {
  value: TimeValue;
  onChange: (v: TimeValue) => void;
  format: TimeFormat;
  selecting: 'hour' | 'minute';
  onSelectingChange: (s: 'hour' | 'minute') => void;
}) {
  const dialRef = useRef<HTMLDivElement>(null);
  const hourLabel = useM3Message('timePicker.hour');
  const minuteLabel = useM3Message('timePicker.minute');
  const cx = DIAL_SIZE / 2;
  const cy = DIAL_SIZE / 2;

  const displayHour =
    format === '12h' ? to12Hour(from12Hour(value.hour, value.period ?? 'AM')).hour : value.hour;

  const handlePointer = (e: PointerEvent) => {
    const rect = dialRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) * DIAL_SIZE) / rect.width - cx;
    const y = ((e.clientY - rect.top) * DIAL_SIZE) / rect.height - cy;
    const dist = Math.sqrt(x * x + y * y);
    const angle = (Math.atan2(y, x) * 180) / Math.PI;

    if (selecting === 'hour') {
      if (format === '24h') {
        const isInner = dist < (OUTER_RADIUS + INNER_RADIUS) / 2;
        const raw = valueFromAngle(angle, 12);
        const hour = isInner ? (raw === 0 ? 0 : raw + 12) : raw === 0 ? 12 : raw;
        onChange({ ...value, hour: hour % 24 });
      } else {
        const raw = valueFromAngle(angle, 12);
        const hour = raw === 0 ? 12 : raw;
        onChange({ ...value, hour, period: value.period ?? 'AM' });
      }
    } else {
      const minute = valueFromAngle(angle, 60);
      onChange({ ...value, minute });
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSelectingChange(selecting === 'hour' ? 'minute' : 'hour');
      return;
    }
    if (!['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const step = e.shiftKey ? 5 : 1;
    if (selecting === 'hour') {
      let h = displayHour;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') h += step;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') h -= step;
      if (format === '12h') {
        h = ((h - 1 + 12) % 12) + 1;
        onChange({ ...value, hour: h, period: value.period ?? 'AM' });
      } else {
        onChange({ ...value, hour: ((h % 24) + 24) % 24 });
      }
    } else {
      let m = value.minute;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') m += step;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') m -= step;
      onChange({ ...value, minute: ((m % 60) + 60) % 60 });
    }
  };

  const selectorAngle =
    selecting === 'hour'
      ? angleForValue(format === '12h' ? displayHour : value.hour % 12, 12)
      : angleForValue(value.minute, 60);

  const selectorR =
    selecting === 'hour' && format === '24h' && (value.hour === 0 || value.hour >= 13)
      ? INNER_RADIUS
      : OUTER_RADIUS;
  const handlePos = polarToCartesian(cx, cy, selectorR, selectorAngle);

  const hours =
    selecting === 'minute'
      ? Array.from({ length: 12 }, (_, i) => i * 5)
      : format === '12h'
        ? Array.from({ length: 12 }, (_, i) => i + 1)
        : Array.from({ length: 24 }, (_, i) => i);

  return (
    <div
      ref={dialRef}
      role="slider"
      aria-label={selecting === 'hour' ? hourLabel : minuteLabel}
      aria-valuemin={selecting === 'hour' && format === '12h' ? 1 : 0}
      aria-valuemax={selecting === 'hour' ? (format === '12h' ? 12 : 23) : 59}
      aria-valuenow={selecting === 'hour' ? displayHour : value.minute}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        handlePointer(e);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) handlePointer(e);
      }}
      onPointerUp={() => {
        if (selecting === 'hour') onSelectingChange('minute');
      }}
      data-testid="time-dial"
      style={{
        position: 'relative',
        width: compVar('time-picker', 'clock-dial-container-size'),
        height: compVar('time-picker', 'clock-dial-container-size'),
        borderRadius: compVar('time-picker', 'clock-dial-shape'),
        background: compVar('time-picker', 'clock-dial-color'),
        margin: '0 auto',
        touchAction: 'none',
      }}
    >
      {hours.map((h) => {
        const is24 = selecting === 'hour' && format === '24h';
        const display = is24 ? h : h;
        const r = is24 && (h === 0 || h >= 13) ? INNER_RADIUS : OUTER_RADIUS;
        const angle = angleForValue(
          selecting === 'minute' ? h : h % 12,
          selecting === 'minute' ? 60 : 12,
        );
        const pos = polarToCartesian(cx, cy, r, angle);
        const selected =
          selecting === 'minute'
            ? value.minute === h
            : format === '12h'
              ? displayHour === h
              : value.hour === h;
        return (
          <span
            key={h}
            data-clock-label={h}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
              ...typeStyle('body-large'),
              color: selected
                ? compVar('time-picker', 'clock-dial-selected-label-text-color')
                : compVar('time-picker', 'clock-dial-unselected-label-text-color'),
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            {selecting === 'minute' ? String(h).padStart(2, '0') : String(display)}
          </span>
        );
      })}
      <svg
        width={DIAL_SIZE}
        height={DIAL_SIZE}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        aria-hidden
      >
        <line
          x1={cx}
          y1={cy}
          x2={handlePos.x}
          y2={handlePos.y}
          stroke={compVar('time-picker', 'clock-dial-selector-track-container-color')}
          strokeWidth={compVar('time-picker', 'clock-dial-selector-track-container-width')}
        />
      </svg>
      <AnimatePresence mode="wait">
        <motion.div
          key={selecting}
          initial={{ scale: 0.8, opacity: 0 }}
          data-clock-selector=""
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ ...springs.fastSpatial, opacity: springs.fastEffects }}
          style={{
            position: 'absolute',
            left: handlePos.x,
            top: handlePos.y,
            translate: '-50% -50%',
            width: compVar('time-picker', 'clock-dial-selector-handle-container-size'),
            height: compVar('time-picker', 'clock-dial-selector-handle-container-size'),
            borderRadius: compVar('time-picker', 'clock-dial-selector-handle-container-shape'),
            background: compVar('time-picker', 'clock-dial-selector-handle-container-color'),
          }}
        />
      </AnimatePresence>
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: cy,
          transform: 'translate(-50%, -50%)',
          width: compVar('time-picker', 'clock-dial-selector-center-container-size'),
          height: compVar('time-picker', 'clock-dial-selector-center-container-size'),
          borderRadius: compVar('time-picker', 'clock-dial-selector-center-container-shape'),
          background: compVar('time-picker', 'clock-dial-selector-center-container-color'),
        }}
      />
    </div>
  );
}

function TimeNumberField({
  label,
  value,
  min,
  max,
  onChange,
  onValidityChange,
  style,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onValidityChange: (valid: boolean) => void;
  style: CSSProperties;
}) {
  const [text, setText] = useState(String(value).padStart(2, '0'));
  const [previous, setPrevious] = useState(value);
  if (previous !== value) {
    setPrevious(value);
    setText(String(value).padStart(2, '0'));
  }
  const valid = text !== '' && Number(text) >= min && Number(text) <= max;
  return (
    <BaseInput
      aria-invalid={!valid}
      aria-label={label}
      inputMode="numeric"
      value={text}
      onValueChange={(raw) => {
        const next = raw.replace(/\D/g, '').slice(0, 2);
        setText(next);
        onValidityChange(next !== '' && Number(next) >= min && Number(next) <= max);
      }}
      onBlur={() => {
        const number = Number(text);
        if (text && number >= min && number <= max) onChange(number);
        if (valid) setText(String(number).padStart(2, '0'));
      }}
      style={{ ...style, minWidth: 0, flexShrink: 1 }}
    />
  );
}

function TimeInputFields({
  value,
  onChange,
  onValidityChange,
  format,
}: {
  value: TimeValue;
  onChange: (v: TimeValue) => void;
  onValidityChange: (valid: boolean) => void;
  format: TimeFormat;
}) {
  const [validity, setValidity] = useState({ hour: true, minute: true });
  const updateValidity = (field: 'hour' | 'minute', valid: boolean) => {
    const next = { ...validity, [field]: valid };
    setValidity(next);
    onValidityChange(next.hour && next.minute);
  };
  const hourLabel = useM3Message('timePicker.hour');
  const minuteLabel = useM3Message('timePicker.minute');
  const amLabel = useM3Message('timePicker.am');
  const pmLabel = useM3Message('timePicker.pm');

  const { hour, period } =
    format === '12h'
      ? to12Hour(from12Hour(value.hour, value.period ?? 'AM'))
      : { hour: value.hour, period: value.period };

  const fieldStyle: CSSProperties = {
    width: compVar('time-input', 'time-field-container-width'),
    height: compVar('time-input', 'time-field-container-height'),
    borderRadius: compVar('time-input', 'time-field-container-shape'),
    background: compVar('time-input', 'time-field-container-color'),
    border: 'none',
    textAlign: 'center',
    ...typeStyle('display-medium'),
    color: compVar('time-input', 'time-field-label-text-color'),
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compVar('list', 'item-between-space'),
        padding: compVar('list', 'divider-leading-space'),
      }}
      data-testid="time-input-fields"
    >
      <TimeNumberField
        onValidityChange={(valid) => updateValidity('hour', valid)}
        label={hourLabel}
        value={hour}
        min={format === '12h' ? 1 : 0}
        max={format === '12h' ? 12 : 23}
        onChange={(hour) => onChange({ ...value, hour })}
        style={fieldStyle}
      />
      <span
        style={{
          ...typeStyle('display-large'),
          color: compVar('time-input', 'time-field-separator-color'),
        }}
      >
        :
      </span>
      <TimeNumberField
        onValidityChange={(valid) => updateValidity('minute', valid)}
        label={minuteLabel}
        value={value.minute}
        min={0}
        max={59}
        onChange={(minute) => onChange({ ...value, minute })}
        style={fieldStyle}
      />
      {format === '12h' && (
        <PeriodToggle
          period={period ?? 'AM'}
          onChange={(next) => {
            onChange({ ...value, period: next });
          }}
          amLabel={amLabel}
          pmLabel={pmLabel}
        />
      )}
    </div>
  );
}

function PeriodToggle({
  period,
  onChange,
  amLabel,
  pmLabel,
}: {
  period: 'AM' | 'PM';
  onChange: (period: 'AM' | 'PM') => void;
  amLabel: string;
  pmLabel: string;
}) {
  const periodStyle = (selected: boolean): CSSProperties => ({
    paddingInline: compVar('list', 'divider-leading-space'),
    paddingBlock: compVar('list', 'item-top-space'),
    ...typeStyle('title-medium'),
    border: 'none',
    cursor: 'pointer',
    background: selected
      ? compVar('time-picker', 'period-selector-selected-container-color')
      : 'transparent',
    color: selected
      ? compVar('time-picker', 'period-selector-selected-label-text-color')
      : compVar('time-picker', 'period-selector-unselected-label-text-color'),
  });

  return (
    <ToggleGroup
      value={[period]}
      onValueChange={(v) => {
        const next = v[0];
        onChange(next === 'PM' ? 'PM' : 'AM');
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: compVar('fab-menu-baseline', 'list-item-between-space'),
      }}
    >
      <Toggle value="AM" style={periodStyle(period === 'AM')} aria-label={amLabel}>
        {amLabel}
      </Toggle>
      <Toggle value="PM" style={periodStyle(period === 'PM')} aria-label={pmLabel}>
        {pmLabel}
      </Toggle>
    </ToggleGroup>
  );
}

function TimeSelectorChip({
  selected,
  label,
  display,
  onClick,
}: {
  selected: boolean;
  label: string;
  display: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      style={{
        width: compVar('time-picker', 'time-selector-container-width'),
        height: compVar('time-picker', 'time-selector-container-height'),
        borderRadius: compVar('time-picker', 'time-selector-container-shape'),
        background: selected
          ? compVar('time-picker', 'time-selector-selected-container-color')
          : compVar('time-picker', 'time-selector-unselected-container-color'),
        color: selected
          ? compVar('time-picker', 'time-selector-selected-label-text-color')
          : compVar('time-picker', 'time-selector-unselected-label-text-color'),
        border: 'none',
        cursor: 'pointer',
        ...typeStyle('display-medium'),
      }}
    >
      {display}
    </button>
  );
}

export function TimePicker({
  variant = 'dial',
  format = '12h',
  value,
  defaultValue,
  onValueChange,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  className,
  'data-testid': testId,
}: TimePickerProps) {
  const selectLabel = useM3Message('timePicker.selectTime');
  const okLabel = useM3Message('common.ok');
  const dialModeLabel = useM3Message('timePicker.dialMode');
  const inputModeLabel = useM3Message('timePicker.inputMode');
  const hourLabel = useM3Message('timePicker.hour');
  const minuteLabel = useM3Message('timePicker.minute');
  const amLabel = useM3Message('timePicker.am');
  const pmLabel = useM3Message('timePicker.pm');

  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isOpen = open ?? internalOpen;
  const setOpen = useCallback(
    (v: boolean) => {
      if (open === undefined) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [open, onOpenChange],
  );

  const [internalValue, setInternalValue] = useState<TimeValue>(
    defaultValue ?? { hour: 12, minute: 0, period: 'AM' },
  );
  const current = value ?? internalValue;
  const setValue = (v: TimeValue) => {
    if (value === undefined) setInternalValue(v);
    onValueChange?.(v);
  };

  const [inputValid, setInputValid] = useState(true);
  const [uiVariant, setUiVariant] = useState<TimePickerVariant>(variant);
  const [selecting, setSelecting] = useState<'hour' | 'minute'>('hour');

  const popupStyle: CSSProperties = {
    background: compVar('time-picker', 'container-color'),
    borderRadius: compVar('time-picker', 'container-shape'),
    boxShadow: elevationShadow('level3'),
    padding: compVar('list', 'divider-leading-space'),
    width: '320px',
    maxWidth: '100%',
    boxSizing: 'border-box',
  };

  const displayTime = () => {
    const h24 = format === '12h' ? from12Hour(current.hour, current.period ?? 'AM') : current.hour;
    const d = new Date(2000, 0, 1, h24, current.minute);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: format === '12h',
    }).format(d);
  };

  const displayHour =
    format === '12h'
      ? to12Hour(from12Hour(current.hour, current.period ?? 'AM')).hour
      : current.hour;
  const displayPeriod =
    format === '12h'
      ? to12Hour(from12Hour(current.hour, current.period ?? 'AM')).period
      : (current.period ?? 'AM');

  const content = (
    <>
      <div
        style={{
          ...typeStyle('label-medium'),
          color: compVar('time-picker', 'headline-color'),
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {selectLabel}
      </div>
      {uiVariant === 'dial' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: compVar('list', 'item-between-space'),
            marginBottom: 16,
          }}
        >
          <TimeSelectorChip
            selected={selecting === 'hour'}
            label={hourLabel}
            display={String(displayHour).padStart(2, '0')}
            onClick={() => {
              setSelecting('hour');
            }}
          />
          <span
            style={{
              ...typeStyle('display-large'),
              color: compVar('time-input', 'time-field-separator-color'),
            }}
          >
            :
          </span>
          <TimeSelectorChip
            selected={selecting === 'minute'}
            label={minuteLabel}
            display={String(current.minute).padStart(2, '0')}
            onClick={() => {
              setSelecting('minute');
            }}
          />
          {format === '12h' && (
            <PeriodToggle
              period={displayPeriod}
              onChange={(period) => {
                setValue({ ...current, period });
              }}
              amLabel={amLabel}
              pmLabel={pmLabel}
            />
          )}
        </div>
      )}
      {uiVariant === 'dial' ? (
        <TimeDial
          value={current}
          onChange={setValue}
          format={format}
          selecting={selecting}
          onSelectingChange={setSelecting}
        />
      ) : (
        <TimeInputFields
          onValidityChange={setInputValid}
          value={current}
          onChange={setValue}
          format={format}
        />
      )}
      {uiVariant === 'input' && !inputValid && (
        <p role="alert">
          Enter an hour from {format === '12h' ? '1 to 12' : '0 to 23'} and minutes from 0 to 59.
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <Button
          variant="text"
          onClick={() => {
            setInputValid(true);
            setUiVariant(uiVariant === 'dial' ? 'input' : 'dial');
          }}
        >
          {uiVariant === 'dial' ? inputModeLabel : dialModeLabel}
        </Button>
        <Button
          variant="text"
          disabled={uiVariant === 'input' && !inputValid}
          onClick={() => {
            setOpen(false);
          }}
        >
          {okLabel}
        </Button>
      </div>
    </>
  );

  const triggerNode = trigger ?? (
    <Button variant="outlined" aria-label={selectLabel}>
      {displayTime()}
    </Button>
  );

  return (
    <BaseDialog.Root open={isOpen} onOpenChange={setOpen}>
      <BaseDialog.Trigger render={triggerNode as React.ReactElement} />
      <BaseDialog.Portal>
        <M3PortalScope>
          <BaseDialog.Backdrop
            render={(props) => (
              <ScrimMotion
                {...props}
                style={{
                  ...props.style,
                  position: 'fixed',
                  inset: 0,
                  zIndex: 'var(--m3-overlay-layer, 1100)',
                  background: compVar('scrim', 'container-color'),
                  opacity: 0.32,
                }}
              />
            )}
          />
          <BaseDialog.Popup
            aria-label={selectLabel}
            className={className}
            data-testid={testId}
            style={modalPopupLayout}
          >
            <OverlayMotion style={{ ...popupStyle, minWidth: 0, maxWidth: '100%' }}>
              {content}
            </OverlayMotion>
          </BaseDialog.Popup>
        </M3PortalScope>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export { normalizeHour, to12Hour, from12Hour };
