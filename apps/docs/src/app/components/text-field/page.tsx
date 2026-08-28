'use client';

import { TextField } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'text-field',
  'Text Field',
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
    <TextField label="Filled" variant="filled" supportingText="Supporting text" />
    <TextField label="Outlined" variant="outlined" />
  </div>,
);
