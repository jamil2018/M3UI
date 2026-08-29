import type { Decorator, Preview } from '@storybook/react';
import { MotionConfig } from 'motion/react';
import { M3Provider } from '@m3ui/react';
import type { ContrastPreference } from '@m3ui/color';
import { reducedMotionTransition } from '@m3ui/motion';
import './preview.css';

export interface M3Globals {
  seed: string;
  scheme: 'light' | 'dark' | 'system';
  contrast: ContrastPreference;
  direction: 'ltr' | 'rtl';
  reducedMotion: boolean;
}

const defaultGlobals: M3Globals = {
  seed: '#6750A4',
  scheme: 'light',
  contrast: 0,
  direction: 'ltr',
  reducedMotion: false,
};

export const m3Decorator: Decorator = (Story, context) => {
  const globals = { ...defaultGlobals, ...context.globals } as M3Globals;
  const { seed, scheme, contrast, direction, reducedMotion } = globals;

  return (
    <M3Provider seed={seed} scheme={scheme} contrast={contrast} direction={direction}>
      <MotionConfig
        reducedMotion={reducedMotion ? 'always' : 'user'}
        transition={reducedMotion ? reducedMotionTransition : undefined}
      >
        <Story />
      </MotionConfig>
    </M3Provider>
  );
};

const preview: Preview = {
  decorators: [m3Decorator],
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: {
      config: { rules: [{ id: 'color-contrast', enabled: true }] },
      test: 'todo',
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '390px', height: '844px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' } },
      },
    },
  },
  globalTypes: {
    seed: {
      name: 'Seed',
      description: 'Theme seed color',
      defaultValue: defaultGlobals.seed,
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: '#6750A4', title: 'Purple (default)' },
          { value: '#006A6A', title: 'Teal' },
          { value: '#8C5000', title: 'Orange' },
          { value: '#006E1C', title: 'Green' },
        ],
        dynamic: true,
      },
    },
    scheme: {
      name: 'Scheme',
      description: 'Color scheme',
      defaultValue: defaultGlobals.scheme,
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
      },
    },
    contrast: {
      name: 'Contrast',
      description: 'Contrast preference',
      defaultValue: defaultGlobals.contrast,
      toolbar: {
        icon: 'contrast',
        items: [
          { value: -1, title: 'Reduced' },
          { value: 0, title: 'Standard' },
          { value: 0.5, title: 'Medium' },
          { value: 1, title: 'High' },
        ],
      },
    },
    direction: {
      name: 'Direction',
      description: 'Text direction',
      defaultValue: defaultGlobals.direction,
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
      },
    },
    reducedMotion: {
      name: 'Reduced motion',
      description: 'Force reduced motion',
      defaultValue: defaultGlobals.reducedMotion,
      toolbar: {
        icon: 'lightning',
        items: [
          { value: false, title: 'System' },
          { value: true, title: 'Reduced' },
        ],
      },
    },
  },
};

export default preview;
