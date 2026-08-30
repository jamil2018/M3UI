# VRT re-baseline procedure

Visual regression tests live in `tools/vrt/tests/`. **Do not re-baseline until Phase 2 primitives land** — ripple, focus ring, and elevation changes will legitimately move nearly every snapshot.

## When to re-baseline

Re-baseline after these worker outputs merge:

1. `packages/react/src/primitives/ripple.tsx` — upstream state machine + WAAPI
2. `packages/react/src/primitives/focus-ring.tsx` — new primitive
3. `packages/react/src/lib/token-utils.ts` — two-layer elevation model
4. Tier A component token/style remediation (cumulative visual drift)

## Commands

```bash
# Build storybook + docs first
pnpm build

# Update all VRT snapshots (review diff carefully)
pnpm test:vrt -- --update-snapshots

# Or update a single test file
pnpm exec playwright test tools/vrt/tests/demo.spec.ts --update-snapshots
pnpm exec playwright test tools/vrt/tests/docs.spec.ts --update-snapshots
```

## Parity-tier tagged stories

Storybook compliance stories carry tags for filtering:

| Tag | Meaning |
|-----|---------|
| `parity-tier-A` | labs/gb Expressive reference |
| `parity-tier-B` | stable MWC reference |
| `parity-tier-C` | tokens-only reference |
| `parity-ref-labs-gb` | upstream path hint |
| `vrt-prep` | foundations primitive stories (`Foundations/Primitives`) |

Use `tools/vrt/storybook-url.ts` `PARITY_TIER_TAGS` when adding tier-scoped VRT suites.

## Review checklist

- [ ] Ripple press/hover states match upstream timing (150ms touch delay, 450ms grow)
- [ ] Focus ring visible only on `:focus-visible`, disabled under `prefers-reduced-motion`
- [ ] Elevation transitions smoothly via `--md-elevation-level` (no stepped shadows)
- [ ] Dialog/menu WAAPI choreography snapshots updated separately after motion worker lands
- [ ] Conformance contract screenshots (`conformance-*-light.png`) updated after catalog parity block populates

## CI

Main CI runs `pnpm test:vrt` without `--update-snapshots`. Snapshot updates must be committed intentionally in the PR that causes the visual change.

See [docs/PARITY-SYNC.md](../../docs/PARITY-SYNC.md) for merge order.
