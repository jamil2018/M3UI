# Expressive fidelity and motion polish

Reviewed on 2026-10-17. This is a targeted fidelity pass over the existing working tree, not a claim of complete Material equivalence.

## Reference decisions

The runtime and generated CSS now use AndroidX [ExpressiveMotionTokens v0_14_0](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt):

| Channel                           | Fast      | Default   | Slow      |
| --------------------------------- | --------- | --------- | --------- |
| Spatial stiffness / damping ratio | 800 / 0.6 | 380 / 0.8 | 200 / 0.8 |
| Effects stiffness / damping ratio | 3800 / 1  | 1600 / 1  | 800 / 1   |

The previous spatial values (1400/700/300, ratio 0.9) belong to the standard scheme. Motion's damping coefficient is calculated as `2 * ratio * sqrt(stiffness * mass)`, with mass 1. Spatial springs govern position, size, and shape; critically damped effects govern opacity. Material Web's pinned duration/easing data remains unchanged. Codegen deliberately selects the AndroidX Expressive spring scheme over Material Web's standard springs, without rewriting raw upstream snapshots.

[Material's motion guidance](https://m3.material.io/styles/motion/overview/how-it-works) and [AndroidX MotionScheme](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MotionScheme.kt) distinguish these two animation channels. Browser adaptation still requires visual judgment; matching spring parameters does not establish pixel or timing equivalence to Android.

The loading indicator follows the [AndroidX implementation](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/LoadingIndicator.kt): 650 ms morph cadence, 4666 ms continuous global rotation, quarter-turn rotation with each morph, and a dedicated stiffness-200 / ratio-0.6 morph spring. Rotation accumulates across the seven-shape cycle instead of reversing at its boundary.

## Corrections

- Press shapes resolve CSS variables and `calc()` into computed corner values before spring interpolation. Interrupted animations resume from their current shape; release uses the default spatial spring.
- Toggle icon buttons sit inside their focus/ripple shell. Their circle-to-pentagon endpoints stay fixed while selection drives progress.
- Tab indicators use layout spring animation, with the first unmeasured indicator remounted after layout measurement.
- Selection marks, popups, calendar transitions, snackbars, and FAB menus use separate spatial/effects channels. Select no longer combines a wrapper scale animation with its Material Web menu choreography.
- Bottom and side sheets animate the entire popup surface and retain portals through exit using Base UI's documented Motion integration. Backdrops preserve Base UI props/ref and animate to their specified opacity (normally 0.32).
- Morph cache identity includes complete geometry. Shapes with matching bounds and segment counts no longer share incorrect cached paths; each frame reuses the existing Morph instance.
- State layers no longer have inline opacity suppressing their interaction rules. Hover, focus, press, and drag replace each other instead of stacking. Keyboard-highlighted menu items receive focus feedback.
- Focus rings recover when a clicked control is subsequently used with the keyboard. The native outline is suppressed only while the custom ring is visible.
- Press shapes reset on blur, narrow icon buttons retain their intended width, and shared shell layout dimensions reach the outer focus wrapper so connected groups can redistribute visible button widths.
- Ripple geometry compensates for zoom once, honors reduced motion, rejects stale delayed touch starts, and cancels animations on disable/unmount.
- Slider field labels use surface content color; inverse label color belongs to the value bubble.
- Tokens are declared at each `data-m3-root` as well as `:root`, allowing component aliases to resolve against that provider's theme. The Storybook canvas also paints the provider's background.
- Docs and Storybook load the existing `material-symbols` dependency locally through `@m3ui/icons/font.css`. The CDN loader remains available to consumers who do not import the optional stylesheet.

## Verification

Browser regressions live in `tools/vrt/tests/interaction-polish.spec.ts` and `motion-polish.spec.ts`. They check computed interaction states, zoom geometry, reduced motion, theme scoping, actual intermediate animation frames, selected morph endpoints, complete sheet exits, connected-group width changes, and a full loading cycle. The `Foundations/Interaction polish` stories provide a manual review surface.

The accessibility audit covers the resting public examples in light and dark themes after entrance animations settle. It does not establish accessibility of every possible composition or every open overlay. Existing upstream parity allowlists and documented adaptations remain in effect.

### Final results

- Full workspace build and type checks passed.
- Workspace tests: 377 passed (including 330 React component/contract tests).
- Component accessibility tests: 79 passed.
- Playwright: 71 passed against the updated snapshots, then 71 passed again without snapshot updates.
- Browser axe audit: 43 public resting examples in each of light and dark themes, no violations or uncaught runtime exceptions after entrance animations settled.
- Bundle budgets and parity gate passed. Main React entry: 320.8 KB minified raw against 325 KB budget.
- Lint passed with existing warning classes (including Fast Refresh export warnings); zero errors.

To use a separately running Storybook, run `STORYBOOK_BASE_URL=http://localhost:6007 pnpm exec playwright test`. Otherwise the normal VRT server setup is unchanged.

Component token overrides intended for one provider should be set on that provider's `style`/class or `[data-m3-root]`. A component alias set only on `:root` can be shadowed by the provider's scoped declaration. This is the CSS scoping tradeoff that allows nested themes to resolve correctly.
