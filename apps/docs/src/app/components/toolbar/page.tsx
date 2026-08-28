'use client';

import { Toolbar, ToolbarButton, IconButton } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'toolbar',
  'Toolbar',
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <Toolbar variant="docked">
      <ToolbarButton aria-label="Bold">B</ToolbarButton>
      <ToolbarButton aria-label="Italic">I</ToolbarButton>
      <IconButton aria-label="More" icon="⋯" variant="standard" />
    </Toolbar>
    <Toolbar variant="floating">
      <ToolbarButton aria-label="Copy" vibrant>
        📋
      </ToolbarButton>
      <ToolbarButton aria-label="Paste" vibrant selected>
        📄
      </ToolbarButton>
    </Toolbar>
  </div>,
);
