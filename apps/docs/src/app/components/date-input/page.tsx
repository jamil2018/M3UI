'use client';

import { DateInput, DatePicker, Button } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'date-input',
  'Date Input',
  <DateInput label="Event date" supportingText="Locale-aware date entry" data-testid="docs-date-input" />,
);
