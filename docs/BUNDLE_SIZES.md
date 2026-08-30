# Bundle sizes

Budgets are enforced in CI via `pnpm size:check` after build. Values are **minified ESM raw bytes** (pre-gzip).

| Package | Entry | Budget | Notes |
|---------|-------|--------|-------|
| `@m3ui/react` | `index.js` | 210 KB | Full component library entry, including typed conformance metadata |
| `@m3ui/react` | `m3-provider-*.js` | 10 KB | M3Provider + theme chunk |
| `@m3ui/react` | `primitives-*.js` | 10 KB | StateLayer, Ripple, Surface |
| `@m3ui/tokens` | `index.js` | 110 KB | Generated token maps + CSS imports |
| `@m3ui/shapes` | `index.js` | 35 KB | RoundedPolygon + MaterialShapes library |
| `@m3ui/color` | `index.js` | 8 KB | Dynamic color runtime |
| `@m3ui/motion` | `index.js` | 4 KB | Spring presets |
| `@m3ui/icons` | `index.js` | 3 KB | Material Symbols wrapper |

## Tree-shaking

Import individual components from `@m3ui/react`. The bundler should not include unused components when using named imports and a modern ESM toolchain (Vite, webpack 5, Turbopack).

```tsx
import { Button, M3Provider } from '@m3ui/react';
```

Registry installs copy single-component files via shadcn CLI for maximum tree-shaking in consumer apps.

## Checking locally

```bash
pnpm build
pnpm size:check
pnpm parity:gates               # spec sync + parity + bundle (see docs/PARITY-SYNC.md)
```

To update budgets after intentional size changes, edit `tools/bundle-budget/check.ts` and this table together in the same PR.
