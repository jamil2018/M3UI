'use client';

import { BottomAppBar, Fab, IconButton } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'bottom-app-bar',
  'Bottom App Bar',
  <BottomAppBar
    actions={
      <>
        <IconButton aria-label="Archive" icon="📦" />
        <IconButton aria-label="Search" icon="🔍" />
        <IconButton aria-label="More" icon="⋮" />
      </>
    }
    fab={<Fab aria-label="Create" icon="+" />}
  />,
);
