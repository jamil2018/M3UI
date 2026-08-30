# Changelog

All notable changes to `@m3ui/*` packages will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) once 1.0 is published.

## [Unreleased]

Material 3 Expressive release aligned with pinned `@material/web@2.5.0`. See [MIGRATION.md](./MIGRATION.md) and [docs/PARITY-SYNC.md](./docs/PARITY-SYNC.md).

### Material Web parity initiative

Multi-phase effort to measure and enforce parity with upstream Material Web—not a blanket equivalence claim. Each catalog entry carries a versioned `conformance.parity` block with tier-specific expectations and documented residual gaps.

| Phase | Scope | Verification |
|-------|--------|--------------|
| 0–1 | Spec pipeline + parity report | `pnpm spec:sync:check`, `pnpm spec:parity`, `pnpm spec:parity:check` |
| 2 | Primitives rewrite (ripple, focus ring, elevation) | `pnpm --filter @m3ui/react test` |
| 3 | Motion WAAPI (overlay/popup choreography) | `pnpm --filter @m3ui/react test:motion` |
| 4 | Tier A/B/C remediation | Tier A diff → 0; B records `adaptations[]`; C token/visual only |
| 5 | CI gates + catalog contract | `conformance.test.ts`, docs completeness, strict parity when artifact lands |

**Spec pipeline (Phases 0–1).** Upgraded spec-sync parser ingests Material Web `tokenLists` (supported, unsupported, renamed) and resolved sass values from `tokens/versions/latest/`. Filled-button contract validation (~38 supported / ~4 unsupported tokens) guards regressions. New `material-web-ingest.ts` merges contract JSON into token codegen; legacy AndroidX-only fallback preserved until sync lands. Parity report diffs upstream `$supported-tokens` against M3UI references and emits `docs/PARITY.md` + `docs/parity.json`.

**Primitives rewrite (Phase 2).** Ripple reimplemented with upstream state machine and WAAPI; new focus-ring primitive; elevation and state-layer utilities aligned to spec token names. Pressable shell integrates ripple + focus ring without duplicate overlays.

**Motion WAAPI (Phase 3).** `@m3ui/motion` emits labs/gb `--md-sys-motion-*` custom properties; overlay and popup components use WAAPI choreography for enter/exit. Reduced-motion coverage enforced via dedicated test suite.

**Tier remediation (Phase 4).** Tier A (`labs/gb`, 17 slugs): full token, visual, motion, and a11y parity with zero undocumented residual diff. Tier B (`stable`, 7 slugs): Expressive additions recorded in `adaptations[]`, not claimed as upstream parity. Tier C (`tokens-only`, remaining slugs): token/visual diff only; behavior remains M3UI-owned.

**CI gates (Phase 5).** `spec:parity:check` wired into CI and weekly spec-drift workflow (`continue-on-error` until parity artifact commits; enable strict mode via `SPEC_PARITY_STRICT=1`). Catalog conformance gate asserts parity blocks, tier references, and documented residual diffs. Docs parity foundation page, compliance summary component, and Storybook parity-tier tags support review before VRT re-baseline.

### Added

- Material Web parity report tooling (`pnpm spec:parity`, `pnpm spec:parity:check`) and tier classification (A/B/C) in catalog
- Parity foundation docs at `/foundations/parity` and compliance summary on component pages
- Spec-sync `--parity` mode with filled-button contract count validation
- Material Web contract ingest scaffold (`material-web-ingest.ts`) and codegen pipeline documentation
- Foundations Storybook stories for ripple, focus ring, and elevation VRT prep
- Versioned Material 3 Expressive conformance metadata for every public catalog entry
- Complete modern dynamic-color roles and automated semantic-pair contrast auditing
- Semantic motion presets for enter, exit, emphasis, selection, press, and container transforms
- Generated Storybook scenarios for compliance, high contrast, RTL, reduced motion, and narrow viewports
- New foundation, adaptive-layout, accessibility, and migration documentation

- Full docs site with Fumadocs shell: search, theme toggle, categorized sidebar, and table of contents
- Component index at `/components` and dynamic `/components/[slug]` routes for 43 public components
- Typed single-source catalog in `packages/react/src/catalog/` driving registry, docs, and completeness gates
- `@m3ui/examples` workspace package for shared docs and Storybook demos
- Storybook 8 workbench on port 6006 with generated CSF stories, a11y addon, and interaction tooling
- Phase 6 hardening: token coverage CI gate, bundle size budgets, spec drift workflow with parity contract check
- RSC guide in docs (`/guides/rsc`) with client boundary and hydration notes
- Registry E2E validation for all shadcn registry JSON files
- Reduced-motion and morph performance test coverage
- `CONTRIBUTING.md` and this changelog skeleton

### Changed

- Ripple, focus ring, and elevation primitives rewritten for Material Web state machines and WAAPI
- Overlay and popup motion migrated to WAAPI choreography with labs/gb motion token emission
- Tier A components remediated to zero undocumented parity diff; Tier B/C parity expectations documented in catalog
- `M3Provider` themes are scoped to the provider boundary and support isolated nested themes
- Documentation landing, catalog, component pages, previews, and information architecture rebuilt for technical scanning
- State layers and focus indicators share system tokens and include forced-color behavior
- Internal placeholder glyphs replaced by Material Symbols

- Docs routing consolidated from per-component route files to a single dynamic `[slug]` route
- Storybook converted from a Vite demo page to real Storybook 8
- Token size prefixes aligned to spec (`button-xsmall`, `xsmall-icon-button`, etc.)
- Split button size prefix aligned to spec (`split-button-xsmall`, etc.)

### Fixed

- Spec-sync pipeline now parses Material Web `tokenLists` and resolved sass values instead of legacy AndroidX-only ingest
- State-layer selectors no longer activate unrelated nested component overlays (primitives + pressable shell integration)
- Canonical light-scheme CSS fallbacks now preserve correct foreground and background role contrast
- Theme prop changes now synchronize provider state predictably

- `BUTTON_SIZE_PREFIX` / `ICON_BUTTON_SIZE_PREFIX` mismatch with generated md-comp token names

## [0.0.0] — pre-release

Initial monorepo scaffold through Phase 5 components. Not yet published to npm.

[Unreleased]: https://github.com/example/m3ui/compare/v0.0.0...HEAD
[0.0.0]: https://github.com/example/m3ui/releases/tag/v0.0.0
