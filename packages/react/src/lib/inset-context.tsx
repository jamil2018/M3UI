
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { SNACKBAR_OFFSET_VAR } from '../components/snackbar.js';

export const M3_INSET_TOP = '--m3-inset-top';
export const M3_INSET_BOTTOM = '--m3-inset-bottom';
export const M3_FAB_OFFSET = '--m3-fab-offset';

type InsetKey = 'top' | 'bottom' | 'fab';

interface InsetContextValue {
  register: (key: InsetKey, value: string) => void;
}

const InsetContext = createContext<InsetContextValue | null>(null);

export function useM3InsetRegister() {
  return useContext(InsetContext)?.register;
}

export interface InsetProviderProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
}

/** Provides scaffold inset CSS variables consumed by FAB and snackbar */
export function InsetProvider({ children, className, style, 'data-testid': testId }: InsetProviderProps) {
  const [insets, setInsets] = useState({ top: '0px', bottom: '0px', fab: '0px' });

  const register = useCallback((key: InsetKey, value: string) => {
    setInsets((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  const ctx = useMemo(() => ({ register }), [register]);

  const snackbarOffset = `calc(${insets.bottom} + ${insets.fab})`;

  return (
    <InsetContext.Provider value={ctx}>
      <div
        className={className}
        data-testid={testId}
        style={
          {
            [M3_INSET_TOP]: insets.top,
            [M3_INSET_BOTTOM]: insets.bottom,
            [M3_FAB_OFFSET]: insets.fab,
            [SNACKBAR_OFFSET_VAR]: snackbarOffset,
            ...style,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </InsetContext.Provider>
  );
}

/** Register a chrome component height with the scaffold inset context */
export function useRegisterInset(key: InsetKey, value: string) {
  const register = useM3InsetRegister();
  useEffect(() => {
    register?.(key, value);
  }, [register, key, value]);
}
