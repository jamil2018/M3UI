'use client';

import { Divider } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'divider',
  'Divider',
  <div>
    <p>Above</p>
    <Divider />
    <p>Below</p>
    <Divider variant="inset" />
    <p>Inset divider</p>
  </div>,
);
