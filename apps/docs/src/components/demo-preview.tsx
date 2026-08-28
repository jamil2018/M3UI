'use client';

import { useState } from 'react';
import { M3Provider, PlaceholderButton, Surface } from '@m3ui/react';
import type { ContrastPreference } from '@m3ui/color';

export function DemoPreview() {
  const [seed, setSeed] = useState('#6750A4');
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [contrast, setContrast] = useState<ContrastPreference>(0);

  return (
    <M3Provider seed={seed} scheme={scheme} contrast={contrast}>
      <div
        style={{
          padding: 24,
          borderRadius: 12,
          border: '1px solid var(--md-sys-color-outline-variant)',
        }}
      >
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <label>
            Seed{' '}
            <input type="color" value={seed} onChange={(e) => { setSeed(e.target.value); }} />
          </label>
          <label>
            Scheme{' '}
            <select value={scheme} onChange={(e) => { setScheme(e.target.value as 'light' | 'dark'); }}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label>
            Contrast{' '}
            <select
              value={String(contrast)}
              onChange={(e) => { setContrast(parseFloat(e.target.value) as ContrastPreference); }}
            >
              <option value="0">Standard</option>
              <option value="0.5">Medium</option>
              <option value="1">High</option>
            </select>
          </label>
        </div>
        <Surface elevation="level2">
          <div style={{ padding: 24 }}>
            <PlaceholderButton>Expressive Button</PlaceholderButton>
          </div>
        </Surface>
      </div>
    </M3Provider>
  );
}
