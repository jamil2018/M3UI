
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { motion } from 'motion/react';
import { presets } from '@m3ui/motion';
import { type CSSProperties, type ReactElement, type ReactNode, isValidElement } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';

export interface TooltipProps {
  trigger: ReactNode;
  content: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function Tooltip({ trigger, content, className, 'data-testid': testId }: TooltipProps) {
  const popupStyle: CSSProperties = {
    ...typeStyle('body-small'),
    background: compVar('plain-tooltip', 'container-color'),
    color: compVar('plain-tooltip', 'supporting-text-color'),
    paddingInline: compVar('plain-tooltip', 'leading-space'),
    paddingBlock: compVar('plain-tooltip', 'top-space'),
    borderRadius: compVar('plain-tooltip', 'container-shape'),
    boxShadow: `0 var(--md-sys-elevation-level1) calc(var(--md-sys-elevation-level1) * 2) rgba(0, 0, 0, var(--md-sys-elevation-level1-shadow-opacity))`,
    maxWidth: compVar('plain-tooltip', 'container-width'),
  };

  const triggerElement = isValidElement(trigger) ? (trigger as ReactElement) : <span>{trigger}</span>;

  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger render={triggerElement} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner sideOffset={4}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={presets.spatial.enter}
            >
              <BaseTooltip.Popup className={className} data-testid={testId} style={popupStyle}>
                {content}
              </BaseTooltip.Popup>
            </motion.div>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

export interface RichTooltipProps {
  trigger: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  image?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function RichTooltip({
  trigger,
  title,
  description,
  image,
  className,
  'data-testid': testId,
}: RichTooltipProps) {
  const popupStyle: CSSProperties = {
    background: 'var(--md-sys-color-surface-container)',
    color: 'var(--md-sys-color-on-surface)',
    borderRadius: compVar('elevated-card', 'container-shape'),
    boxShadow: `0 var(--md-sys-elevation-level2) calc(var(--md-sys-elevation-level2) * 2) rgba(0, 0, 0, var(--md-sys-elevation-level2-shadow-opacity))`,
    overflow: 'hidden',
    maxWidth: compVar('plain-tooltip', 'container-width'),
  };

  const titleStyle: CSSProperties = {
    ...typeStyle('title-small'),
    padding: compVar('list', 'divider-leading-space'),
  };

  const descStyle: CSSProperties = {
    ...typeStyle('body-medium'),
    padding: compVar('list', 'divider-leading-space'),
    paddingTop: 0,
    opacity: 0.8,
  };

  const triggerElement = isValidElement(trigger) ? (trigger as ReactElement) : <span>{trigger}</span>;

  return (
    <BasePreviewCard.Root>
      <BasePreviewCard.Trigger render={triggerElement} />
      <BasePreviewCard.Portal>
        <BasePreviewCard.Positioner sideOffset={8}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={presets.spatial.enter}
          >
            <BasePreviewCard.Popup className={className} data-testid={testId} style={popupStyle}>
              {image}
              <div style={titleStyle}>{title}</div>
              {description && <div style={descStyle}>{description}</div>}
            </BasePreviewCard.Popup>
          </motion.div>
        </BasePreviewCard.Positioner>
      </BasePreviewCard.Portal>
    </BasePreviewCard.Root>
  );
}
