'use client';

import { SplitButton, MenuItem } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'split-button',
  'Split Button',
  <SplitButton menuItems={<><MenuItem>Draft</MenuItem><MenuItem>Schedule</MenuItem></>}>
    Send
  </SplitButton>,
);
