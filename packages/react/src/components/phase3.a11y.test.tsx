import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { M3Provider } from '../provider/m3-provider.js';
import { TopAppBar } from './top-app-bar.js';
import { NavigationBar } from './navigation-bar.js';
import { NavigationRail } from './navigation-rail.js';
import { NavigationDrawer } from './navigation-drawer.js';
import { Tabs } from './tabs.js';
import { SearchBar } from './search.js';
import { Dialog } from './dialog.js';
import { BottomSheet } from './bottom-sheet.js';
import { Carousel } from './carousel.js';
import { Scaffold } from './scaffold.js';
import { Button } from './button.js';

const DESTINATIONS = [
  { value: 'a', label: 'One', icon: '1' },
  { value: 'b', label: 'Two', icon: '2' },
  { value: 'c', label: 'Three', icon: '3' },
];

describe('Phase 3 a11y', () => {
  it('TopAppBar has no violations', async () => {
    const { container } = renderWithM3(<TopAppBar title="Page" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('NavigationBar has no violations', async () => {
    const { container } = renderWithM3(<NavigationBar destinations={DESTINATIONS} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('NavigationBar RTL', async () => {
    renderWithM3(
      <M3Provider direction="rtl">
        <NavigationBar destinations={DESTINATIONS} data-testid="nav-rtl" />
      </M3Provider>,
    );
    expect(screen.getByTestId('nav-rtl')).toBeInTheDocument();
  });

  it('NavigationRail RTL', async () => {
    renderWithM3(
      <M3Provider direction="rtl">
        <NavigationRail destinations={DESTINATIONS} data-testid="rail-rtl" />
      </M3Provider>,
    );
    expect(screen.getByTestId('rail-rtl')).toBeInTheDocument();
  });

  it('NavigationDrawer has no violations', async () => {
    const { container } = renderWithM3(
      <NavigationDrawer variant="standard" sections={[{ items: [{ value: 'x', label: 'Item' }] }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Tabs has no violations', async () => {
    const { container } = renderWithM3(
      <Tabs items={[{ value: 't', label: 'Tab', panel: 'Content' }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('SearchBar has no violations', async () => {
    const { container } = renderWithM3(<SearchBar />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Dialog closed has no violations', async () => {
    const { container } = renderWithM3(<Dialog trigger={<Button>Open</Button>} headline="Hi" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('BottomSheet closed has no violations', async () => {
    const { container } = renderWithM3(
      <BottomSheet trigger={<Button>Sheet</Button>}>Body</BottomSheet>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Carousel has no violations', async () => {
    const { container } = renderWithM3(
      <Carousel items={[{ key: '1', content: 'A' }]} data-testid="carousel-a11y" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Scaffold has no violations', async () => {
    const { container } = renderWithM3(
      <Scaffold topAppBar={<TopAppBar title="App" />} data-testid="scaffold-a11y">
        Main
      </Scaffold>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
