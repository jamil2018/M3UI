'use client';

import { useState } from 'react';
import { Button, M3Provider, Surface } from '@m3ui/react';
import type { ContrastPreference } from '@m3ui/color';

export function DemoPreview() {
  const [seed, setSeed] = useState('#6750A4');
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [contrast, setContrast] = useState<ContrastPreference>(0);

  return (
    <M3Provider seed={seed} scheme={scheme} contrast={contrast}>
      <div className="docs-card docs-demo-preview">
        <div className="docs-demo-preview-controls">
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
          <div className="docs-demo-preview-stage">
            <Button variant="filled">Filled</Button>
            <Button variant="elevated">Elevated</Button>
            <Button variant="filled-tonal">Tonal</Button>
            <Button variant="outlined">Outlined</Button>
          </div>
        </Surface>
      </div>
    </M3Provider>
  );
}
