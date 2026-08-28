
import { motion, AnimatePresence } from 'motion/react';
import { springs } from '@m3ui/motion';
import { type CSSProperties, type ReactNode } from 'react';
import { useWindowSizeClass, sizeClassAtLeast, WindowSizeClassProvider } from '../lib/window-size-class.js';
import { NavigationBar, type NavigationDestination } from './navigation-bar.js';
import { NavigationRail, type NavigationRailDestination } from './navigation-rail.js';
import { NavigationDrawer, type NavigationDrawerSection } from './navigation-drawer.js';

export type AdaptiveNavMode = 'bar' | 'rail' | 'drawer';

export interface AdaptiveNavigationProps {
  destinations: NavigationDestination[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Drawer sections for expanded layouts. */
  drawerSections?: NavigationDrawerSection[];
  drawerHeader?: ReactNode;
  railHeader?: ReactNode;
  /** Force a specific mode (overrides size class). */
  mode?: AdaptiveNavMode;
  className?: string;
  'data-testid'?: string;
}

function resolveMode(sizeClass: ReturnType<typeof useWindowSizeClass>['sizeClass'], forced?: AdaptiveNavMode): AdaptiveNavMode {
  if (forced) return forced;
  if (sizeClassAtLeast(sizeClass, 'large')) return 'drawer';
  if (sizeClassAtLeast(sizeClass, 'medium')) return 'rail';
  return 'bar';
}

function AdaptiveNavigationInner({
  destinations,
  value,
  defaultValue,
  onValueChange,
  drawerSections,
  drawerHeader,
  railHeader,
  mode: forcedMode,
  className,
  'data-testid': testId,
}: AdaptiveNavigationProps) {
  const { sizeClass } = useWindowSizeClass();
  const mode = resolveMode(sizeClass, forcedMode);

  const railDestinations: NavigationRailDestination[] = destinations.map((d) => ({
    value: d.value,
    label: d.label,
    icon: d.icon,
    badge: d.badge,
  }));

  const sections: NavigationDrawerSection[] =
    drawerSections ??
    [
      {
        items: destinations.map((d) => ({
          value: d.value,
          label: d.label,
          icon: d.icon,
          badge: d.badge,
        })),
      },
    ];

  const containerStyle: CSSProperties = {
    display: 'flex',
    width: '100%',
  };

  return (
    <div className={className} data-testid={testId} data-adaptive-mode={mode} data-size-class={sizeClass} style={containerStyle}>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={springs.defaultEffects}
          style={{ width: '100%' }}
        >
          {mode === 'bar' && (
            <NavigationBar
              destinations={destinations}
              value={value}
              defaultValue={defaultValue}
              onValueChange={onValueChange}
              data-testid={`${testId ?? 'adaptive-nav'}-bar`}
            />
          )}
          {mode === 'rail' && (
            <NavigationRail
              destinations={railDestinations}
              value={value}
              defaultValue={defaultValue}
              onValueChange={onValueChange}
              header={railHeader}
              data-testid={`${testId ?? 'adaptive-nav'}-rail`}
            />
          )}
          {mode === 'drawer' && (
            <div style={{ display: 'flex', width: '100%' }}>
              <NavigationDrawer
                variant="standard"
                sections={sections}
                header={drawerHeader}
                value={value}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
                data-testid={`${testId ?? 'adaptive-nav'}-drawer`}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function AdaptiveNavigation(props: AdaptiveNavigationProps) {
  return (
    <WindowSizeClassProvider defaultSizeClass="compact">
      <AdaptiveNavigationInner {...props} />
    </WindowSizeClassProvider>
  );
}

export { resolveMode as resolveAdaptiveNavMode };
