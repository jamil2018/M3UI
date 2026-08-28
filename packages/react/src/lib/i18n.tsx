import { createContext, useContext, useMemo, type ReactNode } from 'react';

/**
 * Documented message keys for built-in M3 UI strings.
 * Override via `M3Provider messages={{ 'datePicker.selectDate': '...' }}`.
 */
export const M3_MESSAGE_KEYS = [
  'common.cancel',
  'common.ok',
  'common.dismiss',
  'common.navigateBack',
  'common.nextMonth',
  'common.previousMonth',
  'common.nextYear',
  'common.previousYear',
  'datePicker.selectDate',
  'datePicker.selectDateRange',
  'datePicker.startDate',
  'datePicker.endDate',
  'datePicker.calendarMode',
  'datePicker.inputMode',
  'datePicker.today',
  'dateInput.invalidDate',
  'dateInput.placeholder',
  'timePicker.selectTime',
  'timePicker.hour',
  'timePicker.minute',
  'timePicker.am',
  'timePicker.pm',
  'timePicker.dialMode',
  'timePicker.inputMode',
  'pane.back',
  'adaptiveNav.openDrawer',
] as const;

export type M3MessageKey = (typeof M3_MESSAGE_KEYS)[number];

export type M3Messages = Partial<Record<M3MessageKey, string>>;

const ENGLISH_DEFAULTS: Record<M3MessageKey, string> = {
  'common.cancel': 'Cancel',
  'common.ok': 'OK',
  'common.dismiss': 'Dismiss',
  'common.navigateBack': 'Navigate back',
  'common.nextMonth': 'Next month',
  'common.previousMonth': 'Previous month',
  'common.nextYear': 'Next year',
  'common.previousYear': 'Previous year',
  'datePicker.selectDate': 'Select date',
  'datePicker.selectDateRange': 'Select date range',
  'datePicker.startDate': 'Start date',
  'datePicker.endDate': 'End date',
  'datePicker.calendarMode': 'Switch to calendar',
  'datePicker.inputMode': 'Switch to text input',
  'datePicker.today': 'Today',
  'dateInput.invalidDate': 'Enter a valid date',
  'dateInput.placeholder': 'MM/DD/YYYY',
  'timePicker.selectTime': 'Select time',
  'timePicker.hour': 'Hour',
  'timePicker.minute': 'Minute',
  'timePicker.am': 'AM',
  'timePicker.pm': 'PM',
  'timePicker.dialMode': 'Switch to clock dial',
  'timePicker.inputMode': 'Switch to text input',
  'pane.back': 'Back',
  'adaptiveNav.openDrawer': 'Open navigation menu',
};

export interface M3I18nContextValue {
  locale: string;
  messages: Record<M3MessageKey, string>;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}

const M3I18nContext = createContext<M3I18nContextValue | null>(null);

export interface M3I18nProviderProps {
  locale?: string;
  messages?: M3Messages;
  children: ReactNode;
}

export function M3I18nProvider({ locale = 'en-US', messages, children }: M3I18nProviderProps) {
  const value = useMemo<M3I18nContextValue>(() => {
    const merged = { ...ENGLISH_DEFAULTS, ...messages };
    return {
      locale,
      messages: merged,
      formatDate: (date, options) =>
        new Intl.DateTimeFormat(locale, options ?? { dateStyle: 'medium' }).format(date),
      formatTime: (date, options) =>
        new Intl.DateTimeFormat(locale, options ?? { timeStyle: 'short' }).format(date),
      formatNumber: (value, options) => new Intl.NumberFormat(locale, options).format(value),
    };
  }, [locale, messages]);

  return <M3I18nContext.Provider value={value}>{children}</M3I18nContext.Provider>;
}

export function useM3I18n(): M3I18nContextValue {
  const ctx = useContext(M3I18nContext);
  if (!ctx) {
    return {
      locale: 'en-US',
      messages: ENGLISH_DEFAULTS,
      formatDate: (date, options) =>
        new Intl.DateTimeFormat('en-US', options ?? { dateStyle: 'medium' }).format(date),
      formatTime: (date, options) =>
        new Intl.DateTimeFormat('en-US', options ?? { timeStyle: 'short' }).format(date),
      formatNumber: (value, options) => new Intl.NumberFormat('en-US', options).format(value),
    };
  }
  return ctx;
}

export function useM3Message(key: M3MessageKey): string {
  return useM3I18n().messages[key];
}

/** Resolve locale week start (0 = Sunday, 1 = Monday, …). */
export function getWeekStart(locale: string): number {
  try {
    const info = new Intl.Locale(locale).weekInfo;
    if (info?.firstDay != null) {
      return info.firstDay === 7 ? 0 : info.firstDay;
    }
  } catch {
    /* Intl.Locale.weekInfo may be unavailable */
  }
  return locale.startsWith('en-US') ? 0 : 1;
}

export { ENGLISH_DEFAULTS };
