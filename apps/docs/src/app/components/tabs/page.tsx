'use client';

import { Tabs } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'tabs',
  'Tabs',
  <Tabs
    variant="primary"
    layout="fixed"
    items={[
      { value: 'photos', label: 'Photos', panel: 'Photos panel' },
      { value: 'albums', label: 'Albums', panel: 'Albums panel' },
      { value: 'stories', label: 'Stories', panel: 'Stories panel' },
    ]}
  />,
);
