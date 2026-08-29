'use client';

import { M3Provider, Surface } from '@m3ui/react';
import type { ContrastPreference } from '@m3ui/color';
import { useEffect, useState, type ReactNode } from 'react';

export interface LivePreviewProps {
  children: ReactNode;
  /** Minimum height while hydrating client-only demos */
  minHeight?: number;
}

export function LivePreview({ children, minHeight = 120 }: LivePreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [seed, setSeed] = useState('#6750A4');
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [contrast, setContrast] = useState<ContrastPreference>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="doc-live-preview">
      <div className="doc-live-preview-controls">
        <label className="doc-control">
          <span className="doc-control-label">Seed</span>
          <input
            type="color"
            value={seed}
            onChange={(event) => { setSeed(event.target.value); }}
            aria-label="Theme seed color"
          />
        </label>
        <label className="doc-control">
          <span className="doc-control-label">Scheme</span>
          <select
            value={scheme}
            onChange={(event) => { setScheme(event.target.value as 'light' | 'dark'); }}
            aria-label="Color scheme"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label className="doc-control">
          <span className="doc-control-label">Contrast</span>
          <select
            value={String(contrast)}
            onChange={(event) => {
              setContrast(parseFloat(event.target.value) as ContrastPreference);
            }}
            aria-label="Contrast preference"
          >
            <option value="0">Standard</option>
            <option value="0.5">Medium</option>
            <option value="1">High</option>
          </select>
        </label>
      </div>
      <M3Provider seed={seed} scheme={scheme} contrast={contrast}>
        <Surface elevation="level1" className="doc-live-preview-surface">
          <div className="doc-live-preview-stage" style={{ minHeight }}>
            {mounted ? children : <div aria-hidden style={{ minHeight }} />}
          </div>
        </Surface>
      </M3Provider>
    </div>
  );
}
