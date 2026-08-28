'use client';

import { Button, Tooltip, RichTooltip } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'tooltip',
  'Tooltip',
  <div style={{ display: 'flex', gap: 24 }}>
    <Tooltip trigger={<Button variant="outlined">Plain</Button>} content="Plain tooltip" />
    <RichTooltip
      trigger={<Button variant="outlined">Rich</Button>}
      title="Rich tooltip"
      description="With title and description"
    />
  </div>,
);
