# Contributing to M3UI

Thank you for contributing to the unofficial Material Design 3 Expressive React library.

## Disclaimer

This project is **not affiliated with or endorsed by Google**. By contributing, you agree that your contributions are licensed under Apache-2.0.

## Development setup

```bash
pnpm install
pnpm spec:sync   # requires network; fetches pinned androidx + material-web tokens
pnpm build
pnpm test
```

Start docs and Storybook together:

```bash
pnpm dev
# Docs → http://localhost:3000  |  Storybook → http://localhost:6006
```

## Pull request checklist

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:a11y`, and `pnpm --filter @m3ui/react test:docs` pass
- [ ] Token changes include updated spec JSON from `pnpm spec:sync` with a deliberate pin review
- [ ] New components reference md-comp tokens or add an entry to `token-coverage-allowlist.ts` with justification
- [ ] Catalog entry added or updated in `packages/react/src/catalog/components.catalog.ts`
- [ ] Component implementation in `packages/react/src/components/` and exported from `packages/react/src/index.ts`
- [ ] Registry rebuilt: `pnpm registry:build`
- [ ] Docs prose added in `apps/docs/src/content/components.ts` (or a dedicated content module)
- [ ] Docs demo added in `apps/docs/src/demos/` and registered in `apps/docs/src/demos/index.ts`
- [ ] Shared example added in `packages/examples/src/` when the component needs synchronized docs/Storybook demos
- [ ] Storybook stories regenerated: `pnpm --filter @m3ui/storybook stories:generate`
- [ ] A11y: vitest-axe test for new interactive components

The `test:docs` completeness gate verifies catalog, registry, docs content, demos, shared examples, and generated Storybook stories stay in sync. Internal fixtures such as `placeholder-button` are excluded from the public docs index.

## Code conventions

- **Components**: Base UI primitives, `compVar()` for md-comp tokens, `PressableShell` for press morph
- **Exports**: PascalCase components, `*Props` types, named exports only from `@m3ui/react`
- **Client boundary**: all `@m3ui/react` runtime code is client-only (`"use client"` banner in dist)
- **Tests**: colocate `*.test.tsx` and `*.a11y.test.tsx` beside components

## API stability (pre-1.0)

We are hardening for 1.0. Breaking renames require:

1. A deprecation re-export alias for one minor release cycle (post-1.0)
2. CHANGELOG entry under **Breaking**
3. Migration note in the component docs page

## Spec and token changes

1. Run `pnpm spec:sync` and review the JSON diff
2. Run `pnpm tokens:codegen`
3. Update VRT baselines if visuals change: `pnpm test:vrt -- --update-snapshots`
4. Verify coverage gate: `pnpm --filter @m3ui/react test:coverage`

## Release process (maintainers)

Releases use [Changesets](https://github.com/changesets/changesets). Do not bump versions manually in component PRs; add a changeset instead.

```bash
pnpm changeset
```

## Questions

Open a GitHub issue for design questions, spec interpretation, or accessibility concerns before large refactors.
