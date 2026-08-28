'use client';

import { IconButton } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'icon-button',
  'Icon Button',
  <div style={{ display: 'flex', gap: 12 }}>
    <IconButton aria-label="Standard" icon="★" variant="standard" />
    <IconButton aria-label="Filled" icon="★" variant="filled" />
    <IconButton aria-label="Tonal" icon="★" variant="filled-tonal" />
    <IconButton aria-label="Outlined" icon="★" variant="outlined" />
  </div>,
);
