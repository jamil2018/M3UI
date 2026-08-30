export { M3Provider, useM3, useM3Theme, useSetM3Seed, useM3Color } from './provider/index.js';
export type { M3ProviderProps, ColorScheme, Direction } from './provider/index.js';

export { StateLayer, Ripple, Surface } from './primitives/index.js';
export type { StateLayerProps, RippleProps, SurfaceProps } from './primitives/index.js';

export { Button } from './components/button.js';
export type { ButtonProps, ButtonVariant, ButtonShape } from './components/button.js';

export { IconButton } from './components/icon-button.js';
export type {
  IconButtonProps,
  IconButtonVariant,
  IconButtonShape,
  IconButtonWidth,
} from './components/icon-button.js';

export { Fab, ExtendedFab } from './components/fab.js';
export type { FabProps, ExtendedFabProps, FabSize } from './components/fab.js';

export { Checkbox, CheckboxGroup } from './components/checkbox.js';
export type { CheckboxProps, CheckboxGroupProps } from './components/checkbox.js';

export { Radio, RadioGroup } from './components/radio.js';
export type { RadioProps, RadioGroupProps } from './components/radio.js';

export { Switch } from './components/switch.js';
export type { SwitchProps } from './components/switch.js';

export { TextField } from './components/text-field.js';
export type { TextFieldProps, TextFieldVariant } from './components/text-field.js';

export { Card } from './components/card.js';
export type { CardProps, CardVariant } from './components/card.js';

export { List, ListItem } from './components/list.js';
export type { ListProps, ListItemProps, ListItemLines } from './components/list.js';

export { Divider } from './components/divider.js';
export type { DividerProps, DividerVariant } from './components/divider.js';

export { Badge } from './components/badge.js';
export type { BadgeProps, BadgeVariant } from './components/badge.js';

export { Tooltip, RichTooltip } from './components/tooltip.js';
export type { TooltipProps, RichTooltipProps } from './components/tooltip.js';

export { Chip, ChipSet, FilterChipGroup } from './components/chip.js';
export type { ChipProps, ChipType, ChipSetProps, FilterChipGroupProps } from './components/chip.js';

export { SegmentedButton, SegmentedButtonItem } from './components/segmented-button.js';
export type {
  SegmentedButtonProps,
  SegmentedButtonItemProps,
} from './components/segmented-button.js';

export { Slider } from './components/slider.js';
export type { SliderProps } from './components/slider.js';

export {
  Menu,
  MenuItem,
  MenuDivider,
  MenuSubmenu,
  ContextMenu,
  ContextMenuItem,
  Menubar,
  MenubarMenu,
} from './components/menu.js';
export type {
  MenuProps,
  MenuItemProps,
  MenuSubmenuProps,
  ContextMenuProps,
  MenubarProps,
  MenubarMenuProps,
} from './components/menu.js';

export { Select, ExposedDropdownMenu } from './components/select.js';
export type { SelectProps, SelectOption, SelectVariant, ExposedDropdownMenuProps } from './components/select.js';

export { Autocomplete, Combobox } from './components/autocomplete.js';
export type {
  AutocompleteProps,
  AutocompleteOption,
  AutocompleteVariant,
  ComboboxProps,
} from './components/autocomplete.js';

export { Progress, LinearProgress, CircularProgress } from './components/progress.js';
export type {
  ProgressProps,
  LinearProgressProps,
  CircularProgressProps,
  ProgressVariant,
} from './components/progress.js';

export { LoadingIndicator } from './components/loading-indicator.js';
export type { LoadingIndicatorProps } from './components/loading-indicator.js';

export {
  Snackbar,
  SnackbarProvider,
  useSnackbar,
  SNACKBAR_OFFSET_VAR,
} from './components/snackbar.js';
export type { SnackbarProviderProps, SnackbarOptions } from './components/snackbar.js';

export { Meter } from './components/meter.js';
export type { MeterProps } from './components/meter.js';

export { TopAppBar } from './components/top-app-bar.js';
export type { TopAppBarProps, TopAppBarSize } from './components/top-app-bar.js';

export { BottomAppBar } from './components/bottom-app-bar.js';
export type { BottomAppBarProps } from './components/bottom-app-bar.js';

export { NavigationBar } from './components/navigation-bar.js';
export type { NavigationBarProps, NavigationDestination } from './components/navigation-bar.js';

export { NavigationRail } from './components/navigation-rail.js';
export type { NavigationRailProps, NavigationRailDestination, NavigationRailMode } from './components/navigation-rail.js';

export { NavigationDrawer, NavigationDrawerTrigger } from './components/navigation-drawer.js';
export type {
  NavigationDrawerProps,
  NavigationDrawerItem,
  NavigationDrawerSection,
  NavigationDrawerVariant,
  NavigationDrawerTriggerProps,
} from './components/navigation-drawer.js';

export { Tabs, TabsPrimitive } from './components/tabs.js';
export type { TabsProps, TabItem, TabsVariant, TabsLayout } from './components/tabs.js';

export { SearchBar, SearchView } from './components/search.js';
export type { SearchBarProps, SearchViewProps, SearchSuggestion } from './components/search.js';

export { Dialog, AlertDialog, FullScreenDialog, DialogAction } from './components/dialog.js';
export type { DialogProps, AlertDialogProps, FullScreenDialogProps } from './components/dialog.js';

export { BottomSheet } from './components/bottom-sheet.js';
export type { BottomSheetProps, BottomSheetVariant } from './components/bottom-sheet.js';

export { SideSheet } from './components/side-sheet.js';
export type { SideSheetProps, SideSheetVariant, SideSheetSide } from './components/side-sheet.js';

export { Carousel } from './components/carousel.js';
export type { CarouselProps, CarouselItem, CarouselLayout } from './components/carousel.js';

export { Scaffold, FabAnchor } from './components/scaffold.js';
export type { ScaffoldProps } from './components/scaffold.js';

export { ButtonGroup, ButtonGroupItem } from './components/button-group.js';
export type { ButtonGroupProps, ButtonGroupItemProps, ButtonGroupVariant } from './components/button-group.js';

export { SplitButton } from './components/split-button.js';
export type { SplitButtonProps } from './components/split-button.js';

export { FabMenu } from './components/fab-menu.js';
export type { FabMenuProps, FabMenuAction } from './components/fab-menu.js';

export { Toolbar, ToolbarButton } from './components/toolbar.js';
export type { ToolbarProps, ToolbarButtonProps, ToolbarVariant, ToolbarOrientation } from './components/toolbar.js';

export { DateInput } from './components/date-input.js';
export type { DateInputProps, DateInputVariant } from './components/date-input.js';

export { DatePicker } from './components/date-picker.js';
export type { DatePickerProps, DatePickerVariant, DatePickerInputMode } from './components/date-picker.js';

export { TimePicker } from './components/time-picker.js';
export type { TimePickerProps, TimePickerVariant, TimeFormat, TimeValue } from './components/time-picker.js';

export { PaneScaffold, PaneScaffoldRoot } from './components/pane-scaffold.js';
export type { PaneScaffoldProps, PaneLayout, PaneScaffoldLayout } from './components/pane-scaffold.js';

export { AdaptiveNavigation, resolveAdaptiveNavMode } from './components/adaptive-navigation.js';
export type { AdaptiveNavigationProps, AdaptiveNavMode } from './components/adaptive-navigation.js';

export {
  M3I18nProvider,
  useM3I18n,
  useM3Message,
  M3_MESSAGE_KEYS,
  ENGLISH_DEFAULTS,
  getWeekStart,
} from './lib/i18n.js';
export type { M3MessageKey, M3Messages, M3I18nContextValue } from './lib/i18n.js';

export {
  WindowSizeClassProvider,
  useWindowSizeClass,
  useContainerSizeClass,
  widthToSizeClass,
  sizeClassAtLeast,
  SIZE_CLASS_BREAKPOINTS,
  SIZE_CLASS_QUERY,
} from './lib/window-size-class.js';
export type { WindowSizeClass, WindowSizeClassContextValue } from './lib/window-size-class.js';

export {
  generateMonthGrid,
  navigateGrid,
  navigateMonth,
  navigateYear,
  selectDate,
  createInitialCalendarState,
  getWeekdayLabels,
  CalendarDate,
  today as calendarToday,
} from './lib/calendar-engine.js';
export type {
  CalendarSelectionMode,
  CalendarDayCell,
  CalendarMonthGrid,
  CalendarEngineOptions,
  CalendarSelectionState,
} from './lib/calendar-engine.js';

export { ShapeCrop, MaterialShapes } from './lib/shape-crop.js';
export type { ShapeCropProps, MaterialShapeName } from './lib/shape-crop.js';

export {
  InsetProvider,
  useM3InsetRegister,
  useRegisterInset,
  M3_INSET_TOP,
  M3_INSET_BOTTOM,
  M3_FAB_OFFSET,
} from './lib/inset-context.js';
export type { InsetProviderProps } from './lib/inset-context.js';

export { OverlayMotion, ScrimMotion } from './lib/overlay-motion.js';
export type { OverlayMotionProps, ScrimMotionProps } from './lib/overlay-motion.js';

export { PressableShell } from './lib/pressable-shell.js';
export type { PressableShellProps } from './lib/pressable-shell.js';
export { PopupMotion } from './lib/popup-motion.js';
export type { PopupMotionProps } from './lib/popup-motion.js';
export { generateLinearWavePath, generateCircularWavePath } from './lib/wavy-path.js';

export {
  compVar,
  sysColor,
  sysShape,
  typeStyle,
  elevationShadow,
  compElevation,
  buttonSizeTokens,
  iconButtonSizeTokens,
  DISABLED_CONTENT_OPACITY,
  BUTTON_SIZES,
  BUTTON_SIZE_PREFIX,
  ICON_BUTTON_SIZE_PREFIX,
} from './lib/token-utils.js';
export type { ButtonSize } from './lib/token-utils.js';

export {
  fieldToken,
  fieldTokenPrefix,
  fieldWrapStyles,
  fieldLabelStyles,
  fieldInputStyles,
  fieldSupportingStyles,
  fieldIconStyles,
  fieldTriggerStyles,
  fieldLeadingSpace,
  fieldContainerHeight,
} from './lib/field-internals.js';
export type { FieldVariant, FieldInteractionState } from './lib/field-internals.js';

export {
  DialogMotionStyles,
  DialogMotionContainer,
  useDialogMotionRefs,
  useDialogWaapi,
} from './lib/dialog-motion.js';
export { MenuMotionPopup } from './lib/menu-motion.js';
export type { MenuMotionPopupProps } from './lib/menu-motion.js';
export { composeRefs } from './lib/use-popup-waapi.js';

/** @deprecated Use Button instead — kept for registry install testing */
export { PlaceholderButton } from './components/placeholder-button.js';
export type { PlaceholderButtonProps } from './components/placeholder-button.js';

export type { ContrastPreference } from '@m3ui/color';
export { Icon } from '@m3ui/icons';
export type { IconProps } from '@m3ui/icons';

export {
  COMPONENT_CATALOG,
  CATALOG_CATEGORIES,
  CONFORMANCE_SOURCES,
  getCatalogEntry,
  getPublicCatalogEntries,
} from './catalog/index.js';
export type {
  ComponentConformance,
  ConformanceSource,
  ConformanceStatus,
} from './catalog/index.js';
