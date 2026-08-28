import {
  CalendarDate,
  endOfMonth,
  getDayOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  today,
  type DateDuration,
} from '@internationalized/date';
import { getWeekStart } from './i18n.js';

export type CalendarSelectionMode = 'single' | 'range' | 'multiple';

export interface CalendarDayCell {
  date: CalendarDate;
  iso: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isRangePreview: boolean;
}

export interface CalendarMonthGrid {
  year: number;
  month: number;
  weekStartsOn: number;
  weeks: CalendarDayCell[][];
}

export interface CalendarEngineOptions {
  locale?: string;
  weekStartsOn?: number;
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
  isDateUnavailable?: (date: CalendarDate) => boolean;
}

export interface CalendarSelectionState {
  mode: CalendarSelectionMode;
  selected: CalendarDate | CalendarDate[] | { start: CalendarDate | null; end: CalendarDate | null };
  focused: CalendarDate;
  anchorDate: CalendarDate | null;
  hoverDate: CalendarDate | null;
}

function toIso(date: CalendarDate): string {
  return `${String(date.year).padStart(4, '0')}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}

function isDisabled(
  date: CalendarDate,
  options: CalendarEngineOptions,
): boolean {
  if (options.minValue && date.compare(options.minValue) < 0) return true;
  if (options.maxValue && date.compare(options.maxValue) > 0) return true;
  return options.isDateUnavailable?.(date) ?? false;
}

function isInRange(
  date: CalendarDate,
  start: CalendarDate | null,
  end: CalendarDate | null,
): boolean {
  if (!start || !end) return false;
  const [lo, hi] = start.compare(end) <= 0 ? [start, end] : [end, start];
  return date.compare(lo) >= 0 && date.compare(hi) <= 0;
}

function isRangePreview(
  date: CalendarDate,
  anchor: CalendarDate | null,
  hover: CalendarDate | null,
): boolean {
  if (!anchor || !hover || isSameDay(anchor, hover)) return false;
  return isInRange(date, anchor, hover);
}

export function generateMonthGrid(
  year: number,
  month: number,
  selection: CalendarSelectionState,
  options: CalendarEngineOptions = {},
): CalendarMonthGrid {
  const locale = options.locale ?? 'en-US';
  const weekStartsOn = options.weekStartsOn ?? getWeekStart(locale);
  const monthStart = startOfMonth(new CalendarDate(year, month, 1));
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, locale, weekStartsOn);
  const weeks: CalendarDayCell[][] = [];
  let cursor = gridStart;

  while (cursor.compare(monthEnd) <= 0 || weeks.length === 0 || weeks[weeks.length - 1]!.length < 7) {
    const week: CalendarDayCell[] = [];
    for (let i = 0; i < 7; i++) {
      const date = cursor;
      let isSelected = false;
      let isRangeStart = false;
      let isRangeEnd = false;
      let inRange = false;

      if (selection.mode === 'single' && selection.selected instanceof CalendarDate) {
        isSelected = isSameDay(date, selection.selected);
      } else if (selection.mode === 'multiple' && Array.isArray(selection.selected)) {
        isSelected = selection.selected.some((d) => isSameDay(d, date));
      } else if (selection.mode === 'range' && typeof selection.selected === 'object' && selection.selected !== null && 'start' in selection.selected) {
        const { start, end } = selection.selected;
        isRangeStart = start != null && isSameDay(date, start);
        isRangeEnd = end != null && isSameDay(date, end);
        inRange = isInRange(date, start, end);
        isSelected = isRangeStart || isRangeEnd;
      }

      const preview = selection.mode === 'range' && isRangePreview(date, selection.anchorDate, selection.hoverDate);

      week.push({
        date,
        iso: toIso(date),
        dayOfMonth: date.day,
        isCurrentMonth: isSameMonth(date, monthStart),
        isToday: isToday(date, 'UTC'),
        isDisabled: isDisabled(date, options),
        isSelected,
        isRangeStart,
        isRangeEnd,
        isInRange: inRange && !isSelected,
        isRangePreview: preview && !isSelected && !inRange,
      });
      cursor = cursor.add({ days: 1 });
    }
    weeks.push(week);
    if (weeks.length > 6) break;
  }

  return { year, month, weekStartsOn, weeks };
}

export function getWeekdayLabels(locale: string, weekStartsOn: number): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
  const labels: string[] = [];
  for (let i = 0; i < 7; i++) {
    const dayIndex = (weekStartsOn + i) % 7;
    const d = new Date(Date.UTC(2024, 0, 7 + dayIndex));
    labels.push(formatter.format(d));
  }
  return labels;
}

export function navigateMonth(
  current: CalendarDate,
  delta: number,
): CalendarDate {
  return current.add({ months: delta });
}

export function navigateYear(
  current: CalendarDate,
  delta: number,
): CalendarDate {
  return current.add({ years: delta });
}

export function navigateGrid(
  focused: CalendarDate,
  key: string,
  weekStartsOn: number,
  locale: string,
): CalendarDate {
  const duration: DateDuration = {};
  switch (key) {
    case 'ArrowLeft':
      duration.days = -1;
      break;
    case 'ArrowRight':
      duration.days = 1;
      break;
    case 'ArrowUp':
      duration.weeks = -1;
      break;
    case 'ArrowDown':
      duration.weeks = 1;
      break;
    case 'PageUp':
      duration.months = -1;
      break;
    case 'PageDown':
      duration.months = 1;
      break;
    case 'Home':
      return startOfWeek(focused, locale, weekStartsOn);
    case 'End': {
      const weekStart = startOfWeek(focused, locale, weekStartsOn);
      return weekStart.add({ days: 6 });
    }
    default:
      return focused;
  }
  return focused.add(duration);
}

export function selectDate(
  state: CalendarSelectionState,
  date: CalendarDate,
): CalendarSelectionState {
  if (state.mode === 'single') {
    return { ...state, selected: date, focused: date, anchorDate: null, hoverDate: null };
  }
  if (state.mode === 'multiple') {
    const current = Array.isArray(state.selected) ? state.selected : [];
    const exists = current.some((d) => isSameDay(d, date));
    const next = exists ? current.filter((d) => !isSameDay(d, date)) : [...current, date];
    return { ...state, selected: next, focused: date };
  }
  const range = typeof state.selected === 'object' && state.selected !== null && 'start' in state.selected
    ? state.selected
    : { start: null, end: null };
  if (!range.start || (range.start && range.end)) {
    return { ...state, selected: { start: date, end: null }, focused: date, anchorDate: date, hoverDate: null };
  }
  const [start, end] = range.start.compare(date) <= 0 ? [range.start, date] : [date, range.start];
  return { ...state, selected: { start, end }, focused: date, anchorDate: null, hoverDate: null };
}

export function createInitialCalendarState(
  mode: CalendarSelectionMode = 'single',
  defaultValue?: CalendarDate | CalendarDate[] | { start: CalendarDate | null; end: CalendarDate | null },
): CalendarSelectionState {
  const tzToday = today('UTC');
  let selected: CalendarSelectionState['selected'];
  if (mode === 'single') {
    selected = defaultValue instanceof CalendarDate ? defaultValue : tzToday;
  } else if (mode === 'multiple') {
    selected = Array.isArray(defaultValue) ? defaultValue : [];
  } else {
    selected =
      defaultValue && typeof defaultValue === 'object' && 'start' in defaultValue
        ? defaultValue
        : { start: null, end: null };
  }
  const focused =
    selected instanceof CalendarDate
      ? selected
      : Array.isArray(selected)
        ? selected[0] ?? tzToday
        : selected.start ?? tzToday;
  return { mode, selected, focused, anchorDate: null, hoverDate: null };
}

export { CalendarDate, today, getDayOfWeek, isSameDay, isSameMonth, isToday, toIso };
