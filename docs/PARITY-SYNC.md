# Material Web parity — merge coordination

Checklist for integrating parallel worker outputs without conflicts. **Do not merge worker branches blindly** — follow this order.

## File ownership matrix

| Area | Owner worker | Paths | Status |
|------|--------------|-------|--------|
| Spec pipeline | Worker 0 | `tools/spec-sync/src/{utils,config,parse-scss,sync}.ts` | Blocking |
| Parity report | Worker 1 | `tools/spec-sync/src/parity-report.ts`, `docs/PARITY.md`, `docs/parity-report.json` | After spec |
| Primitives | Worker 2 | `packages/react/src/primitives/*` | After spec |
| Token utils / elevation | Worker 2 | `packages/react/src/lib/token-utils.ts` | After spec |
| Motion | Worker 3 | `packages/motion/*`, `overlay-motion.tsx`, `popup-motion.tsx` | After primitives |
| Tier A components | Worker 4 | `packages/react/src/components/*` (17 slugs) | After primitives |
| Tier B components | Worker 5 | `packages/react/src/components/*` (7 slugs) | After Tier A |
| Tier C components | Worker 6 | `packages/react/src/components/*` (remaining) | After Tier B |
| Gates + catalog | Worker 7 | `packages/react/src/catalog/*`, `conformance.test.ts`, `MIGRATION.md` | Last |
| **Supporting infra (this branch)** | Infra worker | `packages/tokens/scripts/*`, `check.ts`, `apps/docs/*`, `apps/storybook/scripts/*`, `tools/vrt/*`, this file | Anytime |

## Merge order

```
1. spec-sync (Phase 0)          → pnpm spec:sync && pnpm spec:sync:check
2. parity report (Phase 1)      → pnpm spec:parity && pnpm spec:parity:check
3. tokens codegen               → pnpm tokens:codegen && pnpm --filter @m3ui/tokens test
4. primitives + elevation (P2)  → pnpm --filter @m3ui/react test
5. motion WAAPI (Phase 3)       → pnpm --filter @m3ui/react test:motion
6. Tier A remediation (P4)      → pnpm spec:parity:check (Tier A diff → 0)
7. Tier B remediation           → record adaptations in catalog
8. Tier C token parity          → token diff only
9. gates (Phase 5)              → catalog parity block, conformance gate, MIGRATION.md
10. VRT re-baseline             → see tools/vrt/REBASELINE.md
```

## Test commands after merge

```bash
pnpm install
pnpm spec:sync:check
pnpm spec:parity:check          # strict — requires docs/parity-report.json
pnpm parity:gates               # spec sync + parity + bundle budgets
pnpm tokens:codegen
pnpm build
pnpm test
pnpm --filter @m3ui/react test:coverage
pnpm --filter @m3ui/react test:a11y
pnpm --filter @m3ui/react test:motion
pnpm --filter @m3ui/react test:docs
pnpm test:vrt                   # update snapshots only after Step 10
pnpm size:check
```

## Known conflict hotspots

| File / area | Why | Resolution |
|-------------|-----|------------|
| `packages/react/src/components/pressable-shell.tsx` | Ripple + focus ring both touch pressable wrapper | Merge primitives first; re-apply component changes on top |
| `packages/react/src/primitives/index.ts` | New focus-ring export | Primitives worker owns; infra must not edit |
| `packages/react/src/index.ts` | Public export surface | Gates worker adds exports last |
| `packages/react/src/catalog/components.catalog.ts` | Variants, sizes, parity block | Gates worker owns final population |
| `packages/tokens/src/generated/*` | Codegen output | Regenerate after spec + ingest merge: `pnpm tokens:codegen` |
| `packages/tokens/src/spec/material-web-tokens.json` | Large JSON diff | Spec-sync worker commits; others consume |
| `apps/storybook/src/stories/generated/*` | Regenerated from catalog | Run storybook generate script after catalog merge |
| `tools/vrt/tests/**/*-snapshots/` | Visual baselines | Re-baseline once after all visual workers land |

## Infra scaffolding already landed

These integrate cleanly with worker outputs:

- `packages/tokens/scripts/material-web-ingest.ts` — ingests `tokenLists` + sass resolved values when spec JSON updates
- `packages/tokens/scripts/CODEGEN-PIPELINE.md` — codegen documentation
- `tools/spec-sync/src/check.ts` — `--parity` mode + filled-button validation
- Root scripts: `spec:parity`, `spec:parity:check`, `parity:check`, `parity:gates`
- `apps/docs/src/lib/parity-tiers.ts` + `/foundations/parity` page
- `apps/docs/src/components/doc/compliance-summary.tsx` — parity block display
- `apps/storybook/scripts/generate-stories.mjs` — parity tier tags on compliance stories
- `apps/storybook/src/stories/foundations/primitives.stories.tsx` — VRT prep stories
- `tools/vrt/REBASELINE.md` + `storybook-url.ts` parity tags

## Strict parity CI (active)

`docs/parity-report.json` is committed. Both workflows enforce strict parity:

- **CI** (`.github/workflows/ci.yml`): `SPEC_PARITY_STRICT=1 pnpm parity:check` — fails the job if the artifact is missing or invalid
- **Spec drift** (`.github/workflows/spec-drift.yml`): same strict flag on weekly upstream checks

Regenerate the artifact after spec or component changes: `pnpm spec:parity && pnpm spec:parity:check`.

## CI integration

Material Web parity is enforced in two GitHub Actions workflows and a local gate runner. **Strict mode is active** — CI fails when `docs/parity-report.json` is missing or stale.

### Workflows

| Workflow | Trigger | Steps |
|----------|---------|-------|
| [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | push / PR to `main` | `spec:sync:check` → strict `parity:check` → token coverage → `size:check` |
| [`.github/workflows/spec-drift.yml`](../.github/workflows/spec-drift.yml) | weekly cron + manual | strict parity (`SPEC_PARITY_STRICT=1`), token coverage, live upstream diff |

**CI step order** (after build): spec sync validates pinned revisions against committed JSON; strict parity check validates the filled-button contract and requires a committed `docs/parity-report.json`; token coverage ensures every `md-comp` token is referenced or allowlisted; bundle budgets cap minified ESM size.

### Root scripts

| Script | Purpose |
|--------|---------|
| `pnpm spec:sync` | Fetch upstream androidx / material-web tokens |
| `pnpm spec:sync:check` | Manifest + revision pin drift (no network) |
| `pnpm spec:parity` | Generate `docs/PARITY.md` + `docs/parity-report.json` |
| `pnpm spec:parity:check` | Parity artifact + filled-button contract |
| `pnpm parity:check` | Alias for `spec:parity:check` |
| `pnpm parity:gates` | Runs spec sync → parity → bundle budgets (see below) |
| `pnpm size:check` | Bundle size budgets only |
| `pnpm --filter @m3ui/react test:coverage` | Token coverage gate (Vitest) |

### Local gate runner

`tools/bundle-budget/gates.ts` orchestrates post-build parity gates:

```bash
pnpm build
pnpm parity:gates                              # matches CI (set SPEC_PARITY_STRICT=1)
SPEC_PARITY_STRICT=1 pnpm parity:gates         # same as CI / spec-drift
pnpm --filter @m3ui/react test:coverage        # token coverage (separate Vitest harness)
```

Set `SPEC_PARITY_STRICT=1` to match CI (required now that the parity artifact is committed).

## Residual scope honesty

- **Tier A**: full parity achievable
- **Tier B**: approximate; Expressive extras → `adaptations[]`
- **Tier C**: token/visual only; behavior is M3UI-owned

The deliverable is a measured, enforced contract — not a blanket equivalence claim.
