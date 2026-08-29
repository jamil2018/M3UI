# M3UI: Material Design 3 Expressive for React

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
| `@m3ui/examples` | Shared component examples for docs and Storybook (private workspace package) |

## Prerequisites

- Node.js ≥ 20
- pnpm 9.15.0 (see `packageManager` in root `package.json`)

## Quick start

After cloning the repository, run `pnpm run setup` to install dependencies, generate tokens, build packages, and prepare the docs registry — then `pnpm dev` for the docs site (http://localhost:3000) and Storybook (http://localhost:6006). Use `--skip-spec-sync` or `--skip-vrt` to skip network fetch or Playwright install.

## Development

Start the docs site and Storybook together:

```bash
pnpm dev
# Docs      → http://localhost:3000
# Storybook → http://localhost:6006
```

Or run each app individually:

```bash
pnpm --filter @m3ui/docs dev
pnpm --filter @m3ui/storybook dev
```

Rebuild packages after changing library source:

```bash
pnpm build
# or watch a single package:
pnpm --filter @m3ui/react dev
```

### Docs site

The public documentation app (`@m3ui/docs`) is a Next.js site with a Fumadocs shell: categorized sidebar, local search, theme toggle, and table of contents.

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Landing page |
| http://localhost:3000/components | Searchable component index (43 public components) |
| http://localhost:3000/components/button | Dynamic component docs (`/components/[slug]`) |
| http://localhost:3000/tokens | Design tokens reference |
| http://localhost:3000/guides/rsc | React Server Components guide |
| http://localhost:3000/registry.json | shadcn-compatible registry manifest |
| http://localhost:3000/r/button.json | Per-component registry item |

Component metadata, navigation, and registry output are driven by the typed catalog in `packages/react/src/catalog/`. Docs prose lives in `apps/docs/src/content/`, live previews in `apps/docs/src/demos/`, and shared examples in `@m3ui/examples`.

```bash
pnpm --filter @m3ui/docs dev
pnpm --filter @m3ui/docs build
```

### Storybook (component workbench)

Real Storybook 8 on port **6006** for isolated development, a11y addon, interaction tests, and VRT targets. CSF stories are generated from the catalog and `@m3ui/examples`.

```bash
pnpm --filter @m3ui/storybook dev
pnpm --filter @m3ui/storybook stories:generate   # Regenerate CSF stories
pnpm --filter @m3ui/storybook build              # → apps/storybook/storybook-static
pnpm --filter @m3ui/storybook preview            # Serve static build
```

**Toolbar globals:** seed color, light/dark/system scheme, contrast, direction (LTR/RTL), and reduced motion via the global `M3Provider` decorator in `.storybook/preview.tsx`.

## Project structure

```
m3ui/
├── apps/
│   ├── docs/          # Next.js docs site (Fumadocs shell, search, registry proxy)
│   └── storybook/     # Storybook 8 workbench (generated CSF stories)
├── packages/
│   ├── react/         # Components, catalog, registry build
│   ├── examples/      # Shared examples for docs + Storybook
│   ├── tokens/        # Token codegen from pinned spec JSON
│   ├── color/         # Dynamic color runtime
│   ├── motion/        # Spring presets
│   ├── shapes/        # RoundedPolygon + MaterialShapes
│   ├── icons/         # Material Symbols wrapper
│   └── cli/           # m3ui init / theme generate
└── tools/
    ├── spec-sync/     # Fetch + parse androidx / material-web tokens
    ├── bundle-budget/ # CI size checks
    └── vrt/           # Playwright visual regression tests
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
import { M3Provider, Button } from '@m3ui/react';

export default function App() {
  return (
    <M3Provider seed="#6750A4" scheme="system" contrast={0}>
      <Button variant="filled">Save changes</Button>
    </M3Provider>
  );
}
```

## Registry (shadcn-style)

Install individual components into your project via the shadcn CLI:

```bash
npx shadcn@latest add http://localhost:3000/r/button.json
```

Registry JSON is generated from `@m3ui/react` source with workspace imports rewritten to npm specifiers. Rebuild after component changes:

```bash
pnpm registry:build
```

See [docs/REGISTRY.md](docs/REGISTRY.md) for the full install flow.

## Testing

```bash
pnpm test                              # Unit tests (Vitest)
pnpm test:a11y                         # Accessibility tests (vitest-axe)
pnpm test:vrt                          # Visual regression (Playwright)
pnpm --filter @m3ui/react test:docs    # Catalog/docs/Storybook completeness gate
pnpm --filter @m3ui/react test:registry
pnpm size:check                        # Bundle size budgets (after build)
pnpm spec:sync:check                   # Verify pinned spec matches committed JSON
pnpm lint
pnpm typecheck
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

Snapshot baselines live in `tools/vrt/tests/`. To refresh baselines after intentional UI changes:

```bash
pnpm test:vrt -- --update-snapshots
```

VRT targets Storybook iframe URLs and docs pages. Run against dev or a static Storybook build:

```bash
pnpm test:vrt
STORYBOOK_STATIC=1 pnpm test:vrt
```

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
@m3ui/react     → M3Provider + primitives + catalog + registry source
@m3ui/examples  → shared demos consumed by docs and Storybook
apps/docs       → public docs (Fumadocs shell, dynamic /components/[slug])
apps/storybook  → Storybook 8 workbench (generated stories)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the PR checklist, catalog/docs/Storybook requirements, and code conventions.

## License

Apache-2.0
