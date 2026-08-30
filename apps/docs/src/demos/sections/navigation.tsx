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
  Icon,
} from '@m3ui/react';
import { frame } from '../shared';

const DESTINATIONS = [
  { value: 'home', label: 'Home', icon: <Icon name="home" /> },
  { value: 'search', label: 'Search', icon: <Icon name="search" />, badge: 2 },
  { value: 'settings', label: 'Settings', icon: <Icon name="settings" /> },
];

export function TopAppBarDemo() {
  return (
    <TopAppBar
      title="Photos"
      subtitle="Album"
      size="medium-flexible"
      trailing={<IconButton aria-label="Search" icon={<Icon name="search" />} />}
    />
  );
}

export function BottomAppBarDemo() {
  return (
    <div style={{ position: 'relative', height: 80 }}>
      <BottomAppBar
        fab={<Fab aria-label="Create" icon={<Icon name="add" />} size="standard" />}
        actions={
          <>
            <IconButton aria-label="Menu" icon={<Icon name="menu" />} variant="standard" />
            <IconButton aria-label="Search" icon={<Icon name="search" />} variant="standard" />
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
      <NavigationRail destinations={DESTINATIONS} mode="collapsed" />
    </div>
  );
}

export function NavigationDrawerDemo() {
  return (
    <div style={{ minHeight: 220 }}>
      <NavigationDrawer
        variant="standard"
        sections={[
          { headline: 'Mail', items: [{ value: 'inbox', label: 'Inbox', icon: <Icon name="inbox" /> }] },
          { items: [{ value: 'sent', label: 'Sent', icon: <Icon name="send" /> }] },
        ]}
      />
    </div>
  );
}

export function AdaptiveNavigationDemo() {
  return (
    <div style={frame}>
      <AdaptiveNavigation destinations={DESTINATIONS} mode="bar" />
    </div>
  );
}
