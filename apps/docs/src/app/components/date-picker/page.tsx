'use client';

import { DatePicker, Button, WindowSizeClassProvider } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'date-picker',
  'Date Picker',
  <WindowSizeClassProvider defaultSizeClass="compact" style={{ minHeight: 400 }}>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <DatePicker variant="docked" trigger={<Button variant="outlined">Docked</Button>} />
      <DatePicker variant="modal" trigger={<Button variant="filled-tonal">Modal</Button>} />
      <DatePicker variant="modal" mode="range" trigger={<Button variant="text">Range</Button>} />
    </div>
  </WindowSizeClassProvider>,
);
