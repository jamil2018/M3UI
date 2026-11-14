# Contributing to M3UI

Thank you for contributing to the unofficial Material Design 3 Expressive React library.

## Disclaimer

This project is **not affiliated with or endorsed by Google**. By contributing, you agree that your contributions are licensed under Apache-2.0.

## Development setup

```bash
nvm use          # Node 24, at least 24.15.0
corepack enable  # uses packageManager from package.json
pnpm install --frozen-lockfile
pnpm check       # lint, typecheck, unit and accessibility tests
pnpm build       # libraries, docs, and Storybook
```

Start docs and Storybook together (dependencies and generated catalogs are prepared automatically):

```bash
pnpm dev
# Docs → http://localhost:3000  |  Storybook → http://localhost:6006
```

Use `pnpm dev:docs` or `pnpm dev:storybook` to run one app with its library watchers. `pnpm build:packages` builds libraries without either app. `pnpm test:watch` watches all unit-test projects, including shapes and spec-sync. `pnpm test:vrt` builds the apps before running Playwright; pass options directly, for example `pnpm test:vrt --update-snapshots`. `pnpm test:vrt:docs` runs only the docs browser tests. Browser tests use production servers by default; `VRT_DEV=1 pnpm exec playwright test` targets development servers. Set `DOCS_VRT=0` to select only Storybook.

The Turbo graph owns generation: React builds only its bundles; `catalog:build` waits for those bundles and examples metadata, and `stories:generate` waits for the catalog. App builds and the React unit suite depend on the generated artifacts. Type-aware lint waits for upstream library builds so exported types resolve on a clean checkout. CI uses `pnpm check`, builds apps once, runs parity/bundle gates, then executes Playwright against the static builds. Registry, token coverage, RSC, motion, and docs completeness checks are already included in the unit suite.

TypeScript stays on 5.9 to preserve the existing compiler configuration; TypeScript 7 exceeds the lint tooling's supported range. ESLint stays on its final 9.x release because the docs plugins do not yet declare ESLint 10 peer support. pnpm is pinned to the maintained 10.x line for reproducible installs. Use `pnpm install --frozen-lockfile` and `pnpm audit` for this pnpm workspace. The stale local `package-lock.json` was archived outside the repository because it described the previous root-only npm install, not the current workspace dependency tree. `npm audit` audits an npm lockfile and is not the audit command for this project; do not generate a second lockfile with npm.

## Dependency maintenance

The October 2026 update moves the workspace to pnpm 10.34.7, Node 24.15+, React 19.3, Next 16.4/Fumadocs 16.17, Storybook 10.6/Vite 8.3, Motion 14.3, Vitest 5, jsdom 30, and tsdown 0.23. Library export filenames remain `.js`/`.d.ts`; the bundler is configured explicitly to preserve those paths. Storybook uses ESM configuration and `storybook/test` instead of the removed packages.

Fumadocs 16 changed its shell markup and layout. The docs theme container supplies the background independently of the old shell wrapper, including dark mode. Its reviewed screenshots live in `tools/vrt/tests/docs.spec.ts-snapshots/fumadocs-16/`; the earlier baseline files remain intact. Browser tests wait for the docs theme and focus-ring readiness before capturing screenshots.

Compatible overrides patch `brace-expansion` 1.x/5.x and `source-map-js` 1.x. The unpatched `braces` advisory ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)) is addressed by removing the Next ESLint plugin's `fast-glob → micromatch → braces` chain. A dependency override scoped to that plugin installs `glob` 13.0.6 under its existing import name. The version-pinned pnpm patch adapts directory filtering and rejects `settings.next.rootDir` patterns over 10,000 characters or 64 brace/parenthesis openers before parsing. The group budget deliberately counts literal and malformed openers too. Ordinary roots, wildcards, alternatives (including empty alternatives), arrays, and symlink directories remain supported. No audit exclusions are configured; the resolved workspace audit reports zero vulnerabilities as of 2026-10-17.

`pnpm test:dependencies` exercises the security boundary and the actual Next internal-link rule. It runs before the other checks in `pnpm check`; CI also runs `pnpm audit --audit-level=low`. When upgrading `eslint-config-next`, review the pinned patch and scoped override together; do not drop the patch while keeping the replacement alias. ESLint 9 remains pinned for the docs plugins' declared peer support even though that release line is deprecated.

The security follow-up was independently reviewed and validated in an artifact-free disposable checkout on Node 24: frozen offline installation, six dependency-security regressions, all 377 unit tests and 79 accessibility tests, lint, typechecking, and both production app builds passed. Clean verification also exposed and corrected type-aware lint's upstream build prerequisite and spec-sync's undeclared token dependency. `pnpm audit --audit-level=low` passed with no known vulnerabilities. Browser checks were not repeated for this lint-tooling-only follow-up.

Local verification on Node 24 passed frozen installation, onboarding with committed specs, all 377 unit tests, 79 accessibility tests, 81 browser tests without snapshot updates, both production app builds, lint, typechecking, and strict parity/bundle gates. Both development servers and all six library watchers started successfully. Hosted CI has not been run by this update. Existing lint warnings, React test `act` warnings, and the optional jsdom canvas warning remain visible.

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
3. Update VRT baselines if visuals change: `pnpm test:vrt --update-snapshots`
4. Verify coverage gate: `pnpm --filter @m3ui/react test:coverage`

## Release process (maintainers)

Releases use [Changesets](https://github.com/changesets/changesets). Do not bump versions manually in component PRs; add a changeset instead.

```bash
pnpm changeset
```

## Questions

Open a GitHub issue for design questions, spec interpretation, or accessibility concerns before large refactors.
