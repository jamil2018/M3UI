'use client';

import { SideSheet, Button } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'side-sheet',
  'Side Sheet',
  <SideSheet trigger={<Button variant="filled-tonal">Open side sheet</Button>} headline="Filters">
    <p>Side sheet content</p>
  </SideSheet>,
);
