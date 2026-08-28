import { describe, it, expect } from 'vitest';
import {
  CalendarDate,
  generateMonthGrid,
  navigateGrid,
  navigateMonth,
  selectDate,
  createInitialCalendarState,
  getWeekdayLabels,
} from '../lib/calendar-engine.js';
import { getWeekStart } from '../lib/i18n.js';

describe('calendar engine', () => {
  it('generates a month grid with leading/trailing days', () => {
    const state = createInitialCalendarState('single', new CalendarDate(2024, 3, 15));
    const grid = generateMonthGrid(2024, 3, state, { locale: 'en-US' });
    expect(grid.weeks.length).toBeGreaterThanOrEqual(4);
    const allDays = grid.weeks.flat();
    expect(allDays.every((d) => d.date instanceof CalendarDate)).toBe(true);
    expect(allDays.some((d) => !d.isCurrentMonth)).toBe(true);
  });

  it('respects locale week start', () => {
    const usStart = getWeekStart('en-US');
    const deStart = getWeekStart('de-DE');
    expect(usStart).toBe(0);
    expect(deStart).toBe(1);
    const state = createInitialCalendarState('single', new CalendarDate(2024, 1, 1));
    const usGrid = generateMonthGrid(2024, 1, state, { locale: 'en-US', weekStartsOn: usStart });
    const deGrid = generateMonthGrid(2024, 1, state, { locale: 'de-DE', weekStartsOn: deStart });
    expect(usGrid.weekStartsOn).toBe(0);
    expect(deGrid.weekStartsOn).toBe(1);
  });

  it('handles range selection', () => {
    let state = createInitialCalendarState('range');
    state = selectDate(state, new CalendarDate(2024, 6, 10));
    expect(state.selected).toEqual({ start: new CalendarDate(2024, 6, 10), end: null });
    state = selectDate(state, new CalendarDate(2024, 6, 20));
    expect(state.selected).toEqual({
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    });
  });

  it('reverses range when second date is earlier', () => {
    let state = createInitialCalendarState('range');
    state = selectDate(state, new CalendarDate(2024, 6, 20));
    state = selectDate(state, new CalendarDate(2024, 6, 10));
    expect(state.selected).toEqual({
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    });
  });

  it('disables dates outside min/max', () => {
    const state = createInitialCalendarState('single', new CalendarDate(2024, 6, 15));
    const grid = generateMonthGrid(2024, 6, state, {
      minValue: new CalendarDate(2024, 6, 10),
      maxValue: new CalendarDate(2024, 6, 20),
    });
    const day5 = grid.weeks.flat().find((d) => d.dayOfMonth === 5 && d.isCurrentMonth);
    const day15 = grid.weeks.flat().find((d) => d.dayOfMonth === 15 && d.isCurrentMonth);
    expect(day5?.isDisabled).toBe(true);
    expect(day15?.isDisabled).toBe(false);
  });

  it('navigates grid with arrow keys', () => {
    const focused = new CalendarDate(2024, 6, 15);
    const next = navigateGrid(focused, 'ArrowRight', 0, 'en-US');
    expect(next.day).toBe(16);
    const prevWeek = navigateGrid(focused, 'ArrowUp', 0, 'en-US');
    expect(prevWeek.day).toBe(8);
  });

  it('navigates months', () => {
    const d = new CalendarDate(2024, 6, 15);
    const next = navigateMonth(d, 1);
    expect(next.month).toBe(7);
    expect(next.year).toBe(2024);
    const prev = navigateMonth(d, -1);
    expect(prev.month).toBe(5);
  });

  it('returns 7 weekday labels', () => {
    expect(getWeekdayLabels('en-US', 0)).toHaveLength(7);
  });
});

describe('window size class', () => {
  it('maps widths to size classes', async () => {
    const { widthToSizeClass } = await import('../lib/window-size-class.js');
    expect(widthToSizeClass(400)).toBe('compact');
    expect(widthToSizeClass(700)).toBe('medium');
    expect(widthToSizeClass(900)).toBe('expanded');
    expect(widthToSizeClass(1300)).toBe('large');
    expect(widthToSizeClass(1700)).toBe('extra-large');
  });
});

describe('i18n', () => {
  it('exports documented message keys', async () => {
    const { M3_MESSAGE_KEYS, ENGLISH_DEFAULTS } = await import('../lib/i18n.js');
    expect(M3_MESSAGE_KEYS.length).toBeGreaterThan(10);
    for (const key of M3_MESSAGE_KEYS) {
      expect(ENGLISH_DEFAULTS[key]).toBeTruthy();
    }
  });
});
