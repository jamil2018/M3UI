# Registry install — public export surface

Registry items rewrite internal imports to published npm specifiers. Most symbols come from `@m3ui/react`; a few use documented subpaths.

## Main package (`@m3ui/react`)

These utilities are imported by registry payloads and are exported from `src/index.ts`:

| Symbol | Used by |
|--------|---------|
| `compVar`, `typeStyle`, `elevationShadow`, `compElevation` | Most components |
| `buttonSizeTokens`, `iconButtonSizeTokens` | Button, icon-button, split-button |
| `PressableShell` | Button, icon-button, navigation-bar, … |
| `PopupMotion` | Select, autocomplete, menu, date-picker |
| `DialogMotionStyles`, `MenuMotionPopup` | Menu |
| `fieldToken`, `fieldTokenPrefix`, `fieldTriggerStyles`, `fieldIconStyles`, `fieldSupportingStyles` | Select, text-field |
| `OverlayMotion`, `ScrimMotion` | Dialog, bottom-sheet, side-sheet |
| `useRegisterInset` | Navigation-bar, bottom-app-bar, toolbar |
| `generateMonthGrid`, `navigateGrid`, … | Date-picker |
| `useM3I18n`, `useM3Message` | Date-picker, time-picker |
| `useWindowSizeClass`, `sizeClassAtLeast` | Date-picker, adaptive-navigation |

No additional root exports are required for current registry items once the gates worker adds the symbols above to `src/index.ts`.

## Subpath imports (published)

| Import | Used by | Notes |
|--------|---------|-------|
| `@m3ui/react/provider` (`useM3`) | Date-picker | Provider hooks stay on subpath to avoid pulling client code into RSC boundaries |

## Token CSS (CLI / app setup)

Apps should import published token entry points — not `dist/` or `src/generated/` paths:

```css
@import "@m3ui/tokens/tokens.css";
@import "@m3ui/tokens/theme.css";
```

`m3ui init` and `m3ui theme generate` prepend these imports automatically.

## When to extend `index.ts`

Prefer documenting new registry-only symbols here first. Add to `src/index.ts` only when:

- The symbol is part of the stable public API, and
- The gates worker has merged catalog/conformance changes without conflict.

See also [docs/PARITY-SYNC.md](../../docs/PARITY-SYNC.md) for merge ownership of `index.ts`.
