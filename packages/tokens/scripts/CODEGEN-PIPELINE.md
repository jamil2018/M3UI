# Token codegen pipeline

Generated CSS lives in `src/generated/`. Do not edit by hand.

## Current flow

```bash
pnpm spec:sync          # fetch androidx + material-web spec JSON → packages/tokens/src/spec/
pnpm tokens:codegen     # scripts/codegen.ts → tokens.css, theme.css, tokens.ts
pnpm --filter @m3ui/tokens build
```

## Material Web contract ingest (Phase 0+)

After spec-sync workers land the upgraded parser, `material-web-tokens.json` entries include:

| Field | Source path | Purpose |
|-------|-------------|---------|
| `tokenLists.supported` | `tokens/_md-comp-*.scss` | Parity contract — which tokens upstream exposes |
| `tokenLists.unsupported` | same | Explicitly excluded tokens |
| `tokenLists.renamed` | same | Sass → CSS property renames |
| `variables` (resolved) | `tokens/versions/latest/sass/` | Expressive default values |
| motion SCSS vars | `labs/gb/styles/motion/` | `--md-sys-motion-*` custom properties |

### Validation gate

`md-comp-filled-button` must report **~38 supported** and **~4 unsupported** tokens after sync:

- `container-color`, `container-elevation`, `container-height`, `container-shape`, logical corner tokens, state-layer families, spacing tokens, etc.
- Unsupported: `focus-state-layer-color`, `focus-state-layer-opacity`, `label-text-tracking`, `label-text-type`

Run: `pnpm spec:sync:check` (includes filled-button count validation when contract data exists).

### Codegen behavior

`scripts/material-web-ingest.ts` detects the new contract via `hasMaterialWebContract()`.

| Spec state | Codegen behavior |
|------------|------------------|
| Legacy JSON (no `tokenLists`) | AndroidX Compose tokens only (current behavior) |
| Contract JSON present | Merge resolved material-web values; emit motion vars from labs/gb; log ingest summary |

**Do not run full regen until `pnpm spec:sync` produces contract JSON.** The scaffold logs a warning and continues with AndroidX-only output otherwise.

### Naming alias

Upstream CSS: `--md-filled-button-container-color` (no `comp` segment).  
M3UI CSS: `--md-comp-filled-button-container-color` via `compVar()`.

The ingest module maps between these; parity-report handles diffing.

## After merge (all workers)

```bash
pnpm spec:sync
pnpm spec:parity
pnpm spec:sync:check      # manifest + filled-button + parity artifact
pnpm tokens:codegen
pnpm test
pnpm --filter @m3ui/react test:coverage
pnpm test:vrt --update-snapshots   # after primitives land — see tools/vrt/REBASELINE.md
```

See [docs/PARITY-SYNC.md](../../../docs/PARITY-SYNC.md) for merge order and conflict hotspots.
