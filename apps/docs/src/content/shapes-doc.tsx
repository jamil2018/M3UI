'use client';

import { useState } from 'react';
import { M3Provider, ShapeCrop } from '@m3ui/react';
import { MaterialShapes, MATERIAL_SHAPE_NAMES, Morph, cubicsToSvgPath } from '@m3ui/shapes';

function ShapePlayground() {
  const [fromName, setFromName] = useState<(typeof MATERIAL_SHAPE_NAMES)[number]>('circle');
  const [toName, setToName] = useState<(typeof MATERIAL_SHAPE_NAMES)[number]>('cookie9Sided');
  const [progress, setProgress] = useState(0);

  const from = MaterialShapes[fromName];
  const to = MaterialShapes[toName];
  const morph = new Morph(from, to);
  const path = cubicsToSvgPath(morph.asCubics(progress));

  return (
    <>
      <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
        <label>
          From
          <select value={fromName} onChange={(e) => setFromName(e.target.value as typeof fromName)}>
            {MATERIAL_SHAPE_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          To
          <select value={toName} onChange={(e) => setToName(e.target.value as typeof toName)}>
            {MATERIAL_SHAPE_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label style={{ flex: 1, minWidth: 200 }}>
          Progress {Math.round(progress * 100)}%
          <input
            type="range"
            min={0}
            max={100}
            value={progress * 100}
            onChange={(e) => setProgress(Number(e.target.value) / 100)}
            style={{ width: '100%' }}
          />
        </label>
      </div>

      <svg
        viewBox="0 0 1 1"
        width={240}
        height={240}
        style={{ marginTop: 32, background: 'var(--md-sys-color-surface-container)' }}
      >
        <path d={path} fill="var(--md-sys-color-primary)" />
      </svg>

      <section style={{ marginTop: 48 }}>
        <h2>Shape library</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
            gap: 12,
            marginTop: 16,
          }}
        >
          {MATERIAL_SHAPE_NAMES.map((name) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <ShapeCrop shape={name} size={56}>
                <div style={{ width: '100%', height: '100%', background: 'var(--md-sys-color-primary-container)' }} />
              </ShapeCrop>
              <small>{name}</small>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function ShapesDocPage() {
  return (
    <M3Provider>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        <h1>Shapes</h1>
        <p>Interactive morph between Material Design 3 Expressive shapes.</p>
        <ShapePlayground />
      </main>
    </M3Provider>
  );
}
