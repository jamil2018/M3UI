# Registry install flow

M3UI distributes components via [shadcn/ui](https://ui.shadcn.com/) compatible registry JSON.

## Quick install

```bash
# From the docs host (local dev)
npx shadcn@latest add http://localhost:3000/r/button.json

# Production (when published)
npx shadcn@latest add https://m3ui.dev/r/button.json
```

## What gets installed

Each registry item copies a self-contained component file into your project (default: `components/m3ui/<name>.tsx`) with:

- `@m3ui/react` npm imports (never workspace paths)
- Required dependencies: `@m3ui/react`, `@m3ui/tokens`, `@m3ui/motion`, `@m3ui/shapes` (per component)

## Prerequisites in your app

```bash
pnpm add @m3ui/react @m3ui/tokens @m3ui/color @m3ui/motion
npx m3ui init --seed "#6750A4"
```

Import tokens CSS in your root layout:

```tsx
import '@m3ui/tokens/tokens.css';
import '@m3ui/tokens/theme.css';
import './m3-theme.css';
```

Wrap your app:

```tsx
'use client';
import { M3Provider } from '@m3ui/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <M3Provider seed="#6750A4">{children}</M3Provider>;
}
```

## CI validation

`pnpm --filter @m3ui/react test:registry` verifies every file in `packages/react/registry/r/`:

- No workspace import paths
- Declares `@m3ui/react` and `@m3ui/tokens` dependencies
- File content imports from published npm specifiers

Rebuild registry after component changes:

```bash
pnpm registry:build
```

## Available components

See `packages/react/registry/registry.json` or the docs site component index.
