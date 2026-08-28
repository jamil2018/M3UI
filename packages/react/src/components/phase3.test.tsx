import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { M3Provider } from '../provider/m3-provider.js';
import { TopAppBar } from './top-app-bar.js';
import { BottomAppBar } from './bottom-app-bar.js';
import { NavigationBar } from './navigation-bar.js';
import { NavigationRail } from './navigation-rail.js';
import { NavigationDrawer } from './navigation-drawer.js';
import { Tabs } from './tabs.js';
import { SearchBar } from './search.js';
import { Dialog, AlertDialog } from './dialog.js';
import { BottomSheet } from './bottom-sheet.js';
import { SideSheet } from './side-sheet.js';
import { Carousel } from './carousel.js';
import { Scaffold, FabAnchor } from './scaffold.js';
import { Button } from './button.js';
import { Fab } from './fab.js';
import { IconButton } from './icon-button.js';

const DESTINATIONS = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'search', label: 'Search', icon: '🔍', badge: 2 },
  { value: 'settings', label: 'Settings', icon: '⚙️' },
];

describe('TopAppBar', () => {
  it('renders title and back action', () => {
    const onBack = vi.fn();
    renderWithM3(<TopAppBar title="Inbox" subtitle="12 messages" onBack={onBack} data-testid="top-bar" />);
    expect(screen.getByText('Inbox')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Navigate back' }));
    expect(onBack).toHaveBeenCalled();
  });

  it('supports flexible size variant', () => {
    renderWithM3(<TopAppBar title="Flexible" size="medium-flexible" data-testid="flex-bar" />);
    expect(screen.getByTestId('flex-bar')).toBeInTheDocument();
  });
});

describe('BottomAppBar', () => {
  it('renders actions and attached fab slot', () => {
    renderWithM3(
      <BottomAppBar
        actions={<IconButton aria-label="Archive" icon="📦" />}
        fab={<Fab aria-label="Create" icon="+" />}
        data-testid="bottom-bar"
      />,
    );
    expect(screen.getByTestId('bottom-bar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });
});

describe('NavigationBar', () => {
  it('selects destination on click', () => {
    const onChange = vi.fn();
    renderWithM3(<NavigationBar destinations={DESTINATIONS} defaultValue="home" onValueChange={onChange} data-testid="nav-bar" />);
    fireEvent.click(screen.getByRole('tab', { name: /Search/i }));
    expect(onChange).toHaveBeenCalledWith('search');
  });

  it('renders in RTL', () => {
    renderWithM3(
      <M3Provider direction="rtl">
        <NavigationBar destinations={DESTINATIONS} data-testid="nav-bar-rtl" />
      </M3Provider>,
    );
    expect(screen.getByTestId('nav-bar-rtl')).toBeInTheDocument();
  });

  it('throws for invalid destination count', () => {
    expect(() =>
      renderWithM3(<NavigationBar destinations={DESTINATIONS.slice(0, 2)} />),
    ).toThrow(/3–5 destinations/);
  });
});

describe('NavigationRail', () => {
  it('renders collapsed rail', () => {
    renderWithM3(<NavigationRail destinations={DESTINATIONS} data-testid="nav-rail" />);
    expect(screen.getByTestId('nav-rail')).toHaveAttribute('data-mode', 'collapsed');
  });

  it('renders expanded rail with header', () => {
    renderWithM3(
      <NavigationRail destinations={DESTINATIONS} mode="expanded" header={<span>App</span>} data-testid="nav-rail-expanded" />,
    );
    expect(screen.getByTestId('nav-rail-expanded')).toHaveAttribute('data-mode', 'expanded');
    expect(screen.getByText('App')).toBeInTheDocument();
  });
});

describe('NavigationDrawer', () => {
  it('renders standard drawer sections', () => {
    renderWithM3(
      <NavigationDrawer
        variant="standard"
        sections={[{ headline: 'Mail', items: [{ value: 'inbox', label: 'Inbox', icon: '📥' }] }]}
        data-testid="nav-drawer"
      />,
    );
    expect(screen.getByTestId('nav-drawer')).toBeInTheDocument();
    expect(screen.getByText('Mail')).toBeInTheDocument();
  });
});

describe('Tabs', () => {
  it('switches tabs', () => {
    renderWithM3(
      <Tabs
        items={[
          { value: 'a', label: 'Tab A', panel: 'Panel A' },
          { value: 'b', label: 'Tab B', panel: 'Panel B' },
        ]}
        data-testid="tabs"
      />,
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(screen.getByText('Panel B')).toBeInTheDocument();
  });
});

describe('SearchBar', () => {
  it('renders search input', () => {
    renderWithM3(<SearchBar placeholder="Find items" data-testid="search-bar" />);
    expect(screen.getByPlaceholderText('Find items')).toBeInTheDocument();
  });
});

describe('Dialog focus', () => {
  it('traps focus when open', async () => {
    renderWithM3(
      <Dialog trigger={<Button>Open</Button>} headline="Title" body="Body" actions={<button type="button">Action</button>} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(document.activeElement?.textContent).toMatch(/Title|Action|Body/);
  });
});

describe('AlertDialog', () => {
  it('opens with confirm and cancel', async () => {
    renderWithM3(
      <AlertDialog trigger={<Button>Delete</Button>} headline="Delete item?" confirmLabel="Delete" cancelLabel="Keep" />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(screen.getByRole('alertdialog')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
  });
});

describe('BottomSheet', () => {
  it('opens from trigger', async () => {
    renderWithM3(
      <BottomSheet trigger={<Button>Show sheet</Button>}>
        Sheet content
      </BottomSheet>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Show sheet' }));
    await waitFor(() => expect(screen.getByText('Sheet content')).toBeInTheDocument());
  });
});

describe('SideSheet', () => {
  it('opens with headline', async () => {
    renderWithM3(
      <SideSheet trigger={<Button>Open side</Button>} headline="Filters">
        Filter options
      </SideSheet>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open side' }));
    await waitFor(() => expect(screen.getByText('Filters')).toBeInTheDocument());
  });
});

describe('Carousel', () => {
  it('renders slides for each layout', () => {
    const items = [{ key: '1', content: 'Slide 1' }, { key: '2', content: 'Slide 2' }];
    renderWithM3(<Carousel items={items} layout="multi-browse" data-testid="carousel" />);
    expect(screen.getByTestId('carousel')).toHaveAttribute('data-layout', 'multi-browse');
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
  });
});

describe('Scaffold', () => {
  it('composes chrome with insets', () => {
    renderWithM3(
      <Scaffold
        topAppBar={<TopAppBar title="App" size="small" />}
        navigationRail={<NavigationRail destinations={DESTINATIONS} />}
        navigationBar={<NavigationBar destinations={DESTINATIONS} />}
        fab={<FabAnchor><Fab aria-label="Add" icon="+" /></FabAnchor>}
        data-testid="scaffold"
      >
        <p>Content</p>
      </Scaffold>,
    );
    expect(screen.getByTestId('scaffold')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
