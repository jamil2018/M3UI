# M3UI — Material Design 3 Expressive for React

An unofficial open-source component library implementing [Material Design 3 Expressive](https://m3.material.io/) for React 19, built on [Base UI](https://base-ui.com/), [Tailwind CSS v4](https://tailwindcss.com/), and [Motion](https://motion.dev/).

> **Disclaimer:** This project is **not affiliated with or endorsed by Google**. "Material" is a trademark of Google LLC. Token data is extracted from Apache-2.0 licensed sources (androidx, material-web).

## Packages

| Package | Description |
|---------|-------------|
| `@m3ui/tokens` | M3 sys tokens as CSS custom properties + TypeScript types |
| `@m3ui/color` | Dynamic color via material-color-utilities (SPEC_2025, EXPRESSIVE) |
| `@m3ui/motion` | M3 spring → Motion transitions + CSS fallbacks |
| `@m3ui/react` | React components, M3Provider, state layer, ripple |
| `@m3ui/icons` | Material Symbols wrapper |
| `@m3ui/cli` | `m3ui init` and `m3ui theme generate` |
| `@m3ui/shapes` | RoundedPolygon, Morph, and MaterialShapes library |

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

## Setup

```bash
git clone <repo-url> material-react
cd material-react
pnpm install
pnpm spec:sync      # Fetch androidx + material-web tokens (requires network)
pnpm build          # Build all packages
```

## Development

```bash
pnpm dev            # Start docs + storybook via Turborepo
pnpm test           # Unit tests (Vitest)
pnpm test:a11y      # Accessibility tests (vitest-axe)
pnpm test:vrt       # Visual regression (Playwright)
pnpm size:check     # Bundle size budgets (after build)
pnpm spec:sync:check # Verify pinned spec matches committed JSON
pnpm lint           # ESLint
pnpm typecheck      # TypeScript
```

### Visual regression tests

Before the first VRT run locally, install Playwright's Chromium browser:

```bash
pnpm exec playwright install chromium
```

If VRT fails with a missing browser executable and you use a custom `PLAYWRIGHT_BROWSERS_PATH`, install to the default cache instead:

```bash
unset PLAYWRIGHT_BROWSERS_PATH && pnpm exec playwright install chromium --force
```

Snapshot baselines live in `tools/vrt/tests/demo.spec.ts-snapshots/` and use platform-agnostic names so the same files work on macOS and Linux CI. To refresh baselines after intentional UI changes:

```bash
pnpm test:vrt -- --update-snapshots
```

### Storybook harness

```bash
pnpm --filter @m3ui/storybook dev
# → http://localhost:6006
```

### Docs site

```bash
pnpm --filter @m3ui/docs dev
# → http://localhost:3000
```

## Using in your app

```bash
pnpm add @m3ui/react @m3ui/tokens @m3ui/color
npx m3ui init --seed "#6750A4"
```

```tsx
import '@m3ui/tokens/tokens.css';
import '@m3ui/tokens/theme.css';
import './m3-theme.css';
import { M3Provider, PlaceholderButton } from '@m3ui/react';

export default function App() {
  return (
    <M3Provider seed="#6750A4" scheme="system" contrast={0}>
      <PlaceholderButton>Click me</PlaceholderButton>
    </M3Provider>
  );
}
```

## Registry (shadcn-style)

```bash
npx shadcn@latest add http://localhost:3000/r/placeholder-button.json
```

Registry JSON is generated from `@m3ui/react` source with workspace imports rewritten to npm specifiers. See [docs/REGISTRY.md](docs/REGISTRY.md) for the full install flow.

## Bundle sizes

Per-package budgets are enforced in CI. See [docs/BUNDLE_SIZES.md](docs/BUNDLE_SIZES.md) for the current table and local check instructions.

## Spec sync

Token fidelity comes from pinned upstream sources:

- `androidx/androidx` → Compose Material3 `.kt` token files
- `material-components/material-web` → `_md-comp-*` / `_md-sys-*` SCSS

Committed JSON lives in `packages/tokens/src/spec/`. Run `pnpm spec:sync` to reproduce.

## Architecture

```
tools/spec-sync → packages/tokens/src/spec/*.json
                → codegen → tokens.css + TS types + Tailwind @theme
@m3ui/color     → createTheme() runtime + CLI build-time CSS
@m3ui/motion    → Motion spring presets (spatial vs effects)
@m3ui/react     → M3Provider + primitives + registry source
```

## License

Apache-2.0
