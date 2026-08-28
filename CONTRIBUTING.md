# Contributing to M3UI

Thank you for contributing to the unofficial Material Design 3 Expressive React library.

## Disclaimer

This project is **not affiliated with or endorsed by Google**. By contributing, you agree that your contributions are licensed under Apache-2.0.

## Development setup

```bash
pnpm install
pnpm spec:sync   # requires network — fetches pinned androidx + material-web tokens
pnpm build
pnpm test
```

## Pull request checklist

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm test:a11y` pass
- [ ] Token changes include updated spec JSON from `pnpm spec:sync` with a deliberate pin review
- [ ] New components reference md-comp tokens or add an entry to `token-coverage-allowlist.ts` with justification
- [ ] Registry rebuilt: `pnpm registry:build`
- [ ] Docs page added under `apps/docs/src/app/components/<name>/`
- [ ] A11y: vitest-axe test for new interactive components

## Code conventions

- **Components** — Base UI primitives, `compVar()` for md-comp tokens, `PressableShell` for press morph
- **Exports** — PascalCase components, `*Props` types, named exports only from `@m3ui/react`
- **Client boundary** — all `@m3ui/react` runtime code is client-only (`"use client"` banner in dist)
- **Tests** — colocate `*.test.tsx` and `*.a11y.test.tsx` beside components

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

Releases use [Changesets](https://github.com/changesets/changesets). Do not bump versions manually in component PRs — add a changeset instead.

```bash
pnpm changeset
```

## Questions

Open a GitHub issue for design questions, spec interpretation, or accessibility concerns before large refactors.
