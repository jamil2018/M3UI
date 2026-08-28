/**
 * Reviewed allowlist for md-comp tokens intentionally not referenced in component source.
 * Each entry documents why the token is excluded from direct CSS var usage.
 */
export interface TokenAllowlistEntry {
  /** Regex tested against full token name including `--md-comp-` prefix */
  pattern: RegExp;
  /** Human-readable justification for auditors */
  reason: string;
}

export const TOKEN_ALLOWLIST: TokenAllowlistEntry[] = [
  {
    pattern: /-(hover|hovered)-/,
    reason: 'Interaction state colors applied via StateLayer primitive, not direct token binding',
  },
  {
    pattern: /-(focus|focused)-/,
    reason: 'Focus state colors applied via StateLayer / focus-visible rings',
  },
  {
    pattern: /-pressed-/,
    reason: 'Pressed state handled by StateLayer opacity and shape morph, not per-token color',
  },
  {
    pattern: /-disabled-/,
    reason: 'Disabled styling uses shared DISABLED_CONTENT_OPACITY and variant disabled-* subset',
  },
  {
    pattern: /-selected-/,
    reason: 'Selected state tokens for toggle/segmented controls — subset referenced per variant',
  },
  {
    pattern: /-unselected-/,
    reason: 'Unselected state tokens for toggle groups — default state uses base container tokens',
  },
  {
    pattern: /-elevation/,
    reason: 'Elevation applied via elevationShadow() helper mapping to md-sys-elevation tokens',
  },
  {
    pattern: /-(label-text-font|supporting-text-font|headline-font|overline-font|body-font|title-font|subhead-font)/,
    reason: 'Typography uses typeStyle() mapping to md-sys-typescale, not comp font tokens',
  },
  {
    pattern: /-font$/,
    reason: 'Component font tokens deferred to sys typescale for web consistency',
  },
  {
    pattern: /-icon-color$/,
    reason: 'Icon color inherits from parent label/container color on web; dedicated icon-color tokens reserved for multi-tone icons',
  },
  {
    pattern: /-label-text-color$/,
    reason: 'Label color applied via parent color cascade or variant base token subset',
  },
  {
    pattern: /-label-color$/,
    reason: 'Text button label color applied via parent color property',
  },
  {
    pattern: /-state-layer-/,
    reason: 'State layer shape/size uses sys state-layer tokens via StateLayer primitive',
  },
  {
    pattern: /-dragged-/,
    reason: 'Drag-and-drop states not implemented on web in Phase 0–5',
  },
  {
    pattern: /placeholder-color/,
    reason: 'Input placeholder uses opacity on input-color rather than dedicated placeholder token',
  },
  {
    pattern: /input-prefix-color|input-suffix-color/,
    reason: 'Prefix/suffix slots inherit input-color on web',
  },
  {
    pattern: /list-item-leading-(avatar|image|video|icon-expressive)/,
    reason: 'List leading slot variants (avatar, video, expressive image) not exposed as separate APIs',
  },
  {
    pattern: /list-item-trailing-/,
    reason: 'List trailing slot sub-tokens — trailing content inherits item label colors',
  },
  {
    pattern: /list-divider-/,
    reason: 'List divider spacing uses item-between-space and divider component tokens',
  },
  {
    pattern: /list-item-(two-line|three-line|large-leading-video|small-leading-video|segmented)/,
    reason: 'Multi-line and video list layouts deferred — current ListItem uses flexible lines prop',
  },
  {
    pattern: /-card-icon-/,
    reason: 'Card media icons inherit foreground color on web',
  },
  {
    pattern: /inner-corner|inner-hovered-corner/,
    reason: 'Split button inner corner morph uses container-shape; inner corner tokens are Compose-only',
  },
  {
    pattern: /autocomplete-(text-field|field)-/,
    reason: 'Autocomplete reuses text-field tokens; dedicated autocomplete container tokens are redundant on web',
  },
  {
    pattern: /date-picker-modal-/,
    reason: 'Date picker modal sub-tokens partially mapped — calendar grid uses subset of modal tokens',
  },
  {
    pattern: /date-input-modal-/,
    reason: 'Date input modal picker tokens — inline date-input uses text-field + date-picker subset',
  },
  {
    pattern: /time-picker-period-/,
    reason: 'AM/PM period selector tokens — time picker uses dial + input field subset',
  },
  {
    pattern: /linear-progress-indicator-(?!height|active-wave)/,
    reason: 'Linear progress uses active-indicator and track color tokens; wave amplitude is the referenced subset',
  },
  {
    pattern: /circular-progress-indicator-(?!size)/,
    reason: 'Circular progress uses size + progress-indicator color tokens',
  },
  {
    pattern: /--md-comp-fab-small-/,
    reason: 'FAB size sm uses medium tokens in current API; small spec tokens reserved',
  },
  {
    pattern: /--md-comp-fab-large-/,
    reason: 'FAB size lg uses medium tokens in current API; large spec tokens reserved',
  },
  {
    pattern: /--md-comp-extended-fab-small-/,
    reason: 'Extended FAB only exposes medium size on web',
  },
  {
    pattern: /--md-comp-extended-fab-large-/,
    reason: 'Extended FAB only exposes medium size on web',
  },
  {
    pattern: /--md-comp-extended-fab-primary-(?!container)/,
    reason: 'Extended FAB primary variant uses extended-fab-medium size tokens + primary container color',
  },
  {
    pattern: /--md-comp-badge-small-/,
    reason: 'Badge small variant uses scaled medium tokens',
  },
  {
    pattern: /--md-comp-rich-tooltip-action-/,
    reason: 'Rich tooltip action slot not yet exposed as separate sub-component',
  },
  {
    pattern: /--md-comp-carousel-/,
    reason: 'Carousel uses elevated-card tokens; dedicated carousel tokens are Compose-only layout',
  },
  {
    pattern: /--md-comp-loading-indicator-container-/,
    reason: 'Loading indicator uses progress-indicator color tokens and shape morph',
  },
  {
    pattern: /text-field-caret-color|text-field-error-input-color/,
    reason: 'Caret and error input colors inherit from input-color and error label tokens',
  },
  {
    pattern: /text-field-label-color$/,
    reason: 'Label color uses focus-label-color / disabled-label-color dynamic tokens',
  },
  {
    pattern: /text-field-trailing-icon|text-field-leading-icon-size/,
    reason: 'Trailing icon uses icon-size token; leading icon size matches icon-size on web',
  },
  {
    pattern: /filled-tonal-button-container-(height|shape)|filled-tonal-button-icon-size/,
    reason: 'Filled tonal button uses shared button size tokens from buttonSizeTokens()',
  },
  {
    pattern: /\bicon-button-color$/,
    reason: 'Standard icon button color applied via variant color token subset',
  },
  {
    pattern: /switch-track-outline-width|switch-icon-handle|switch-state-layer/,
    reason: 'Switch track outline and icon handle tokens — handle uses selected-handle-* subset',
  },
  {
    pattern: /slider-(inactive-handle|handle-height|handle-width|stop-indicator)/,
    reason: 'Slider handle uses active-handle-width; inactive/stop tokens are Compose precision tokens',
  },
  {
    pattern: /navigation-(bar|rail|drawer)-.*-badge/,
    reason: 'Navigation badge overlays use Badge component tokens',
  },
  {
    pattern: /search-view-(?!header)/,
    reason: 'Search view body tokens — SearchView uses search-bar header subset',
  },
  {
    pattern: /menu-cascading|submenu-/,
    reason: 'Cascading submenu layout tokens — Menu uses flat list item tokens',
  },
  {
    pattern: /snackbar-(?!container|action|supporting)/,
    reason: 'Snackbar layout tokens beyond container/action/supporting text',
  },
  {
    pattern: /checkbox-state-layer-shape/,
    reason: 'Checkbox state layer uses sys state-layer-shape via StateLayer',
  },
  {
    pattern: /(filled|outlined)-card-container-(color|shape)$/,
    reason: 'Card variants use elevated-card token subset; filled/outlined map to variant container-color',
  },
  {
    pattern: /list-item-container-shape$/,
    reason: 'List item shape uses item-container-expressive-shape token',
  },
  {
    pattern: /rich-tooltip-(container|subhead|supporting)/,
    reason: 'Rich tooltip uses plain-tooltip container subset + typography cascade',
  },
  {
    pattern: /(assist|filter|input|suggestion)-chip-(elevated|flat)-/,
    reason: 'Chip elevated/flat sub-variant tokens resolved via getChipStyles dynamic keys',
  },
  {
    pattern: /input-chip-avatar/,
    reason: 'Input chip avatar slot not exposed — leading icon used instead',
  },
  {
    pattern: /filter-chip-(?!container)/,
    reason: 'Filter chip container tokens referenced; flat/elevated sub-keys use dynamic selected/unselected paths',
  },
  {
    pattern: /(assist|suggestion)-chip-(container-height|container-shape|icon-size|flat-outline)/,
    reason: 'Chip dimension tokens referenced via compVar(p, prop) — scanner uses chipPrefix expansion',
  },
  {
    pattern: /outlined-segmented-button-(?!container|selected|outline)/,
    reason: 'Segmented button uses outlined-segmented-button core token subset',
  },
  {
    pattern: /primary-navigation-tab-(?!active|container)/,
    reason: 'Primary tab uses active-indicator and container height tokens',
  },
  {
    pattern: /secondary-navigation-tab-(?!container|active)/,
    reason: 'Secondary tab uses container height and active indicator subset',
  },
  {
    pattern: /docked-toolbar-(?!container)/,
    reason: 'Docked toolbar uses container-height token',
  },
  {
    pattern: /floating-toolbar-(?!container|standard)/,
    reason: 'Floating toolbar uses standard container color/shape subset',
  },
  {
    pattern: /fab-menu-(?!baseline)/,
    reason: 'FAB menu uses baseline list item tokens',
  },
  {
    pattern: /time-input-(?!time-field)/,
    reason: 'Time input field tokens referenced; modal/dial tokens in time-picker component',
  },
  {
    pattern: /time-picker-(?!container|clock|period-select)/,
    reason: 'Time picker uses container, clock dial, and input field token subset',
  },
  {
    pattern: /navigation-drawer-modal-(?!container)/,
    reason: 'Side sheet uses navigation-drawer-modal container-color',
  },
  {
    pattern: /sheet-bottom-docked-(?!container|drag)/,
    reason: 'Bottom sheet uses container-color and drag-handle tokens',
  },
  {
    pattern: /app-bar-(?!small|medium|container)/,
    reason: 'Top app bar uses small/medium flexible container height tokens',
  },
  {
    pattern: /connected-button-group/,
    reason: 'Connected button group variant uses button-group-between-space tokens',
  },
  {
    pattern: /progress-indicator-(?!active|track)/,
    reason: 'Progress uses active-indicator-color and track-color tokens',
  },
  {
    pattern: /extended-fab-primary-container-(height|shape)/,
    reason: 'Extended FAB uses extended-fab-medium size tokens with primary container color',
  },
  {
    pattern: /list-item-leading-space$/,
    reason: 'List item horizontal padding uses divider-leading-space token',
  },
  {
    pattern: /chips-(avatar|height|label-text|trailing-icon)/,
    reason: 'Chip set container uses list segmented-gap; chips-* layout tokens are Compose chip-group spec',
  },
  {
    pattern: /slider-active-(handle|track)/,
    reason: 'Slider uses handle-width and active-track-color; handle padding/shape tokens are Compose precision',
  },
  {
    pattern: /slider-(label|value-indicator)/,
    reason: 'Slider value label not exposed in Phase 0–5 web API',
  },
  {
    pattern: /linear-progress-indicator-active-wave/,
    reason: 'Wavy progress uses SVG path generation; wave amplitude/wavelength approximated in wavy-path helper',
  },
  {
    pattern: /autocomplete-menu-container/,
    reason: 'Autocomplete menu reuses menu container-color and container-shape tokens',
  },
  {
    pattern: /app-bar-(container-shape|medium-)/,
    reason: 'Top app bar uses small container height + container-color; medium/flexible variants partially mapped',
  },
  {
    pattern: /bottom-app-bar-container-shape/,
    reason: 'Bottom app bar uses container-height and container-color tokens',
  },
  {
    pattern: /navigation-bar-(item-between|nav-shape|horizontal|vertical)/,
    reason: 'Navigation bar vertical layout tokens — web uses horizontal bar with active-indicator subset',
  },
  {
    pattern: /navigation-drawer-(active-indicator-width|bottom-container)/,
    reason: 'Navigation drawer uses active-indicator-color and container-width tokens',
  },
  {
    pattern: /navigation-rail-(collapsed|expanded|baseline|horizontal|vertical)/,
    reason: 'Navigation rail expanded/collapsed layout tokens — web uses collapsed width + active icon subset',
  },
  {
    pattern: /primary-navigation-tab-(container-shape|active-indicator-shape)/,
    reason: 'Tabs use active-indicator-color and container-height; shape tokens inherit from sys shape',
  },
  {
    pattern: /secondary-navigation-tab-container-shape/,
    reason: 'Secondary tabs use container-height token; shape from sys corner tokens',
  },
  {
    pattern: /search-bar-avatar/,
    reason: 'Search bar avatar slot not exposed — leading icon used instead',
  },
  {
    pattern: /search-view-header-supporting/,
    reason: 'Search view supporting text inherits header input text color cascade',
  },
  {
    pattern: /docked-toolbar-container-(max-spacing|trailing)/,
    reason: 'Docked toolbar uses container-height; spacing from list item-between-space',
  },
  {
    pattern: /floating-toolbar-container-trailing/,
    reason: 'Floating toolbar padding uses container-shape and standard container color',
  },
  {
    pattern: /time-picker-clock-dial-selector/,
    reason: 'Time picker dial selector uses clock-dial-color and handle tokens',
  },
  {
    pattern: /time-input-time-field-supporting/,
    reason: 'Time input supporting text uses text-field supporting-color pattern',
  },
];

export function isAllowlistedToken(token: string): TokenAllowlistEntry | undefined {
  return TOKEN_ALLOWLIST.find((entry) => entry.pattern.test(token));
}
