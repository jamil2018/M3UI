import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { MotionConfig } from 'motion/react';
import { createTheme, type ContrastPreference, type ThemeResult } from '@m3ui/color';
import { loadMaterialSymbols } from '@m3ui/icons';
import { reducedMotionTransition } from '@m3ui/motion';
import { usePrefersReducedMotion } from '../lib/use-reduced-motion.js';
import { M3I18nProvider, type M3Messages } from '../lib/i18n.js';

export type ColorScheme = 'light' | 'dark' | 'system';
export type Direction = 'ltr' | 'rtl';

export interface M3ProviderProps {
  children: ReactNode;
  seed?: string;
  scheme?: ColorScheme;
  contrast?: ContrastPreference;
  direction?: Direction;
  locale?: string;
  messages?: M3Messages;
  className?: string;
  style?: CSSProperties;
  /** Android-derived Expressive behavior is adapted to browser rendering. */
  expressive?: boolean;
}

interface M3ContextValue {
  seed: string;
  scheme: ColorScheme;
  resolvedScheme: 'light' | 'dark';
  contrast: ContrastPreference;
  direction: Direction;
  theme: ThemeResult;
  setSeed: (seed: string) => void;
  setScheme: (scheme: ColorScheme) => void;
  setContrast: (contrast: ContrastPreference) => void;
}

const PortalThemeContext = createContext<{
  style: CSSProperties;
  direction: Direction;
  root: RefObject<HTMLDivElement | null>;
} | null>(null);

/** Carries the nearest provider's inheritable theme through body-mounted portals. */
const PortalDepthContext = createContext(0);

export function M3PortalScope({ children }: { children: ReactNode }) {
  const scope = useContext(PortalThemeContext);
  const depth = useContext(PortalDepthContext) + 1;
  const layer = 1100 + (depth - 1) * 10;
  const target = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = scope?.root.current;
    const portal = target.current;
    if (!root || !portal) return;
    const copy = () => {
      const computed = getComputedStyle(root);
      portal.removeAttribute('style');
      Object.assign(portal.style, scope.style);
      for (const [key, value] of Object.entries(scope.style)) {
        if (key.startsWith('--')) portal.style.setProperty(key, String(value));
      }
      portal.style.display = 'contents';
      for (const key of Array.from(computed)) {
        if (key.startsWith('--')) portal.style.setProperty(key, computed.getPropertyValue(key));
      }
      portal.style.setProperty('--m3-overlay-layer', String(layer));
      portal.style.colorScheme = computed.colorScheme;
      portal.dir = computed.direction;
    };
    copy();
    const observer = new MutationObserver(copy);
    for (let ancestor: HTMLElement | null = root; ancestor; ancestor = ancestor.parentElement) {
      observer.observe(ancestor, { attributes: true, attributeFilter: ['class', 'style', 'dir'] });
    }
    return () => {
      observer.disconnect();
    };
  }, [scope, layer]);
  return (
    <PortalDepthContext.Provider value={depth}>
      <div
        ref={target}
        data-m3-root
        data-m3-portal-scope
        dir={scope?.direction}
        style={
          { ...scope?.style, display: 'contents', '--m3-overlay-layer': layer } as CSSProperties
        }
      >
        {children}
      </div>
    </PortalDepthContext.Provider>
  );
}

const M3Context = createContext<M3ContextValue | null>(null);

function useSystemScheme(): 'light' | 'dark' {
  // Keep the server render and the first client render identical. The media
  // query is applied immediately after hydration and then stays subscribed.
  const [system, setSystem] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystem(mq.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => {
      setSystem(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => {
      mq.removeEventListener('change', handler);
    };
  }, []);

  return system;
}

export function M3Provider({
  children,
  seed: initialSeed = '#6750A4',
  scheme: initialScheme = 'system',
  contrast: initialContrast = 0,
  direction = 'ltr',
  locale = 'en-US',
  messages,
  className,
  style,
  expressive = true,
}: M3ProviderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const parentScope = useContext(PortalThemeContext);
  const [seed, setSeed] = useState(initialSeed);
  const [scheme, setScheme] = useState<ColorScheme>(initialScheme);
  const [contrast, setContrast] = useState<ContrastPreference>(initialContrast);
  const systemScheme = useSystemScheme();

  useEffect(() => {
    setSeed(initialSeed);
  }, [initialSeed]);
  useEffect(() => {
    setScheme(initialScheme);
  }, [initialScheme]);
  useEffect(() => {
    setContrast(initialContrast);
  }, [initialContrast]);

  const resolvedScheme = scheme === 'system' ? systemScheme : scheme;

  const theme = useMemo(
    () =>
      createTheme({
        seed,
        variant: 'expressive',
        contrast,
        isDark: resolvedScheme === 'dark',
      }),
    [seed, contrast, resolvedScheme],
  );

  useEffect(() => {
    loadMaterialSymbols();
  }, []);

  const value = useMemo<M3ContextValue>(
    () => ({
      seed,
      scheme,
      resolvedScheme,
      contrast,
      direction,
      theme,
      setSeed,
      setScheme,
      setContrast,
    }),
    [seed, scheme, resolvedScheme, contrast, direction, theme],
  );

  const reducedMotion = usePrefersReducedMotion();
  const scopedThemeStyle = useMemo(
    () => ({ ...theme.cssVars, colorScheme: resolvedScheme, ...style }),
    [theme.cssVars, resolvedScheme, style],
  );

  const portalScope = useMemo(
    () => ({
      direction,
      root: rootRef,
      style: {
        ...parentScope?.style,
        ...Object.fromEntries(
          Object.entries(scopedThemeStyle).filter(
            ([key]) => key.startsWith('--') || key === 'colorScheme',
          ),
        ),
      },
    }),
    [direction, parentScope, scopedThemeStyle],
  );

  return (
    <PortalThemeContext.Provider value={portalScope}>
      <M3Context.Provider value={value}>
        <M3I18nProvider locale={locale} messages={messages}>
          <DirectionProvider direction={direction}>
            <MotionConfig
              reducedMotion={reducedMotion ? 'always' : 'user'}
              transition={reducedMotion ? reducedMotionTransition : undefined}
            >
              <div
                ref={rootRef}
                className={className}
                data-m3-root
                data-m3-expressive={expressive ? 'adapted' : 'standard'}
                data-m3-scheme={resolvedScheme}
                data-m3-contrast={String(contrast)}
                dir={direction}
                style={scopedThemeStyle}
              >
                {children}
              </div>
            </MotionConfig>
          </DirectionProvider>
        </M3I18nProvider>
      </M3Context.Provider>
    </PortalThemeContext.Provider>
  );
}

export function useM3(): M3ContextValue {
  const ctx = useContext(M3Context);
  if (!ctx) {
    throw new Error('useM3 must be used within M3Provider');
  }
  return ctx;
}

export function useM3Theme(): ThemeResult {
  return useM3().theme;
}

export function useSetM3Seed(): (seed: string) => void {
  return useM3().setSeed;
}

export function useM3Color(role: string): string {
  const { theme } = useM3();
  return theme.colors[role] ?? '#000000';
}
