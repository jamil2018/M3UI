import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { CalendarDate } from '@internationalized/date';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { SearchBar } from './search.js';
import { DatePicker } from './date-picker.js';
import { NavigationBar } from './navigation-bar.js';
import { AdaptiveNavigation } from './adaptive-navigation.js';
import { Checkbox, CheckboxGroup } from './checkbox.js';

describe('checkbox group visual state', () => {
  it('tracks default selection, controlled updates, and group disability', () => {
    const { rerender } = renderWithM3(
      <CheckboxGroup defaultValue={['a']}>
        <Checkbox value="a" label="Alpha" />
      </CheckboxGroup>,
    );
    const checkbox = () => screen.getByRole('checkbox', { name: 'Alpha' });
    expect(checkbox()).toBeChecked();
    expect(checkbox().querySelector('svg')).not.toBeNull();
    rerender(
      <CheckboxGroup key="controlled" value={[]}>
        <Checkbox value="a" label="Alpha" />
      </CheckboxGroup>,
    );
    expect(checkbox()).not.toBeChecked();
    rerender(
      <CheckboxGroup key="controlled" value={['a']} disabled>
        <Checkbox value="a" label="Alpha" />
      </CheckboxGroup>,
    );
    expect(checkbox()).toBeChecked();
    expect(checkbox()).toHaveAttribute('aria-disabled', 'true');
    expect(checkbox().querySelector('svg')).not.toBeNull();
    expect(checkbox().style.background).toContain('color-mix');
  });
});

const destinations = ['Home', 'Search', 'Library'].map((label) => ({
  value: label,
  label,
  icon: <span aria-hidden>icon</span>,
}));
describe('usable input and navigation', () => {
  it('submits the current uncontrolled search text and disables submission', () => {
    const onSearch = vi.fn();
    const { rerender } = renderWithM3(<SearchBar onSearch={onSearch} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'updated query' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledWith('updated query');
    rerender(<SearchBar disabled onSearch={onSearch} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });
  it('names icon-only destinations and exposes the current page', () => {
    renderWithM3(<NavigationBar destinations={destinations} iconOnly />);
    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('button', { name: 'Library' }));
    expect(screen.getByRole('button', { name: 'Library' })).toHaveAttribute('aria-current', 'page');
  });
  it('retains navigation selection when the layout changes', async () => {
    const { rerender } = renderWithM3(
      <AdaptiveNavigation destinations={destinations} mode="bar" />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Library' }));
    rerender(<AdaptiveNavigation destinations={destinations} mode="rail" />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Library' })).toHaveAttribute(
        'aria-current',
        'page',
      ),
    );
  });
  it('initializes controlled calendars and notifies docked selections', () => {
    const onValueChange = vi.fn();
    renderWithM3(
      <DatePicker
        defaultOpen
        value={new CalendarDate(2026, 11, 14)}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole('gridcell', { name: 'Saturday, November 14, 2026' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    fireEvent.click(screen.getByRole('gridcell', { name: 'Sunday, November 15, 2026' }));
    expect(onValueChange.mock.calls[0][0].toString()).toBe('2026-11-15');
  });
  it('moves actual calendar focus and prevents unavailable keyboard selection', () => {
    const onValueChange = vi.fn();
    renderWithM3(
      <DatePicker
        defaultOpen
        defaultValue={new CalendarDate(2026, 11, 14)}
        maxValue={new CalendarDate(2026, 11, 14)}
        onValueChange={onValueChange}
      />,
    );
    const day = screen.getByRole('gridcell', { name: 'Saturday, November 14, 2026' });
    day.focus();
    fireEvent.keyDown(day, { key: 'ArrowRight' });
    expect(screen.getByRole('gridcell', { name: 'Sunday, November 15, 2026' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole('button', { name: 'Next month' }), { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

// Date text must remain editable while incomplete; invalid input never becomes a selection.
import { DateInput, parseInputValue } from './date-input.js';
import { TimePicker } from './time-picker.js';
it('preserves incomplete controlled date text and rejects dates outside bounds', () => {
  const changed = vi.fn();
  renderWithM3(
    <DateInput
      label="Date"
      value={null}
      minValue={new CalendarDate(2026, 1, 1)}
      onValueChange={changed}
    />,
  );
  const input = screen.getByRole('textbox', { name: 'Date' });
  fireEvent.change(input, { target: { value: '1' } });
  expect(input).toHaveValue('1');
  expect(changed).not.toHaveBeenCalled();
  expect(parseInputValue('1', 'en-US')).toBeNull();
  fireEvent.change(input, { target: { value: '12/25/2025' } });
  expect(changed).not.toHaveBeenCalled();
  fireEvent.change(input, { target: { value: '12/25/2026' } });
  expect(changed.mock.calls[0][0].toString()).toBe('2026-12-25');
});
it('renders minute dial labels and ignores unrelated keys', () => {
  const changed = vi.fn();
  renderWithM3(
    <TimePicker
      defaultOpen
      defaultValue={{ hour: 12, minute: 30, period: 'AM' }}
      onValueChange={changed}
    />,
  );
  const dial = screen.getByRole('slider', { name: 'Hour' });
  fireEvent.keyDown(dial, { key: 'Tab' });
  expect(changed).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Minute', exact: true }));
  expect(screen.getByRole('slider', { name: 'Minute' })).toHaveTextContent('55');
});
it('blocks date confirmation when visible draft is invalid or empty', () => {
  const changed = vi.fn();
  renderWithM3(
    <DatePicker
      variant="modal-input"
      defaultOpen
      defaultValue={new CalendarDate(2026, 11, 14)}
      onValueChange={changed}
    />,
  );
  const input = screen.getByRole('textbox', { name: 'Date' });
  fireEvent.change(input, { target: { value: '02/31/2026' } });
  expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled();
  fireEvent.change(input, { target: { value: '' } });
  expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled();
  expect(changed).not.toHaveBeenCalled();
});
it('recovers from an invalid date draft by switching input modes', () => {
  renderWithM3(
    <DatePicker variant="modal-input" defaultOpen defaultValue={new CalendarDate(2026, 11, 14)} />,
  );
  fireEvent.change(screen.getByRole('textbox', { name: 'Date' }), {
    target: { value: '02/31/2026' },
  });
  expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: /Switch to calendar/i }));
  fireEvent.click(screen.getByRole('button', { name: /Switch to text input/i }));
  expect(screen.getByRole('button', { name: 'OK' })).toBeEnabled();
});
