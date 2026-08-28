'use client';

import { Fab, ExtendedFab } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'fab',
  'FAB',
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Fab aria-label="Add" icon="+" size="small" />
    <Fab aria-label="Add" icon="+" size="medium" />
    <Fab aria-label="Add" icon="+" size="large" />
    <ExtendedFab icon="+" label="Compose" />
  </div>,
);
