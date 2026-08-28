import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefCallback,
} from 'react';

/** M3 window size classes (container-width based). */
export type WindowSizeClass = 'compact' | 'medium' | 'expanded' | 'large' | 'extra-large';

export const SIZE_CLASS_BREAKPOINTS: Record<WindowSizeClass, number> = {
  compact: 0,
  medium: 600,
  expanded: 840,
  large: 1200,
  'extra-large': 1600,
};

export const SIZE_CLASS_QUERY: Record<WindowSizeClass, string> = {
  compact: '(max-width: 599px)',
  medium: '(min-width: 600px) and (max-width: 839px)',
  expanded: '(min-width: 840px) and (max-width: 1199px)',
  large: '(min-width: 1200px) and (max-width: 1599px)',
  'extra-large': '(min-width: 1600px)',
};

export function widthToSizeClass(width: number): WindowSizeClass {
  if (width >= SIZE_CLASS_BREAKPOINTS['extra-large']) return 'extra-large';
  if (width >= SIZE_CLASS_BREAKPOINTS.large) return 'large';
  if (width >= SIZE_CLASS_BREAKPOINTS.expanded) return 'expanded';
  if (width >= SIZE_CLASS_BREAKPOINTS.medium) return 'medium';
  return 'compact';
}

export interface WindowSizeClassContextValue {
  sizeClass: WindowSizeClass;
  width: number;
}

const WindowSizeClassContext = createContext<WindowSizeClassContextValue>({
  sizeClass: 'compact',
  width: 0,
});

export interface WindowSizeClassProviderProps {
  children: ReactNode;
  /** SSR-safe default before hydration measurement. */
  defaultSizeClass?: WindowSizeClass;
  className?: string;
  style?: CSSProperties;
}

export function WindowSizeClassProvider({
  children,
  defaultSizeClass = 'compact',
  className,
  style,
}: WindowSizeClassProviderProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [sizeClass, setSizeClass] = useState<WindowSizeClass>(defaultSizeClass);
  const [width, setWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    const el = ref.current;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = entry.contentRect.width;
      setWidth(w);
      setSizeClass(widthToSizeClass(w));
    });
    observer.observe(el);
    const w = el.getBoundingClientRect().width;
    setWidth(w);
    setSizeClass(widthToSizeClass(w));
    return () => observer.disconnect();
  }, [mounted]);

  const value = useMemo(() => ({ sizeClass, width }), [sizeClass, width]);

  const containerStyle: CSSProperties = {
    containerType: 'inline-size',
    width: '100%',
    ...style,
  };

  return (
    <WindowSizeClassContext.Provider value={value}>
      <div ref={ref} className={className} style={containerStyle} data-size-class={sizeClass}>
        {children}
      </div>
    </WindowSizeClassContext.Provider>
  );
}

export function useWindowSizeClass(): WindowSizeClassContextValue {
  return useContext(WindowSizeClassContext);
}

/** Attach to any element to read its container width as a size class. */
export function useContainerSizeClass(): [RefCallback<HTMLElement | null>, WindowSizeClassContextValue] {
  const [sizeClass, setSizeClass] = useState<WindowSizeClass>('compact');
  const [width, setWidth] = useState(0);
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setWidth(w);
      setSizeClass(widthToSizeClass(w));
    });
    observer.observe(node);
    observerRef.current = observer;
    const w = node.getBoundingClientRect().width;
    setWidth(w);
    setSizeClass(widthToSizeClass(w));
  }, []);

  return [ref, { sizeClass, width }];
}

export function sizeClassAtLeast(current: WindowSizeClass, target: WindowSizeClass): boolean {
  const order: WindowSizeClass[] = ['compact', 'medium', 'expanded', 'large', 'extra-large'];
  return order.indexOf(current) >= order.indexOf(target);
}
