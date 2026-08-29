import type { ComponentExampleDefinition, ExamplesBySlug } from './types';
import { buttonExamples } from './button.examples';
import { checkboxExamples } from './checkbox.examples';
import { dialogExamples } from './dialog.examples';
import { tabsExamples } from './tabs.examples';
import { datePickerExamples } from './date-picker.examples';
import { adaptiveNavigationExamples } from './adaptive-navigation.examples';
import { iconButtonExamples } from './icon-button.examples';
import { textFieldExamples } from './text-field.examples';
import { selectExamples } from './select.examples';
import { switchExamples } from './switch.examples';
import { cardExamples } from './card.examples';
import { menuExamples } from './menu.examples';
import { snackbarExamples } from './snackbar.examples';
import { sliderExamples } from './slider.examples';
import { radioExamples } from './radio.examples';
import { fabExamples } from './fab.examples';
import { navigationBarExamples } from './navigation-bar.examples';
import {
  badgeExamples,
  chipExamples,
  tooltipExamples,
} from './communication.examples';
import {
  bottomSheetExamples,
  carouselExamples,
  dividerExamples,
  listExamples,
  sideSheetExamples,
} from './containment.examples';
import {
  loadingIndicatorExamples,
  meterExamples,
  progressExamples,
} from './feedback.examples';
import {
  bottomAppBarExamples,
  navigationDrawerExamples,
  navigationRailExamples,
  topAppBarExamples,
} from './navigation-extra.examples';
import {
  buttonGroupExamples,
  fabMenuExamples,
  splitButtonExamples,
  toolbarExamples,
} from './actions-extra.examples';
import {
  autocompleteExamples,
  dateInputExamples,
  searchExamples,
  segmentedButtonExamples,
  timePickerExamples,
} from './inputs-extra.examples';
import { paneScaffoldExamples, scaffoldExamples } from './layout.examples';

/** Shared examples keyed by catalog slug — consumed by docs and Storybook */
export const EXAMPLES_BY_SLUG: ExamplesBySlug = {
  button: buttonExamples,
  'icon-button': iconButtonExamples,
  fab: fabExamples,
  checkbox: checkboxExamples,
  radio: radioExamples,
  switch: switchExamples,
  'text-field': textFieldExamples,
  card: cardExamples,
  list: listExamples,
  divider: dividerExamples,
  badge: badgeExamples,
  tooltip: tooltipExamples,
  chip: chipExamples,
  'segmented-button': segmentedButtonExamples,
  slider: sliderExamples,
  menu: menuExamples,
  select: selectExamples,
  autocomplete: autocompleteExamples,
  progress: progressExamples,
  'loading-indicator': loadingIndicatorExamples,
  snackbar: snackbarExamples,
  meter: meterExamples,
  'top-app-bar': topAppBarExamples,
  'bottom-app-bar': bottomAppBarExamples,
  'navigation-bar': navigationBarExamples,
  'navigation-rail': navigationRailExamples,
  'navigation-drawer': navigationDrawerExamples,
  tabs: tabsExamples,
  search: searchExamples,
  dialog: dialogExamples,
  'bottom-sheet': bottomSheetExamples,
  'side-sheet': sideSheetExamples,
  carousel: carouselExamples,
  scaffold: scaffoldExamples,
  'button-group': buttonGroupExamples,
  'split-button': splitButtonExamples,
  'fab-menu': fabMenuExamples,
  toolbar: toolbarExamples,
  'date-input': dateInputExamples,
  'date-picker': datePickerExamples,
  'time-picker': timePickerExamples,
  'pane-scaffold': paneScaffoldExamples,
  'adaptive-navigation': adaptiveNavigationExamples,
};

export const PHASE1_EXAMPLE_SLUGS = [
  'button',
  'checkbox',
  'dialog',
  'tabs',
  'date-picker',
  'adaptive-navigation',
] as const;

export function getExamplesForSlug(slug: string): ComponentExampleDefinition[] {
  return EXAMPLES_BY_SLUG[slug] ?? [];
}

export function getAllExampleSlugs(): string[] {
  return Object.keys(EXAMPLES_BY_SLUG).sort();
}

export function getExampleCoverage(): { slug: string; count: number }[] {
  return getAllExampleSlugs().map((slug) => ({
    slug,
    count: EXAMPLES_BY_SLUG[slug]?.length ?? 0,
  }));
}
