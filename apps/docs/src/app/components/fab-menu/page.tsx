'use client';

import { FabMenu } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'fab-menu',
  'FAB Menu',
  <FabMenu
    aria-label="Create"
    icon="+"
    actions={[
      { label: 'New task', icon: '✓' },
      { label: 'New note', icon: '📝' },
      { label: 'Upload', icon: '⬆' },
    ]}
  />,
);
