'use client';

import { PlaceholderButton, M3Provider } from '@m3ui/react';

export default function PlaceholderButtonPage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
      <h1>Placeholder Button</h1>
      <p>Registry placeholder component for end-to-end install testing.</p>
      <M3Provider>
        <PlaceholderButton>Example</PlaceholderButton>
      </M3Provider>
    </main>
  );
}
