'use client';

import { TimePicker, Button } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'time-picker',
  'Time Picker',
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <TimePicker variant="dial" format="12h" trigger={<Button variant="outlined">Dial 12h</Button>} />
    <TimePicker variant="input" format="24h" trigger={<Button variant="filled-tonal">Input 24h</Button>} />
  </div>,
);
