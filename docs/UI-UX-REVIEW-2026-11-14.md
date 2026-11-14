# UI/UX and dependency review — 2026-11-14

## Design direction

Usability, coherent visual states and predictable interactions take precedence over literal Material 3 conformance. Semantic colors, themes, accessible input and motion preferences remain part of the contract. Spec-reference reports describe lineage, not proof of usability.

The workspace contained substantial prior uncommitted work. This pass preserved it and iterated with an independent reviewer through five rounds. The subsequent shipping request includes the complete project changes; package publishing remains separate.

## Corrections

- Search submits the current uncontrolled text, disables submission with its field, names inputs and results, provides an empty state, and positions the search modal within the viewport.
- Calendar selection initializes from controlled values, publishes docked changes, moves actual keyboard focus, guards unavailable dates and exposes full date labels. Date entry preserves partial text and only publishes complete valid dates. Invalid or cleared drafts block confirmation; switching input modes restores a valid editing state.
- Range input has separate labeled start/end fields, checks ordering and displays both selected endpoints. A single month preserves usable day targets at narrow widths. The previously nonfunctional multiple-selection picker mode is excluded from DatePicker's public type; the separate calendar engine still supports it.
- Time input preserves editable text, rejects invalid values with visible feedback, and blocks confirmation until valid. Clock labels, rings, pointer coordinates and selector centering now agree for 12h, 24h and minutes. Keyboard arrows prevent scrolling; unrelated keys do not mutate values.
- Sliders no longer translate their thumbs twice. Horizontal track corners are rounded on the correct ends. Browser assertions compare track/thumb centers.
- Standard icon hover/focus/press colors use the unselected surface colors, avoiding white icons on light backgrounds.
- Carousel uses stable responsive slide widths, native scroll snapping and visible previous/next controls. Segmented controls fit their content instead of leaving an empty outlined tail.
- Navigation destinations expose current-page semantics and icon-only labels; adaptive navigation retains selection across layout changes. Modal navigation has viewport positioning and explicit dismissal controls. Modal layering sits above fixed app chrome.
- Preview frames contain fixed navigation and provide breathing room. The documentation homepage uses a readable heading scale and removes a nested main landmark.

## Dependency and build changes

Updated workspace dependencies within their supported release ranges, including Next, Storybook, Vite, Vitest, Playwright, Motion and Fumadocs. Removed the old patched Next ESLint plugin and its fast-glob alias; upstream package behavior is covered by the retained root-glob/internal-link checks. Scoped overrides select fixed upstream minimatch 11 and glob 14 releases where parent constraints lag. The final audit reports zero vulnerabilities (initial audit: one high, two moderate).

React build now emits minified ESM plus source maps, matching its documented budget, and cleans stale chunks. Final main entry is 211.1 KiB raw / 47.9 KiB gzip, below the 325 KiB working-tree budget. All package budgets pass. Export and React server-boundary tests pass against the minified artifact.

## Review evidence

- Workspace check: 37 tasks passed, including lint, types, unit tests and 79 accessibility tests. Existing warning-level lint and jsdom canvas/act messages remain; no check errors.
- Full production build: 12 tasks passed.
- Focused usability regressions cover search, navigation, date typing/constraints/recovery, and time keyboard behavior.
- Final production-build interaction, motion, portal and documentation regressions: 36 passed, including docs live preview and mobile/tablet/desktop layouts.
- Production export and React server-boundary checks: 186 passed.
- Chromium and WebKit review matrices: 182 passed (91 per browser).
- Visual baselines were refreshed after review: 60 passed. A subsequent unchanged comparison also passed all 60.
- Catalog matrix: all 43 public components at desktop light and narrow dark sizes; page exceptions and horizontal overflow checked. Twelve open overlays checked at 320 and 1000 pixels, with settled screenshots. Slider/clock centering and focused icon colors have browser assertions.
- Screenshots are in `review-assets/2026-11-14/`; the repeatable review suite is `playwright.review.config.ts`.

The initial focused review received a scoped 9/10 engineering usability assessment. The broader follow-up below found further defects, so that score was not a project-wide certification. Real assistive-technology and representative human task testing remain necessary for a measured usability score.

The initial Firefox startup gap was resolved during the follow-up below; the earlier result is superseded by the subsequent browser qualification.

The strict spec/parity and bundle gates used by CI pass. These preserve the repository's existing compatibility checks without treating literal spec fidelity as the design goal. The shipping review covers the combined diff, including pre-existing workspace changes.

## Follow-up: broader independent review

The user requested deeper verification after the initial scoped review. The next full pass found additional defects that resting screenshots and the earlier focused review had missed. These were fixed and reviewed again:

- FAB Menu now uses collision-aware Base UI menu positioning, focus management, arrow-key navigation, Escape dismissal and focus return. Its open-state icon is an X.
- Interactive cards and list items use native primary-action buttons alongside their content, preserving independent secondary buttons without nesting interactive controls.
- Autocomplete and Combobox consume filtered results, show an empty state and visible keyboard highlighting, and search displayed text rather than internal IDs. Rich labels can provide `textValue`. Input groups now have real anchor geometry. Select renders the initial option label rather than its ID.
- Portal layers increase with React portal nesting, so a dialog's child select, autocomplete, menu or dialog stays above its parent. Browser tests verify actual hit targets.
- Removable chips expose separate named activation/removal buttons. IconButton and FAB forward native trigger props and refs. Collapsed ExtendedFab retains its accessible name.
- Select and multiline text fields expose invalid state and associated error descriptions. SearchView scrolls keyboard-selected results into view. Keyboard use restores a focus ring after pointer interaction across browsers.
- Outlined notches align with labels in both directions. Split-button corners follow the writing direction.
- Small app bars keep subtitle and title within the navigation row. Expanded sizes reserve sufficient title/subtitle space. Flexible bars retain the title at 64px collapsed height and hide the subtitle; scroll anchoring is temporarily disabled on the owning scroll container to prevent collapse feedback, then restored on unmount.

The final independent reviewer accepted these fixes, including live pointer separation, LTR/RTL notch alignment, RTL corner geometry, all five app-bar sizes and both collapsed flexible bars at 320px. Baseline refresh was held until these visual defects were corrected and accepted.

## Firefox investigation and repeatable browser testing

The startup error was reproduced outside the test runner with an existing writable profile. A fresh profile alone did not fix it. Isolating Firefox's application-data roots using `MOZ_APP_DATA` and `MOZ_LOCAL_APP_DATA` allowed the same Firefox 159 binary to launch and render successfully. The worker fixture creates and cleans these directories; personal browser data and system privacy settings are untouched. This follows [Mozilla's automation guidance](https://bugzilla.mozilla.org/show_bug.cgi?id=2078511).

Further tests exposed intermittent native content-process crashes in both headed and headless runs. Animation and worker-count probes did not reliably eliminate them. The browser accessibility matrix also exposed competing axe runs from Storybook's automatic addon and our explicit audits. Storybook URL globals encoded `true` as a string; its manual-audit check requires boolean `true`, encoded as `!true`. The shared test URL builder now correctly encodes booleans and requests manual addon mode. Playwright owns the explicit audit schedule instead. The subsequent full headless Firefox run passed 125 checks without browser flags, disabled product motion or retries. This is observed harness qualification, not a claim that an upstream native engine defect was patched.

Browser accessibility tests are included in the default CI browser suite. They audit settled rendered content, including computed contrast, across 43 desktop examples, 43 dark/mobile examples and 12 open overlays. They supplement rather than replace representative human and assistive-technology evaluation.


## Final verification after the follow-up

- Full three-browser review: **482 passed** — 128 design, composition, geometry and motion checks in each of Chromium, Firefox and WebKit, plus 98 Chromium accessibility audits. Firefox ran headless with normal settings and zero retries.
- Workspace checks: **37 tasks passed**, including 79 accessibility tests, unit tests, types and lint.
- Production build: **12 tasks passed**.
- Strict spec/parity and bundle budgets: passed. Dependency audit: **no known vulnerabilities**.
- Reviewed visual baseline refresh: **60 passed**. The subsequent default CI browser suite passed **292 tests**, including all 60 unchanged visual comparisons, browser accessibility checks, component interactions and responsive documentation checks.
- Final independent review: all reported interaction and visual findings resolved; no additional actionable anomaly identified in the reviewed scope.

Repeatable commands (after `pnpm build`):

```sh
pnpm check
SPEC_PARITY_STRICT=1 pnpm parity:gates
pnpm audit --audit-level=low
pnpm exec playwright test --config playwright.review.config.ts --workers 3
pnpm exec playwright test --workers 2
```

The browser fixtures isolate Firefox application data and clean it on teardown. Tests explicitly own accessibility-audit timing; the normal Storybook UI keeps its automatic addon configuration. No test skips, browser security reductions, disabled product animations were needed for the final passing review.

## Shipping review

The aggregate diff raises raw bundle budgets relative to main: React 275 → 325 KiB, primitives 28 → 29 KiB, tokens 140 → 170 KiB. The final React entry remains below both its old and new budgets. The independent shipping review also corrected connected-button RTL corners and side-sheet entry/exit and swipe direction. Linux CI remains a separate merge gate from the macOS checks above.

Shipping code review additionally corrected grouped checkbox selection/disabled visuals, inherited radio-group disabled styling, and SearchBar suggestion layering inside dialogs. Regression coverage includes initial and externally controlled checkbox selection, connected corners and both sheet sides in LTR/RTL, and a clickable nested search suggestion.
