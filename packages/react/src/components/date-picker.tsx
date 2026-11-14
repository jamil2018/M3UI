import { modalPopupLayout } from '../lib/modal-layout.js';
import { M3PortalScope } from '../provider/m3-provider.js';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { CalendarDate } from '@internationalized/date';
import { motion, AnimatePresence } from 'motion/react';
import { springs } from '@m3ui/motion';
import { Icon } from '@m3ui/icons';
import {
  useCallback,
  useRef,
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
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { OverlayMotion, ScrimMotion } from '../lib/overlay-motion.js';
import { PopupMotion } from '../lib/popup-motion.js';
import { StateLayer } from '../lib/state-layer.js';
import { IconButton } from './icon-button.js';
import { Button } from './button.js';
import { DateInput, formatCalendarDate } from './date-input.js';

export type DatePickerVariant = 'docked' | 'modal' | 'modal-input';
export type DatePickerInputMode = 'calendar' | 'input';

export interface DatePickerProps {
  variant?: DatePickerVariant;
  mode?: Exclude<CalendarSelectionMode, 'multiple'>;
  trigger?: ReactNode;
  label?: string;
  value?: CalendarDate | { start: CalendarDate | null; end: CalendarDate | null };
  defaultValue?: CalendarDate | { start: CalendarDate | null; end: CalendarDate | null };
  onValueChange?: (
    value: CalendarDate | { start: CalendarDate | null; end: CalendarDate | null },
  ) => void;
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
  maxWidth: 'calc(100vw - 32px)',
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
  const [monthDirection, setMonthDirection] = useState<1 | -1>(1);
  const focused = state.focused;
  const monthGrids = useMemo(() => {
    const grids = [];
    for (let i = 0; i < months; i++) {
      const d = navigateMonth(focused, i);
      grids.push(
        generateMonthGrid(d.year, d.month, state, {
          locale,
          minValue,
          maxValue,
          isDateUnavailable,
        }),
      );
    }
    return grids;
  }, [focused, months, state, locale, minValue, maxValue, isDateUnavailable]);

  const weekStartsOn = monthGrids[0]?.weekStartsOn ?? 0;
  const weekdays = getWeekdayLabels(locale, weekStartsOn);

  const focusPending = useRef(false);
  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).getAttribute('role') !== 'gridcell') return;
    const next = navigateGrid(state.focused, e.key, weekStartsOn, locale);
    if (next !== state.focused) {
      e.preventDefault();
      focusPending.current = true;
      setState({ ...state, focused: next });
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const disabled =
        (minValue && state.focused.compare(minValue) < 0) ||
        (maxValue && state.focused.compare(maxValue) > 0) ||
        isDateUnavailable?.(state.focused);
      if (!disabled) setState(selectDate(state, state.focused));
    }
  };

  const dayStyle = (cell: CalendarDayCell): CSSProperties => ({
    width: '100%',
    maxWidth: compVar('date-picker-modal', 'date-container-width'),
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
    <div data-testid="calendar-grid">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: compVar('list', 'divider-leading-space'),
        }}
      >
        <IconButton
          aria-label={prevMonth}
          icon={<Icon name="chevron_left" />}
          variant="standard"
          onClick={() => {
            setMonthDirection(-1);
            setState({ ...state, focused: navigateMonth(focused, -1) });
          }}
        />
        <span
          style={{
            ...typeStyle('title-small'),
            color: compVar('date-picker-modal', 'range-selection-month-subhead-color'),
          }}
        >
          {new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
            new Date(focused.year, focused.month - 1, 1),
          )}
        </span>
        <IconButton
          aria-label={nextMonth}
          icon={<Icon name="chevron_right" />}
          variant="standard"
          onClick={() => {
            setMonthDirection(1);
            setState({ ...state, focused: navigateMonth(focused, 1) });
          }}
        />
      </div>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={`${focused.year}-${focused.month}`}
          initial={{ opacity: 0, x: monthDirection * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -monthDirection * 24 }}
          transition={{ ...springs.defaultSpatial, opacity: springs.defaultEffects }}
          style={{
            display: 'flex',
            gap: compVar('list', 'divider-leading-space'),
            paddingInline: compVar('list', 'divider-leading-space'),
          }}
        >
          {monthGrids.map((grid, gi) => (
            <div
              key={gi}
              role="grid"
              aria-label="Calendar"
              onKeyDown={onKeyDown}
              style={{ flex: 1, minWidth: 0 }}
            >
              <div
                role="row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 2,
                  marginBottom: 4,
                }}
              >
                {weekdays.map((wd, weekdayIndex) => (
                  <div
                    key={`${String(weekdayIndex)}-${wd}`}
                    role="columnheader"
                    style={{
                      ...typeStyle('body-large'),
                      textAlign: 'center',
                      color: compVar('date-picker-modal', 'weekdays-label-text-color'),
                    }}
                  >
                    {wd}
                  </div>
                ))}
              </div>
              {grid.weeks.map((week, wi) => (
                <div
                  key={wi}
                  role="row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: 2,
                    marginBottom: 2,
                  }}
                >
                  {week.map((cell) => (
                    <StateLayer
                      key={cell.iso}
                      states={['hover', 'focus', 'pressed']}
                      disabled={cell.isDisabled}
                      style={{
                        width: '100%',
                        maxWidth: compVar('date-picker-modal', 'date-state-layer-width'),
                        height: compVar('date-picker-modal', 'date-state-layer-height'),
                        borderRadius: compVar('date-picker-modal', 'date-state-layer-shape'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        overflow: 'visible',
                      }}
                    >
                      <button
                        type="button"
                        role="gridcell"
                        aria-selected={cell.isSelected}
                        aria-disabled={cell.isDisabled}
                        tabIndex={cell.date.compare(state.focused) === 0 ? 0 : -1}
                        aria-label={new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(
                          new Date(cell.date.year, cell.date.month - 1, cell.date.day),
                        )}
                        ref={(node) => {
                          if (
                            node &&
                            focusPending.current &&
                            cell.isCurrentMonth &&
                            cell.date.compare(state.focused) === 0
                          ) {
                            node.focus();
                            focusPending.current = false;
                          }
                        }}
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
                    </StateLayer>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function validSelection(
  selection: CalendarSelectionState['selected'],
  min?: CalendarDate,
  max?: CalendarDate,
  unavailable?: (date: CalendarDate) => boolean,
): boolean {
  const valid = (date: CalendarDate | null) =>
    date !== null &&
    (!min || date.compare(min) >= 0) &&
    (!max || date.compare(max) <= 0) &&
    !unavailable?.(date);
  if (selection instanceof CalendarDate) return valid(selection);
  if (Array.isArray(selection)) return false;
  return (
    valid(selection.start) && valid(selection.end) && selection.start!.compare(selection.end!) <= 0
  );
}

function CalendarHeader({
  date,
  locale,
  range,
}: {
  date: CalendarDate;
  locale: string;
  range?: boolean;
}) {
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
      <div
        style={{
          ...typeStyle('label-large'),
          color: compVar('date-picker-modal', 'header-supporting-text-color'),
        }}
      >
        {new Intl.DateTimeFormat(locale, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }).format(jsDate)}
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
  const [inputValidity, setInputValidity] = useState({ start: true, end: true });
  const calendarModeLabel = useM3Message('datePicker.calendarMode');
  const inputModeLabel = useM3Message('datePicker.inputMode');
  const okLabel = useM3Message('common.ok');
  const { direction } = useM3();

  const focused =
    state.selected instanceof CalendarDate
      ? state.selected
      : state.mode === 'range' && typeof state.selected === 'object' && 'start' in state.selected
        ? (state.selected.start ?? state.focused)
        : state.focused;

  return (
    <>
      <CalendarHeader date={focused} locale={locale} range={state.mode === 'range'} />
      {state.mode === 'range' && 'start' in state.selected && (
        <p aria-live="polite" style={{ margin: 0, paddingInline: 16 }}>
          {state.selected.start ? formatCalendarDate(state.selected.start, locale) : 'Start date'} –{' '}
          {state.selected.end ? formatCalendarDate(state.selected.end, locale) : 'End date'}
        </p>
      )}
      <AnimatePresence mode="wait">
        {inputMode === 'calendar' ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: direction === 'rtl' ? 16 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'rtl' ? -16 : 16 }}
            transition={{ ...springs.defaultSpatial, opacity: springs.defaultEffects }}
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
            transition={{ ...springs.defaultSpatial, opacity: springs.defaultEffects }}
            style={{ padding: compVar('list', 'divider-leading-space') }}
          >
            {state.mode === 'range' && 'start' in state.selected ? (
              <div style={{ display: 'grid', gap: 16 }}>
                <DateInput
                  onValidityChange={(valid) =>
                    setInputValidity((previous) => ({ ...previous, start: valid }))
                  }
                  label="Start date"
                  value={state.selected.start}
                  onValueChange={(date) =>
                    setState({
                      ...state,
                      selected: {
                        ...(state.selected as {
                          start: CalendarDate | null;
                          end: CalendarDate | null;
                        }),
                        start: date,
                      },
                    })
                  }
                  minValue={minValue}
                  maxValue={maxValue}
                  isDateUnavailable={isDateUnavailable}
                  locale={locale}
                />
                <DateInput
                  onValidityChange={(valid) =>
                    setInputValidity((previous) => ({ ...previous, end: valid }))
                  }
                  label="End date"
                  value={state.selected.end}
                  onValueChange={(date) =>
                    setState({
                      ...state,
                      selected: {
                        ...(state.selected as {
                          start: CalendarDate | null;
                          end: CalendarDate | null;
                        }),
                        end: date,
                      },
                    })
                  }
                  minValue={state.selected.start ?? minValue}
                  maxValue={maxValue}
                  isDateUnavailable={isDateUnavailable}
                  locale={locale}
                />
              </div>
            ) : (
              <DateInput
                onValidityChange={(valid) => setInputValidity({ start: valid, end: true })}
                label="Date"
                value={state.selected instanceof CalendarDate ? state.selected : null}
                onValueChange={(date) => {
                  if (date) setState(selectDate(state, date));
                  else setInputValidity({ start: false, end: true });
                }}
                minValue={minValue}
                maxValue={maxValue}
                isDateUnavailable={isDateUnavailable}
                locale={locale}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: compVar('list', 'divider-leading-space'),
        }}
      >
        <Button
          variant="text"
          onClick={() => {
            setInputValidity({ start: true, end: true });
            setInputMode(inputMode === 'calendar' ? 'input' : 'calendar');
          }}
        >
          {inputMode === 'calendar' ? inputModeLabel : calendarModeLabel}
        </Button>
        {onConfirm && (
          <Button
            variant="text"
            disabled={
              !validSelection(state.selected, minValue, maxValue, isDateUnavailable) ||
              (inputMode === 'input' && (!inputValidity.start || !inputValidity.end))
            }
            onClick={onConfirm}
          >
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
  const selectLabel = useM3Message(
    mode === 'range' ? 'datePicker.selectDateRange' : 'datePicker.selectDate',
  );

  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isOpen = open ?? internalOpen;
  const setOpen = useCallback(
    (v: boolean) => {
      if (open === undefined) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [open, onOpenChange],
  );

  const [inputMode, setInputMode] = useState<DatePickerInputMode>(
    variant === 'modal-input' ? 'input' : initialInputMode,
  );
  const [committed, setCommitted] = useState(defaultValue);
  const [state, setState] = useState<CalendarSelectionState>(() =>
    createInitialCalendarState(mode, value ?? defaultValue),
  );

  const [previous, setPrevious] = useState({ value, isOpen, mode });
  if (previous.value !== value || previous.mode !== mode || (isOpen && !previous.isOpen)) {
    setPrevious({ value, isOpen, mode });
    setState(createInitialCalendarState(mode, value ?? committed));
  } else if (previous.isOpen !== isOpen) {
    setPrevious({ value, isOpen, mode });
  }
  const commit = (selection: CalendarSelectionState['selected']) => {
    if (selection instanceof CalendarDate || (!Array.isArray(selection) && 'start' in selection)) {
      if (value === undefined) setCommitted(selection);
      onValueChange?.(selection);
    }
  };
  const updateState = (next: CalendarSelectionState) => {
    setState(next);
    if (
      variant === 'docked' &&
      next.selected !== state.selected &&
      validSelection(next.selected, minValue, maxValue, isDateUnavailable)
    )
      commit(next.selected);
  };

  const months = 1;

  const displayValue = useMemo(() => {
    if (value instanceof CalendarDate) return formatCalendarDate(value, locale);
    if (value && typeof value === 'object' && 'start' in value) {
      const { start, end } = value;
      if (start && end)
        return `${formatCalendarDate(start, locale)} – ${formatCalendarDate(end, locale)}`;
      if (start) return formatCalendarDate(start, locale);
    }
    if (committed instanceof CalendarDate) return formatCalendarDate(committed, locale);
    if (committed && 'start' in committed && committed.start)
      return `${formatCalendarDate(committed.start, locale)}${committed.end ? ` – ${formatCalendarDate(committed.end, locale)}` : ''}`;
    return '';
  }, [value, committed, locale]);

  const handleConfirm = () => {
    if (validSelection(state.selected, minValue, maxValue, isDateUnavailable)) {
      commit(state.selected);
      setOpen(false);
    }
  };

  const content = (
    <DatePickerContent
      key={`${isOpen}-${value instanceof CalendarDate ? value.toString() : value ? `${value.start?.toString()}:${value.end?.toString()}` : 'uncontrolled'}`}
      state={state}
      setState={updateState}
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

  const triggerNode = trigger ?? (
    <Button variant="outlined" aria-label={selectLabel}>
      {displayValue || label || selectLabel}
    </Button>
  );

  if (variant === 'docked') {
    return (
      <BasePopover.Root open={isOpen} onOpenChange={setOpen}>
        <BasePopover.Trigger render={triggerNode as React.ReactElement} />
        <BasePopover.Portal>
          <M3PortalScope>
            <BasePopover.Positioner sideOffset={4}>
              <PopupMotion>
                <BasePopover.Popup
                  className={className}
                  data-testid={testId}
                  style={calendarPopupStyle}
                >
                  {content}
                </BasePopover.Popup>
              </PopupMotion>
            </BasePopover.Positioner>
          </M3PortalScope>
        </BasePopover.Portal>
      </BasePopover.Root>
    );
  }

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
            <OverlayMotion style={calendarPopupStyle}>{content}</OverlayMotion>
          </BaseDialog.Popup>
        </M3PortalScope>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export type { CalendarSelectionMode };
