'use client';

import {
  TopAppBar,
  BottomAppBar,
  NavigationBar,
  NavigationRail,
  NavigationDrawer,
  AdaptiveNavigation,
  IconButton,
  Fab,
} from '@m3ui/react';

const DESTINATIONS = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'search', label: 'Search', icon: '🔍', badge: 2 },
  { value: 'settings', label: 'Settings', icon: '⚙️' },
];

export function TopAppBarDemo() {
  return (
    <TopAppBar
      title="Photos"
      subtitle="Album"
      size="medium-flexible"
      trailing={<IconButton aria-label="Search" icon="🔍" />}
    />
  );
}

export function BottomAppBarDemo() {
  return (
    <div style={{ position: 'relative', height: 80 }}>
      <BottomAppBar
        fab={<Fab aria-label="Create" icon="+" size="small" />}
        actions={
          <>
            <IconButton aria-label="Menu" icon="☰" variant="standard" />
            <IconButton aria-label="Search" icon="🔍" variant="standard" />
          </>
        }
      />
    </div>
  );
}

export function NavigationBarDemo() {
  return <NavigationBar destinations={DESTINATIONS} />;
}

export function NavigationRailDemo() {
  return (
    <div style={{ display: 'flex', minHeight: 220 }}>
      <NavigationRail
        destinations={DESTINATIONS}
        mode="collapsed"
      />
    </div>
  );
}

export function NavigationDrawerDemo() {
  return (
    <div style={{ minHeight: 220 }}>
      <NavigationDrawer
        variant="standard"
        sections={[
          { headline: 'Mail', items: [{ value: 'inbox', label: 'Inbox', icon: '📥' }] },
          { items: [{ value: 'sent', label: 'Sent', icon: '📤' }] },
        ]}
      />
    </div>
  );
}

export function AdaptiveNavigationDemo() {
  return (
    <AdaptiveNavigation destinations={DESTINATIONS} mode="bar" />
  );
}
