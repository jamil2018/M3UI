'use client';

import { NavigationDrawer } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'navigation-drawer',
  'Navigation Drawer',
  <NavigationDrawer
    variant="standard"
    sections={[
      { headline: 'Inbox', items: [{ value: 'inbox', label: 'Inbox', icon: '📥', badge: 4 }] },
      { headline: 'Labels', items: [{ value: 'star', label: 'Starred', icon: '⭐' }] },
    ]}
  />,
);
