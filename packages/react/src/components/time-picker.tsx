
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
  let a = (angle + 90 + 360) % 360;
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
    format === '12h'
      ? to12Hour(from12Hour(value.hour, value.period ?? 'AM')).hour
      : value.hour;

  const handlePointer = (e: PointerEvent) => {
    const rect = dialRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    const dist = Math.sqrt(x * x + y * y);
    const angle = (Math.atan2(y, x) * 180) / Math.PI;

    if (selecting === 'hour') {
      if (format === '24h') {
        const isInner = dist < (OUTER_RADIUS + INNER_RADIUS) / 2;
        const max = isInner ? 12 : 12;
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
    if (e.key === 'Enter') onSelectingChange(selecting === 'hour' ? 'minute' : 'hour');
  };

  const selectorAngle =
    selecting === 'hour'
      ? angleForValue(format === '12h' ? displayHour : value.hour, format === '12h' ? 12 : 24)
      : angleForValue(value.minute, 60);

  const selectorR = selecting === 'hour' && format === '24h' && value.hour >= 13 ? INNER_RADIUS : OUTER_RADIUS;
  const handlePos = polarToCartesian(cx, cy, selectorR, selectorAngle);

  const hours = format === '12h' ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i);

  return (
    <div
      ref={dialRef}
      role="slider"
      aria-label={selecting === 'hour' ? hourLabel : minuteLabel}
      aria-valuemin={0}
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
        const is24 = format === '24h';
        const display = is24 ? h : h;
        const r = is24 && h >= 13 ? INNER_RADIUS : OUTER_RADIUS;
        const angle = angleForValue(is24 ? (h % 12 || 12) : h, 12);
        const pos = polarToCartesian(cx, cy, r - 20, angle);
        const selected =
          selecting === 'hour' &&
          (format === '12h' ? displayHour === h : value.hour === h);
        return (
          <span
            key={h}
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
            }}
          >
            {is24 && h >= 13 ? String(h) : String(display)}
          </span>
        );
      })}
      <AnimatePresence mode="wait">
        <motion.div
          key={selecting}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={springs.fastSpatial}
          style={{
            position: 'absolute',
            left: handlePos.x,
            top: handlePos.y,
            transform: 'translate(-50%, -50%)',
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

function TimeInputFields({
  value,
  onChange,
  format,
}: {
  value: TimeValue;
  onChange: (v: TimeValue) => void;
  format: TimeFormat;
}) {
  const hourLabel = useM3Message('timePicker.hour');
  const minuteLabel = useM3Message('timePicker.minute');
  const amLabel = useM3Message('timePicker.am');
  const pmLabel = useM3Message('timePicker.pm');

  const { hour, period } = format === '12h' ? to12Hour(from12Hour(value.hour, value.period ?? 'AM')) : { hour: value.hour, period: value.period };

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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 }} data-testid="time-input-fields">
      <BaseInput
        aria-label={hourLabel}
        value={String(format === '12h' ? hour : value.hour).padStart(2, '0')}
        onValueChange={(v) => {
          const n = parseInt(v.replace(/\D/g, ''), 10) || 0;
          if (format === '12h') {
            onChange({ ...value, hour: n, period: period ?? 'AM' });
          } else {
            onChange({ ...value, hour: Math.min(23, Math.max(0, n)) });
          }
        }}
        style={fieldStyle}
      />
      <span style={{ ...typeStyle('display-large'), color: compVar('time-input', 'time-field-separator-color') }}>:</span>
      <BaseInput
        aria-label={minuteLabel}
        value={String(value.minute).padStart(2, '0')}
        onValueChange={(v) => {
          const n = parseInt(v.replace(/\D/g, ''), 10) || 0;
          onChange({ ...value, minute: Math.min(59, Math.max(0, n)) });
        }}
        style={fieldStyle}
      />
      {format === '12h' && (
        <ToggleGroup
          value={[period ?? 'AM']}
          onValueChange={(v) => onChange({ ...value, period: (v[0] as 'AM' | 'PM') ?? 'AM' })}
          style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
        >
          <Toggle value="AM" style={{ padding: '4px 12px', ...typeStyle('title-medium') }} aria-label={amLabel}>
            {amLabel}
          </Toggle>
          <Toggle value="PM" style={{ padding: '4px 12px', ...typeStyle('title-medium') }} aria-label={pmLabel}>
            {pmLabel}
          </Toggle>
        </ToggleGroup>
      )}
    </div>
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

  const [uiVariant, setUiVariant] = useState<TimePickerVariant>(variant);
  const [selecting, setSelecting] = useState<'hour' | 'minute'>('hour');

  const popupStyle: CSSProperties = {
    background: compVar('time-picker', 'container-color'),
    borderRadius: compVar('time-picker', 'container-shape'),
    boxShadow: elevationShadow('level3'),
    padding: compVar('list', 'divider-leading-space'),
    minWidth: 328,
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

  const content = (
    <>
      <div style={{ ...typeStyle('label-medium'), color: compVar('time-picker', 'headline-color'), textAlign: 'center', marginBottom: 8 }}>
        {selectLabel}
      </div>
      {uiVariant === 'dial' ? (
        <TimeDial value={current} onChange={setValue} format={format} selecting={selecting} onSelectingChange={setSelecting} />
      ) : (
        <TimeInputFields value={current} onChange={setValue} format={format} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <Button variant="text" onClick={() => setUiVariant(uiVariant === 'dial' ? 'input' : 'dial')}>
          {uiVariant === 'dial' ? inputModeLabel : dialModeLabel}
        </Button>
        <Button variant="text" onClick={() => setOpen(false)}>
          {okLabel}
        </Button>
      </div>
    </>
  );

  const triggerNode =
    trigger ?? (
      <Button variant="outlined" aria-label={selectLabel}>
        {displayTime()}
      </Button>
    );

  return (
    <BaseDialog.Root open={isOpen} onOpenChange={setOpen}>
      <BaseDialog.Trigger render={triggerNode as React.ReactElement} />
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          render={(props) => (
            <ScrimMotion
              {...props}
              style={{ ...props.style, position: 'fixed', inset: 0, background: compVar('scrim', 'container-color'), opacity: 0.32 }}
            />
          )}
        />
        <BaseDialog.Popup className={className} data-testid={testId}>
          <OverlayMotion style={popupStyle}>{content}</OverlayMotion>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export { normalizeHour, to12Hour, from12Hour };
