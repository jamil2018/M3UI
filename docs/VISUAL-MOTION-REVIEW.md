# Visual fidelity and motion review — 2026-10-31

This review evaluates browser behavior as well as token/spec alignment. GPT-6.1 Sol implemented the corrections; the coordinating agent independently reviewed the incremental source changes and rendered output. Existing uncommitted work was preserved, with a pre-review source/snapshot archive at `/tmp/material-review-baseline.tar.gz`.

## Findings and corrections

| Priority | Finding | Correction |
| --- | --- | --- |
| High | Basic dialogs rendered after the page content, below the viewport; token parity did not catch the missing positioning. | Dialogs, alert dialogs and modal date/time pickers use viewport-constrained positioning and scrolling. CSS `translate` handles centering independently of animated `transform`. |
| High | Body-mounted overlays lost their nearest provider's theme and custom component tokens. | A shared portal scope carries computed custom properties, direction and color scheme while keeping overlays outside clipped ancestors. Provider theme updates and ancestor class/style changes refresh the scope. |
| High | The `expressive` palette silently selected `SchemeTonalSpot`. | Use the installed Material Color Utilities `SchemeExpressive` with the 2025 specification; test palette identity and foreground/background contrast. This intentionally changes the generated palette. |
| High | Wavy progress applied the percentage twice and failed to remeasure after resizing. | Measure the active segment once, observe its dimensions, reserve wave amplitude, bound strokes and hide completed trailing tracks. Null values now visibly indicate indeterminate progress. |
| High | Popup close/reopen could leave stale animation state; unmount did not cancel animation work. | Abort previous tasks, reject stale completions, handle reopening during exit, and cancel on unmount or a live reduced-motion change. |
| High | Button-based overlay triggers dropped native hover/focus/ref/ARIA props. | Forward native button props and compose interaction handlers so overlay behavior and visual feedback coexist. |
| Medium | Tooltip exit animation was attached to an unmanaged wrapper. | Animate the actual Base UI popup so its lifecycle can wait for exit. Use shared duration/easing values and preserve the current visual frame when interrupted. |
| Medium | Circular progress instances shared size-dependent global rotation origins; motion preference was sampled only at render. | Keep rotation origins local, preserve theme sizing through SVG view boxes, and subscribe to reduced-motion changes. |
| Medium | Connected groups initially animated from collapsed flex widths, creating a layout flash. | Initialize the resting flex layout on the first render, retaining spatial animation for subsequent presses. |
| Medium | Snackbars overflowed narrow viewports. | Constrain their width to the viewport while retaining the desktop maximum. |
| High | Generated registry copies imported helpers that were not exported by their published entrypoints. | Repair export/rewrite integration, regenerate the registry, and validate every named runtime import against actual exports. |

## Design decisions

Spatial movement and appearance changes must reach a stable, correct end state even when interrupted. Motion is subordinate to interaction: opening, dismissing, changing value, resizing and changing accessibility preferences must remain functional throughout animation.

Colors remain semantic and provider-scoped. Custom token overrides are carried across portals instead of introducing fixed overlay colors. Copying computed variables preserves class-based overrides; the portal remains body-mounted to avoid clipping and transformed-ancestor positioning problems.

The upstream references support the integration decisions, but do not prove visual completeness: [Base UI animation lifecycle](https://base-ui.com/react/handbook/animation), [Motion and Base UI](https://motion.dev/docs/base-ui), and [Material's Expressive scheme implementation](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/scheme/scheme_expressive.ts).

## Review surfaces

- `Foundations / Theme portals`: nested themes, custom dialog color, live theme updates, clipped provider, modal layouts, tooltip and snackbar.
- `Foundations / Progress geometry`: editable progress value and width, zero/completion/null states, and differently sized circular indicators.
- Existing `Foundations / Interaction polish` and the component gallery remain regression surfaces.

## Verification scope

Browser checks use isolated Chromium against local Storybook. Visual baselines were refreshed for the reviewed palette and geometry changes, then compared without updates.

- Workspace tests: 437 passed across 48 files.
- Component accessibility tests: 79 passed. The jsdom runner reports its existing canvas/scroll API limitations; real-browser gallery audits separately found zero WCAG A/AA violations in light and dark and zero uncaught exceptions.
- Typechecks: React, color and Storybook passed. Production-source lint: zero errors, 52 existing warning-class findings (including Fast Refresh exports).
- Color and React package builds passed. Main React entry: 324.3 KiB against a 325 KiB limit in the final build; budget headroom is small.
- Registry regenerated; all 44 component copies have runtime-export validation.
- Browser comparison: 80 checks passed; the remaining connected-group initial-layout check passed after its correction, with stronger assertions for all three initial widths. Thus all 81 browser checks passed across the comparison run and focused retest; this is not represented as a single uninterrupted green run.

Screenshots: [nested themed dialog](review-assets/2026-10-31/themed-dialog.png) and [progress geometry](review-assets/2026-10-31/progress-geometry.png).

This is not a declaration that every possible component composition is fully qualified. Firefox/WebKit, real assistive technology, arbitrary consumer CSS and every forced-color combination require separate coverage. Portal synchronization observes provider updates and ancestor attributes; stylesheet-rule replacement or media-query-only custom-token changes without those updates are not covered by that synchronization contract.

## Final review verdict

The identified fixes are accepted for this local change: the coordinator reviewed source changes against the preserved starting tree, inspected real light/dark and open-overlay screenshots, and checked the regression evidence. The final connected-group correction sets an explicit resting flex value and disables entrance interpolation without changing press/release animation. No identified blocking issue remains in this reviewed scope. No commit, push, merge or release was performed.
