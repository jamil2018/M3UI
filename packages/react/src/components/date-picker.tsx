
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { CalendarDate } from '@internationalized/date';
import { motion, AnimatePresence } from 'motion/react';
import { springs } from '@m3ui/motion';
import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import {
  generateMonthGrid,
  navigateGrid,
  navigateMonth,
  selectDate,
  createInitialCalendarState,
  getWeekdayLabels,
  type CalendarSelectionMode,
  type CalendarSelectionState,
  type CalendarDayCell,
} from '../lib/calendar-engine.js';
import { useM3 } from '../provider/m3-provider.js';
import { useM3I18n, useM3Message } from '../lib/i18n.js';
import { useWindowSizeClass, sizeClassAtLeast } from '../lib/window-size-class.js';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { OverlayMotion, ScrimMotion } from '../lib/overlay-motion.js';
import { PopupMotion } from '../lib/popup-motion.js';
import { IconButton } from './icon-button.js';
import { Button } from './button.js';
import { DateInput, formatCalendarDate } from './date-input.js';

export type DatePickerVariant = 'docked' | 'modal' | 'modal-input';
export type DatePickerInputMode = 'calendar' | 'input';

export interface DatePickerProps {
  variant?: DatePickerVariant;
  mode?: CalendarSelectionMode;
  trigger?: ReactNode;
  label?: string;
  value?: CalendarDate | { start: CalendarDate | null; end: CalendarDate | null };
  defaultValue?: CalendarDate | { start: CalendarDate | null; end: CalendarDate | null };
  onValueChange?: (value: CalendarDate | { start: CalendarDate | null; end: CalendarDate | null }) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
  isDateUnavailable?: (date: CalendarDate) => boolean;
  locale?: string;
  inputMode?: DatePickerInputMode;
  className?: string;
  'data-testid'?: string;
}

const calendarPopupStyle: CSSProperties = {
  background: compVar('date-picker-modal', 'container-color'),
  borderRadius: compVar('date-picker-modal', 'container-shape'),
  boxShadow: elevationShadow('level3'),
  width: compVar('date-picker-modal', 'container-width'),
  overflow: 'hidden',
};

function CalendarGrid({
  state,
  setState,
  locale,
  minValue,
  maxValue,
  isDateUnavailable,
  months = 1,
}: {
  state: CalendarSelectionState;
  setState: (s: CalendarSelectionState) => void;
  locale: string;
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
  isDateUnavailable?: (date: CalendarDate) => boolean;
  months?: number;
}) {
  const prevMonth = useM3Message('common.previousMonth');
  const nextMonth = useM3Message('common.nextMonth');
  const focused = state.focused;
  const monthGrids = useMemo(() => {
    const grids = [];
    for (let i = 0; i < months; i++) {
      const d = navigateMonth(focused, i);
      grids.push(
        generateMonthGrid(d.year, d.month, state, { locale, minValue, maxValue, isDateUnavailable }),
      );
    }
    return grids;
  }, [focused, months, state, locale, minValue, maxValue, isDateUnavailable]);

  const weekStartsOn = monthGrids[0]?.weekStartsOn ?? 0;
  const weekdays = getWeekdayLabels(locale, weekStartsOn);

  const onKeyDown = (e: KeyboardEvent) => {
    const next = navigateGrid(state.focused, e.key, weekStartsOn, locale);
    if (next !== state.focused) {
      e.preventDefault();
      setState({ ...state, focused: next });
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setState(selectDate(state, state.focused));
    }
  };

  const dayStyle = (cell: CalendarDayCell): CSSProperties => ({
    width: compVar('date-picker-modal', 'date-container-width'),
    height: compVar('date-picker-modal', 'date-container-height'),
    borderRadius: compVar('date-picker-modal', 'date-container-shape'),
    border: cell.isToday
      ? `${compVar('date-picker-modal', 'date-today-container-outline-width')} solid ${compVar('date-picker-modal', 'date-today-container-outline-color')}`
      : 'none',
    background: cell.isSelected
      ? compVar('date-picker-modal', 'date-selected-container-color')
      : cell.isInRange || cell.isRangePreview
        ? compVar('date-picker-modal', 'range-selection-active-indicator-container-color')
        : 'transparent',
    color: cell.isSelected
      ? compVar('date-picker-modal', 'date-selected-label-text-color')
      : cell.isToday
        ? compVar('date-picker-modal', 'date-today-label-text-color')
        : cell.isInRange || cell.isRangePreview
          ? compVar('date-picker-modal', 'selection-date-in-range-label-text-color')
          : cell.isCurrentMonth
            ? compVar('date-picker-modal', 'date-unselected-label-text-color')
            : compVar('date-picker-modal', 'date-unselected-label-text-color'),
    ...typeStyle('body-large'),
    cursor: cell.isDisabled ? 'not-allowed' : 'pointer',
    opacity: cell.isDisabled ? 0.38 : cell.isCurrentMonth ? 1 : 0.38,
  });

  return (
    <div role="grid" aria-label="Calendar" onKeyDown={onKeyDown} tabIndex={0} data-testid="calendar-grid">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: compVar('list', 'divider-leading-space') }}>
        <IconButton
          aria-label={prevMonth}
          icon="‹"
          variant="standard"
          onClick={() => { setState({ ...state, focused: navigateMonth(focused, -1) }); }}
        />
        <span style={{ ...typeStyle('title-small'), color: compVar('date-picker-modal', 'range-selection-month-subhead-color') }}>
          {new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(focused.year, focused.month - 1, 1))}
        </span>
        <IconButton
          aria-label={nextMonth}
          icon="›"
          variant="standard"
          onClick={() => { setState({ ...state, focused: navigateMonth(focused, 1) }); }}
        />
      </div>
      <div style={{ display: 'flex', gap: compVar('list', 'divider-leading-space'), paddingInline: compVar('list', 'divider-leading-space') }}>
        {monthGrids.map((grid, gi) => (
          <div key={gi} style={{ flex: 1 }}>
            <div role="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
              {weekdays.map((wd) => (
                <div key={wd} role="columnheader" style={{ ...typeStyle('body-large'), textAlign: 'center', color: compVar('date-picker-modal', 'weekdays-label-text-color') }}>
                  {wd}
                </div>
              ))}
            </div>
            {grid.weeks.map((week, wi) => (
              <div key={wi} role="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
                {week.map((cell) => (
                  <button
                    key={cell.iso}
                    type="button"
                    role="gridcell"
                    aria-selected={cell.isSelected}
                    aria-disabled={cell.isDisabled}
                    tabIndex={cell.date.compare(state.focused) === 0 ? 0 : -1}
                    disabled={cell.isDisabled}
                    style={dayStyle(cell)}
                    onClick={() => !cell.isDisabled && setState(selectDate(state, cell.date))}
                    onMouseEnter={() =>
                      state.mode === 'range' &&
                      state.anchorDate &&
                      setState({ ...state, hoverDate: cell.date })
                    }
                  >
                    {cell.dayOfMonth}
                  </button>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarHeader({ date, locale, range }: { date: CalendarDate; locale: string; range?: boolean }) {
  const jsDate = new Date(date.year, date.month - 1, date.day);
  return (
    <div
      style={{
        height: range
          ? compVar('date-picker-modal', 'range-selection-header-container-height')
          : compVar('date-picker-modal', 'header-container-height'),
        width: '100%',
        padding: compVar('list', 'divider-leading-space'),
        background: compVar('date-picker-modal', 'container-color'),
      }}
    >
      <div style={{ ...typeStyle('label-large'), color: compVar('date-picker-modal', 'header-supporting-text-color') }}>
        {new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric' }).format(jsDate)}
      </div>
      <div
        style={{
          ...(range ? typeStyle('title-large') : typeStyle('headline-large')),
          color: compVar('date-picker-modal', 'header-headline-color'),
        }}
      >
        {new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric' }).format(jsDate)}
      </div>
    </div>
  );
}

function DatePickerContent({
  state,
  setState,
  locale,
  minValue,
  maxValue,
  isDateUnavailable,
  inputMode,
  setInputMode,
  onConfirm,
  months,
}: {
  state: CalendarSelectionState;
  setState: (s: CalendarSelectionState) => void;
  locale: string;
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
  isDateUnavailable?: (date: CalendarDate) => boolean;
  inputMode: DatePickerInputMode;
  setInputMode: (m: DatePickerInputMode) => void;
  onConfirm?: () => void;
  months: number;
}) {
  const calendarModeLabel = useM3Message('datePicker.calendarMode');
  const inputModeLabel = useM3Message('datePicker.inputMode');
  const okLabel = useM3Message('common.ok');
  const { direction } = useM3();

  const focused =
    state.selected instanceof CalendarDate
      ? state.selected
      : state.mode === 'range' && typeof state.selected === 'object' && 'start' in state.selected
        ? state.selected.start ?? state.focused
        : state.focused;

  return (
    <>
      <CalendarHeader date={focused} locale={locale} range={state.mode === 'range'} />
      <AnimatePresence mode="wait">
        {inputMode === 'calendar' ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: direction === 'rtl' ? 16 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'rtl' ? -16 : 16 }}
            transition={springs.defaultSpatial}
          >
            <CalendarGrid
              state={state}
              setState={setState}
              locale={locale}
              minValue={minValue}
              maxValue={maxValue}
              isDateUnavailable={isDateUnavailable}
              months={months}
            />
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: direction === 'rtl' ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'rtl' ? 16 : -16 }}
            transition={springs.defaultSpatial}
            style={{ padding: compVar('list', 'divider-leading-space') }}
          >
            <DateInput
              label={state.mode === 'range' ? undefined : 'Date'}
              value={state.selected instanceof CalendarDate ? state.selected : null}
              onValueChange={(d) => d && setState(selectDate(state, d))}
              minValue={minValue}
              maxValue={maxValue}
              locale={locale}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: compVar('list', 'divider-leading-space') }}>
        <Button
          variant="text"
          onClick={() => { setInputMode(inputMode === 'calendar' ? 'input' : 'calendar'); }}
        >
          {inputMode === 'calendar' ? inputModeLabel : calendarModeLabel}
        </Button>
        {onConfirm && (
          <Button variant="text" onClick={onConfirm}>
            {okLabel}
          </Button>
        )}
      </div>
    </>
  );
}

export function DatePicker({
  variant = 'docked',
  mode = 'single',
  trigger,
  label,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  minValue,
  maxValue,
  isDateUnavailable,
  locale: localeProp,
  inputMode: initialInputMode = 'calendar',
  className,
  'data-testid': testId,
}: DatePickerProps) {
  const { locale: ctxLocale } = useM3I18n();
  const locale = localeProp ?? ctxLocale;
  const { sizeClass } = useWindowSizeClass();
  const selectLabel = useM3Message(mode === 'range' ? 'datePicker.selectDateRange' : 'datePicker.selectDate');

  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isOpen = open ?? internalOpen;
  const setOpen = useCallback(
    (v: boolean) => {
      if (open === undefined) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [open, onOpenChange],
  );

  const [inputMode, setInputMode] = useState<DatePickerInputMode>(initialInputMode);
  const [state, setState] = useState<CalendarSelectionState>(() =>
    createInitialCalendarState(mode, defaultValue),
  );

  const months = mode === 'range' && sizeClassAtLeast(sizeClass, 'expanded') ? 2 : 1;

  const displayValue = useMemo(() => {
    if (value instanceof CalendarDate) return formatCalendarDate(value, locale);
    if (value && typeof value === 'object' && 'start' in value) {
      const { start, end } = value;
      if (start && end) return `${formatCalendarDate(start, locale)} – ${formatCalendarDate(end, locale)}`;
      if (start) return formatCalendarDate(start, locale);
    }
    if (state.selected instanceof CalendarDate) return formatCalendarDate(state.selected, locale);
    return '';
  }, [value, state.selected, locale]);

  const handleConfirm = () => {
    if (state.selected instanceof CalendarDate) onValueChange?.(state.selected);
    else if (typeof state.selected === 'object' && 'start' in state.selected) onValueChange?.(state.selected);
    setOpen(false);
  };

  const content = (
    <DatePickerContent
      state={state}
      setState={setState}
      locale={locale}
      minValue={minValue}
      maxValue={maxValue}
      isDateUnavailable={isDateUnavailable}
      inputMode={inputMode}
      setInputMode={setInputMode}
      onConfirm={variant !== 'docked' ? handleConfirm : undefined}
      months={months}
    />
  );

  const triggerNode =
    trigger ??
    (
      <Button variant="outlined" aria-label={selectLabel}>
        {displayValue || label || selectLabel}
      </Button>
    );

  if (variant === 'docked') {
    return (
      <BasePopover.Root open={isOpen} onOpenChange={setOpen}>
        <BasePopover.Trigger render={triggerNode as React.ReactElement} />
        <BasePopover.Portal>
          <BasePopover.Positioner sideOffset={4}>
            <PopupMotion>
              <BasePopover.Popup className={className} data-testid={testId} style={calendarPopupStyle}>
                {content}
              </BasePopover.Popup>
            </PopupMotion>
          </BasePopover.Positioner>
        </BasePopover.Portal>
      </BasePopover.Root>
    );
  }

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
          <OverlayMotion style={calendarPopupStyle}>{content}</OverlayMotion>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export type { CalendarSelectionMode };
