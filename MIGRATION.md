# Migrating to the Expressive conformance release

This release intentionally corrects theme scoping and visual defaults. Review these changes before upgrading.

## Provider scoping

`M3Provider` now applies generated CSS variables to its own `data-m3-root` boundary instead of `document.documentElement`. Nested providers are isolated and unmounting a preview cannot remove another theme.

If application chrome outside the provider previously inherited generated variables, move that chrome inside `M3Provider` or apply a build-time theme at the document root.

## Color roles

`@m3ui/color` now emits fixed, fixed-dim, on-fixed, on-fixed-variant, and surface-tint roles. Use semantic role pairs and do not substitute raw palette values.

The static token stylesheet now uses canonical Material light-scheme fallbacks instead of assigning the seed purple to every role.

## Expressive behavior

The public catalog exports a versioned conformance contract. `adapted` means official tokens are combined with Android Expressive behavior translated for browsers.

Each component also carries a **Material Web parity block** when an upstream reference exists:

- **Tier A (`labs/gb`, tier `A`)** — Expressive components with a real upstream implementation in `@material/web` labs. Parity is measured on tokens, visuals, motion, and accessibility. Residual gaps are listed in `conformance.parity.residualDiff` and enforced by CI.
- **Tier B (`stable`, tier `B`)** — Classic M3 components referenced against stable Material Web Components. Expressive additions are recorded in `adaptations[]`, not claimed as upstream parity.
- **Tier C (`tokens-only`, tier `C`)** — Components upstream never shipped; token/visual parity is checked against orphaned `tokens/versions/*` files. Behavior remains M3UI-specific by necessity.

Each `conformance.parity` block records `tier`, `reference`, `upstreamVersion`, and `residualDiff` (missing / extra / drifted token suffixes). Registry `meta.parity` mirrors the same contract for installable payloads.

`conformance.parity` does not replace `adapted` status — it documents how closely implementation matches the pinned `@material/web` reference, not a blanket equivalence claim.

Motion consumers can use `semanticTransitions` for enter, exit, emphasized, selection, press, and container-transform intent.

## Documentation and Storybook

Component pages display source classification and browser adaptation status. Generated stories include compliance, high-contrast, RTL, reduced-motion, and narrow-viewport scenarios.
