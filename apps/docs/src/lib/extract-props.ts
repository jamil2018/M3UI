import fs from 'node:fs';
import path from 'node:path';
import type { PropDefinition } from '@/components/doc/types';

const COMPONENTS_DIR = path.join(process.cwd(), '../../packages/react/src/components');

/** Map catalog slug to primary props interface name */
const PROPS_INTERFACE_BY_SLUG: Record<string, string> = {
  button: 'ButtonProps',
  'icon-button': 'IconButtonProps',
  fab: 'FabProps',
  checkbox: 'CheckboxProps',
  radio: 'RadioProps',
  switch: 'SwitchProps',
  'text-field': 'TextFieldProps',
  card: 'CardProps',
  list: 'ListProps',
  divider: 'DividerProps',
  badge: 'BadgeProps',
  tooltip: 'TooltipProps',
  chip: 'ChipProps',
  'segmented-button': 'SegmentedButtonProps',
  slider: 'SliderProps',
  menu: 'MenuProps',
  select: 'SelectProps',
  autocomplete: 'AutocompleteProps',
  progress: 'ProgressProps',
  'loading-indicator': 'LoadingIndicatorProps',
  snackbar: 'SnackbarProps',
  meter: 'MeterProps',
  'top-app-bar': 'TopAppBarProps',
  'bottom-app-bar': 'BottomAppBarProps',
  'navigation-bar': 'NavigationBarProps',
  'navigation-rail': 'NavigationRailProps',
  'navigation-drawer': 'NavigationDrawerProps',
  tabs: 'TabsProps',
  search: 'SearchProps',
  dialog: 'DialogProps',
  'bottom-sheet': 'BottomSheetProps',
  'side-sheet': 'SideSheetProps',
  carousel: 'CarouselProps',
  scaffold: 'ScaffoldProps',
  'button-group': 'ButtonGroupProps',
  'split-button': 'SplitButtonProps',
  'fab-menu': 'FabMenuProps',
  toolbar: 'ToolbarProps',
  'date-input': 'DateInputProps',
  'date-picker': 'DatePickerProps',
  'time-picker': 'TimePickerProps',
  'pane-scaffold': 'PaneScaffoldProps',
  'adaptive-navigation': 'AdaptiveNavigationProps',
};

function slugToSourceFile(slug: string): string {
  return path.join(COMPONENTS_DIR, `${slug}.tsx`);
}

/**
 * Best-effort extraction of `interface *Props` from component source.
 * Falls back to an empty list when the file or interface is missing.
 */
export function extractPropsFromSource(slug: string, interfaceName?: string): PropDefinition[] {
  const filePath = slugToSourceFile(slug);
  const resolvedInterface = interfaceName ?? PROPS_INTERFACE_BY_SLUG[slug];

  if (!resolvedInterface) {
    return [];
  }

  let source: string;
  try {
    source = fs.readFileSync(filePath, 'utf8');
  } catch {
    return [];
  }

  const interfacePattern = new RegExp(
    `export\\s+interface\\s+${resolvedInterface}\\s*\\{([\\s\\S]*?)\\n\\}`,
  );
  const match = interfacePattern.exec(source);
  if (!match?.[1]) {
    return [];
  }

  const body = match[1];
  const props: PropDefinition[] = [];

  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('/**') || trimmed.startsWith('*') || trimmed.startsWith('//')) {
      continue;
    }

    const propMatch = /^(['"]?[\w-]+['"]?)(\?)?:\s*(.+?);(?:\s*\/\/\s*(.+))?$/.exec(trimmed);
    if (!propMatch) {
      continue;
    }

    const [, rawName, optional, rawType, inlineComment] = propMatch;
    const name = rawName!.replace(/^['"]|['"]$/g, '');

    props.push({
      name,
      type: rawType!.trim(),
      required: !optional,
      description: inlineComment?.trim(),
    });
  }

  return props;
}

/** Merge auto-extracted props with manual overrides (overrides win by name) */
export function mergePropDefinitions(
  extracted: PropDefinition[],
  overrides: PropDefinition[] = [],
): PropDefinition[] {
  const byName = new Map<string, PropDefinition>();
  for (const prop of extracted) {
    byName.set(prop.name, prop);
  }
  for (const override of overrides) {
    byName.set(override.name, { ...byName.get(override.name), ...override });
  }
  return Array.from(byName.values());
}
