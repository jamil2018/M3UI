# Registry install flow

M3UI distributes components via [shadcn/ui](https://ui.shadcn.com/) compatible registry JSON. The typed catalog in `packages/react/src/catalog/` is the single source of truth for registry items, docs navigation, and completeness checks. Running `pnpm registry:build` emits:

- `packages/react/registry/registry.json`: manifest
- `packages/react/registry/r/<slug>.json`: per-component install payloads
- `packages/react/registry/docs-catalog.json`: docs metadata

The docs site proxies these files at `/registry.json` and `/r/<slug>.json` (see `apps/docs/next.config.ts`).

## Quick install

```bash
# From the docs host (local dev)
npx shadcn@latest add http://localhost:3000/r/button.json

# Production (when published)
npx shadcn@latest add https://m3ui.dev/r/button.json
```

Browse all 43 public components at `/components` or list items from `registry.json`.

## What gets installed

Each registry item copies a self-contained component file into your project (default: `components/m3ui/<name>.tsx`) with:

- `@m3ui/react` npm imports (never workspace paths)
- Required dependencies: `@m3ui/react`, `@m3ui/tokens`, `@m3ui/motion`, `@m3ui/shapes` (per component)

Internal test fixtures (for example `placeholder-button`) remain in the registry for CI but are excluded from the public docs index.

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

## Adding a new registry component

1. Implement the component in `packages/react/src/components/`
2. Add a catalog entry in `packages/react/src/catalog/components.catalog.ts`
3. Export from `packages/react/src/index.ts`
4. Rebuild: `pnpm registry:build`
5. Add docs content, demos, shared examples, and regenerate Storybook stories (see [CONTRIBUTING.md](../CONTRIBUTING.md))
6. Verify: `pnpm --filter @m3ui/react test:docs` and `pnpm --filter @m3ui/react test:registry`

## CI validation

`pnpm --filter @m3ui/react test:registry` verifies every file in `packages/react/registry/r/`:

- No workspace import paths
- Declares `@m3ui/react` and `@m3ui/tokens` dependencies
- File content imports from published npm specifiers

`pnpm --filter @m3ui/react test:docs` verifies catalog, registry manifest, docs content, demos, shared examples, and generated Storybook stories stay aligned.

Rebuild registry after component changes:

```bash
pnpm registry:build
```

## Available components

See `packages/react/registry/registry.json`, the docs site component index at `/components`, or the generated `packages/react/registry/docs-catalog.json`.
