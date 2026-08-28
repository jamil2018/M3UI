# Changelog

All notable changes to `@m3ui/*` packages will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) once 1.0 is published.

## [Unreleased]

### Added

- Phase 6 hardening: token coverage CI gate, bundle size budgets, spec drift workflow
- RSC guide in docs (`/guides/rsc`) with client boundary and hydration notes
- Registry E2E validation for all shadcn registry JSON files
- Reduced-motion and morph performance test coverage
- `CONTRIBUTING.md` and this changelog skeleton

### Changed

- Token size prefixes aligned to spec (`button-xsmall`, `xsmall-icon-button`, etc.)
- Split button size prefix aligned to spec (`split-button-xsmall`, etc.)

### Fixed

- `BUTTON_SIZE_PREFIX` / `ICON_BUTTON_SIZE_PREFIX` mismatch with generated md-comp token names

## [0.0.0] — pre-release

Initial monorepo scaffold through Phase 5 components. Not yet published to npm.

[Unreleased]: https://github.com/example/m3ui/compare/v0.0.0...HEAD
[0.0.0]: https://github.com/example/m3ui/releases/tag/v0.0.0
