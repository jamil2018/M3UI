'use client';

import { List, ListItem } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'list',
  'List',
  <List>
    <ListItem headline="One line item" leading="📄" />
    <ListItem headline="Two line item" supportingText="Supporting text" lines={2} divider />
    <ListItem headline="Three line" overline="Overline" supportingText="Details" lines={3} />
  </List>,
);
