'use client';

import { SearchBar, Button, SearchView } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'search',
  'Search',
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <SearchBar placeholder="Search photos" suggestions={[{ value: 'sunset', label: 'Sunset' }]} />
    <SearchView trigger={<Button variant="outlined">Open search view</Button>} suggestions={[{ value: 'a', label: 'Recent search' }]} />
  </div>,
);
