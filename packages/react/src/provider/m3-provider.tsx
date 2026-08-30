import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { MotionConfig } from 'motion/react';
import { createTheme, type ContrastPreference, type ThemeResult } from '@m3ui/color';
import { loadMaterialSymbols } from '@m3ui/icons';
import { prefersReducedMotion, reducedMotionTransition } from '@m3ui/motion';
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

const M3Context = createContext<M3ContextValue | null>(null);

function useSystemScheme(): 'light' | 'dark' {
  // Keep the server render and the first client render identical. The media
  // query is applied immediately after hydration and then stays subscribed.
  const [system, setSystem] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystem(mq.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => { setSystem(e.matches ? 'dark' : 'light'); };
    mq.addEventListener('change', handler);
    return () => { mq.removeEventListener('change', handler); };
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
  const [seed, setSeed] = useState(initialSeed);
  const [scheme, setScheme] = useState<ColorScheme>(initialScheme);
  const [contrast, setContrast] = useState<ContrastPreference>(initialContrast);
  const systemScheme = useSystemScheme();

  useEffect(() => { setSeed(initialSeed); }, [initialSeed]);
  useEffect(() => { setScheme(initialScheme); }, [initialScheme]);
  useEffect(() => { setContrast(initialContrast); }, [initialContrast]);

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

  const reducedMotion = prefersReducedMotion();
  const scopedThemeStyle = useMemo(
    () => ({ ...theme.cssVars, ...style }),
    [theme.cssVars, style],
  );

  return (
    <M3Context.Provider value={value}>
      <M3I18nProvider locale={locale} messages={messages}>
        <DirectionProvider direction={direction}>
          <MotionConfig
            reducedMotion={reducedMotion ? 'always' : 'user'}
            transition={reducedMotion ? reducedMotionTransition : undefined}
          >
            <div
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
