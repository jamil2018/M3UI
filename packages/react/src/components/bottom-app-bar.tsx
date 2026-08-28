
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, elevationShadow } from '../lib/token-utils.js';
import { useRegisterInset } from '../lib/inset-context.js';

export interface BottomAppBarProps {
  actions: ReactNode;
  fab?: ReactNode;
  /** Hide bar when scrolling down, show when scrolling up */
  hideOnScroll?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function BottomAppBar({
  actions,
  fab,
  hideOnScroll = false,
  className,
  'data-testid': testId,
}: BottomAppBarProps) {
  const height = compVar('bottom-app-bar', 'container-height');
  useRegisterInset('bottom', height);

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  let lastY = 0;

  useMotionValueEvent(scrollY, 'change', (y) => {
    if (!hideOnScroll) return;
    setHidden(y > lastY && y > 80);
    lastY = y;
  });

  const barStyle: CSSProperties = {
    position: 'fixed',
    bottom: 0,
    insetInline: 0,
    zIndex: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height,
    paddingInline: compVar('app-bar', 'leading-space'),
    background: compVar('bottom-app-bar', 'container-color'),
    boxShadow: elevationShadow('level2'),
  };

  const actionsStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: compVar('list', 'item-between-space'),
    flex: 1,
  };

  const fabSlotStyle: CSSProperties = {
    position: 'absolute',
    insetInlineEnd: compVar('fab-medium', 'container-width'),
    bottom: `calc(${height} - ${compVar('fab-medium', 'container-height')} / 2)`,
  };

  return (
    <motion.div
      animate={{ y: hidden ? '100%' : 0 }}
      transition={springs.defaultSpatial}
      data-testid={testId}
    >
      <BaseToolbar.Root className={className} style={barStyle} aria-label="Bottom app bar">
        <div style={actionsStyle}>{actions}</div>
        {fab && <div style={fabSlotStyle}>{fab}</div>}
      </BaseToolbar.Root>
    </motion.div>
  );
}
