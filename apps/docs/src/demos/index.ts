'use client';

import type { ComponentType } from 'react';
import {
  ButtonDemo,
  IconButtonDemo,
  FabDemo,
  ButtonGroupDemo,
  SplitButtonDemo,
  FabMenuDemo,
  ToolbarDemo,
} from './sections/actions';
import {
  TextFieldDemo,
  SelectDemo,
  AutocompleteDemo,
  SearchDemo,
  DateInputDemo,
  DatePickerDemo,
  TimePickerDemo,
} from './sections/inputs';
import {
  CheckboxDemo,
  RadioDemo,
  SwitchDemo,
  SegmentedButtonDemo,
  SliderDemo,
} from './sections/selection';
import { BadgeDemo, TooltipDemo, ChipDemo } from './sections/communication';
import {
  CardDemo,
  ListDemo,
  DividerDemo,
  TabsDemo,
  DialogDemo,
  BottomSheetDemo,
  SideSheetDemo,
  CarouselDemo,
} from './sections/containment';
import { MenuDemo } from './sections/menu';
import {
  TopAppBarDemo,
  BottomAppBarDemo,
  NavigationBarDemo,
  NavigationRailDemo,
  NavigationDrawerDemo,
  AdaptiveNavigationDemo,
} from './sections/navigation';
import {
  ProgressDemo,
  LoadingIndicatorDemo,
  SnackbarDemo,
  MeterDemo,
} from './sections/feedback';
import { ScaffoldDemo, PaneScaffoldDemo } from './sections/layout';

export const DEMO_MAP: Record<string, ComponentType> = {
  button: ButtonDemo,
  'icon-button': IconButtonDemo,
  fab: FabDemo,
  'button-group': ButtonGroupDemo,
  'split-button': SplitButtonDemo,
  'fab-menu': FabMenuDemo,
  toolbar: ToolbarDemo,
  'text-field': TextFieldDemo,
  select: SelectDemo,
  autocomplete: AutocompleteDemo,
  search: SearchDemo,
  'date-input': DateInputDemo,
  'date-picker': DatePickerDemo,
  'time-picker': TimePickerDemo,
  checkbox: CheckboxDemo,
  radio: RadioDemo,
  switch: SwitchDemo,
  'segmented-button': SegmentedButtonDemo,
  slider: SliderDemo,
  badge: BadgeDemo,
  tooltip: TooltipDemo,
  chip: ChipDemo,
  card: CardDemo,
  list: ListDemo,
  divider: DividerDemo,
  tabs: TabsDemo,
  dialog: DialogDemo,
  'bottom-sheet': BottomSheetDemo,
  'side-sheet': SideSheetDemo,
  carousel: CarouselDemo,
  menu: MenuDemo,
  'top-app-bar': TopAppBarDemo,
  'bottom-app-bar': BottomAppBarDemo,
  'navigation-bar': NavigationBarDemo,
  'navigation-rail': NavigationRailDemo,
  'navigation-drawer': NavigationDrawerDemo,
  'adaptive-navigation': AdaptiveNavigationDemo,
  progress: ProgressDemo,
  'loading-indicator': LoadingIndicatorDemo,
  snackbar: SnackbarDemo,
  meter: MeterDemo,
  scaffold: ScaffoldDemo,
  'pane-scaffold': PaneScaffoldDemo,
};

export function getComponentDemo(slug: string): ComponentType | undefined {
  return DEMO_MAP[slug];
}

export function hasComponentDemo(slug: string): boolean {
  return slug in DEMO_MAP;
}

export {
  ButtonDemo,
  IconButtonDemo,
  FabDemo,
  ButtonGroupDemo,
  SplitButtonDemo,
  FabMenuDemo,
  ToolbarDemo,
  TextFieldDemo,
  SelectDemo,
  AutocompleteDemo,
  SearchDemo,
  DateInputDemo,
  DatePickerDemo,
  TimePickerDemo,
  CheckboxDemo,
  RadioDemo,
  SwitchDemo,
  SegmentedButtonDemo,
  SliderDemo,
  BadgeDemo,
  TooltipDemo,
  ChipDemo,
  CardDemo,
  ListDemo,
  DividerDemo,
  TabsDemo,
  DialogDemo,
  BottomSheetDemo,
  SideSheetDemo,
  CarouselDemo,
  MenuDemo,
  TopAppBarDemo,
  BottomAppBarDemo,
  NavigationBarDemo,
  NavigationRailDemo,
  NavigationDrawerDemo,
  AdaptiveNavigationDemo,
  ProgressDemo,
  LoadingIndicatorDemo,
  SnackbarDemo,
  MeterDemo,
  ScaffoldDemo,
  PaneScaffoldDemo,
};
