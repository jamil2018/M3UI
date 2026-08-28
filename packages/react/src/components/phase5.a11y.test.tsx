import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { M3Provider } from '../provider/m3-provider.js';
import { CalendarDate } from '@internationalized/date';
import { DateInput } from './date-input.js';
import { DatePicker } from './date-picker.js';
import { TimePicker } from './time-picker.js';
import { PaneScaffold, PaneScaffoldRoot } from './pane-scaffold.js';
import { AdaptiveNavigation, resolveAdaptiveNavMode } from './adaptive-navigation.js';
import { WindowSizeClassProvider } from '../lib/window-size-class.js';
import { Button } from './button.js';
import { List, ListItem } from './list.js';

const DESTINATIONS = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'search', label: 'Search', icon: '🔍', badge: 2 },
  { value: 'settings', label: 'Settings', icon: '⚙️' },
];

describe('DateInput', () => {
  it('renders with label', () => {
    renderWithM3(<DateInput label="Birth date" data-testid="date-input" />);
    expect(screen.getByText('Birth date')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = renderWithM3(<DateInput label="Date" data-testid="date-input-a11y" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('DatePicker', () => {
  it('opens docked picker on trigger click', async () => {
    renderWithM3(
      <WindowSizeClassProvider defaultSizeClass="compact">
        <DatePicker variant="docked" defaultOpen={false} data-testid="date-picker" />
      </WindowSizeClassProvider>,
    );
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByTestId('calendar-grid')).toBeInTheDocument();
    });
  });

  it('supports keyboard navigation in calendar', async () => {
    renderWithM3(
      <WindowSizeClassProvider defaultSizeClass="compact">
        <DatePicker variant="modal" defaultOpen data-testid="date-picker-kb" />
      </WindowSizeClassProvider>,
    );
    const grid = screen.getByTestId('calendar-grid');
    fireEvent.keyDown(grid, { key: 'ArrowRight' });
    fireEvent.keyDown(grid, { key: 'Enter' });
    expect(grid).toBeInTheDocument();
  });

  it('renders in RTL', () => {
    renderWithM3(
      <M3Provider direction="rtl">
        <WindowSizeClassProvider defaultSizeClass="compact">
          <DatePicker variant="modal" defaultOpen data-testid="date-picker-rtl" />
        </WindowSizeClassProvider>
      </M3Provider>,
    );
    expect(screen.getByTestId('calendar-grid')).toBeInTheDocument();
  });

  it('has no a11y violations when open', async () => {
    const { container } = renderWithM3(
      <WindowSizeClassProvider defaultSizeClass="compact">
        <DatePicker variant="modal" defaultOpen data-testid="date-picker-a11y" />
      </WindowSizeClassProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('TimePicker', () => {
  it('opens and shows dial', async () => {
    renderWithM3(<TimePicker variant="dial" defaultOpen data-testid="time-picker" />);
    expect(screen.getByTestId('time-dial')).toBeInTheDocument();
  });

  it('supports dial keyboard navigation', () => {
    renderWithM3(<TimePicker variant="dial" defaultOpen data-testid="time-picker-kb" />);
    const dial = screen.getByTestId('time-dial');
    fireEvent.keyDown(dial, { key: 'ArrowUp' });
    fireEvent.keyDown(dial, { key: 'Enter' });
    expect(dial).toBeInTheDocument();
  });

  it('switches to input mode', async () => {
    renderWithM3(<TimePicker variant="dial" defaultOpen data-testid="time-picker-input" />);
    fireEvent.click(screen.getByRole('button', { name: /Switch to text input/i }));
    await waitFor(() => {
      expect(screen.getByTestId('time-input-fields')).toBeInTheDocument();
    });
  });

  it('renders in RTL', () => {
    renderWithM3(
      <M3Provider direction="rtl">
        <TimePicker variant="input" defaultOpen data-testid="time-picker-rtl" />
      </M3Provider>,
    );
    expect(screen.getByTestId('time-input-fields')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = renderWithM3(<TimePicker variant="input" defaultOpen data-testid="time-picker-a11y" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('PaneScaffold', () => {
  it('renders list pane', () => {
    renderWithM3(
      <PaneScaffoldRoot defaultSizeClass="compact">
        <PaneScaffold
          list={<List><ListItem headline="Item 1" /></List>}
          detail={<p>Detail content</p>}
          data-testid="pane-scaffold"
        />
      </PaneScaffoldRoot>,
    );
    expect(screen.getByTestId('pane-list')).toBeInTheDocument();
  });

  it('shows back button on compact detail', () => {
    renderWithM3(
      <PaneScaffoldRoot defaultSizeClass="compact">
        <PaneScaffold
          list={<List><ListItem headline="Item 1" /></List>}
          detail={<p>Detail</p>}
          defaultShowDetail
          data-testid="pane-scaffold-back"
        />
      </PaneScaffoldRoot>,
    );
    expect(screen.getByTestId('pane-back')).toBeInTheDocument();
  });
});

describe('AdaptiveNavigation', () => {
  it('uses navigation bar on compact', () => {
    renderWithM3(<AdaptiveNavigation destinations={DESTINATIONS} mode="bar" data-testid="adaptive-nav" />);
    expect(screen.getByTestId('adaptive-nav-bar')).toBeInTheDocument();
  });

  it('uses rail on medium', () => {
    renderWithM3(<AdaptiveNavigation destinations={DESTINATIONS} mode="rail" data-testid="adaptive-nav-rail" />);
    expect(screen.getByTestId('adaptive-nav-rail-rail')).toBeInTheDocument();
  });

  it('uses drawer on large', () => {
    renderWithM3(<AdaptiveNavigation destinations={DESTINATIONS} mode="drawer" data-testid="adaptive-nav-drawer" />);
    expect(screen.getByTestId('adaptive-nav-drawer-drawer')).toBeInTheDocument();
  });

  it('renders in RTL', () => {
    renderWithM3(
      <M3Provider direction="rtl">
        <AdaptiveNavigation destinations={DESTINATIONS} mode="bar" data-testid="adaptive-nav-rtl" />
      </M3Provider>,
    );
    expect(screen.getByTestId('adaptive-nav-rtl-bar')).toBeInTheDocument();
  });

  it('resolveAdaptiveNavMode maps size classes', () => {
    expect(resolveAdaptiveNavMode('compact')).toBe('bar');
    expect(resolveAdaptiveNavMode('medium')).toBe('rail');
    expect(resolveAdaptiveNavMode('large')).toBe('drawer');
  });
});

describe('i18n overrides', () => {
  it('uses custom messages from provider', () => {
    renderWithM3(
      <M3Provider messages={{ 'datePicker.selectDate': 'Pick a day' }}>
        <DatePicker variant="docked" trigger={<Button>Open</Button>} />
      </M3Provider>,
    );
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });
});
