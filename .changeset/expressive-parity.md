---
'@m3ui/react': major
'@m3ui/color': major
'@m3ui/motion': major
'@m3ui/tokens': major
'@m3ui/spec-sync': minor
---

Establish a measured Material Web parity contract pinned to `@material/web@2.5.0`:

- **Spec pipeline** — upgraded spec-sync parser, Material Web `tokenLists` ingest, filled-button contract validation, and parity report generation (`spec:parity` / `spec:parity:check`).
- **Primitives rewrite** — ripple state machine + WAAPI, new focus-ring primitive, elevation/state-layer alignment with upstream token names.
- **Motion WAAPI** — labs/gb motion custom properties, overlay/popup WAAPI choreography, reduced-motion test coverage.
- **Tier remediation** — Tier A (`labs/gb`) full parity with documented residual diffs; Tier B (`stable`) Expressive extras in `adaptations[]`; Tier C (`tokens-only`) token/visual diff only.
- **CI gates** — parity check in CI and spec-drift workflow, catalog conformance assertions, docs parity foundation page, Storybook parity-tier tags; strict enforcement when parity artifact lands.

See [MIGRATION.md](../MIGRATION.md) and [docs/PARITY-SYNC.md](../docs/PARITY-SYNC.md).
