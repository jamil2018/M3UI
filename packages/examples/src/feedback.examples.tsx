import {
  LinearProgress,
  CircularProgress,
  LoadingIndicator,
  Meter,
} from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function ProgressExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
      <LinearProgress value={60} />
      <LinearProgress value={40} variant="wavy" />
      <CircularProgress value={75} />
    </div>
  );
}

function LoadingIndicatorExample() {
  return <LoadingIndicator contained />;
}

function MeterExample() {
  return <Meter value={65} label="Storage" min={0} max={100} />;
}

export const progressExamples: ComponentExampleDefinition[] = [
  {
    id: 'progress-linear-circular',
    componentSlug: 'progress',
    title: 'Linear and circular',
    description: 'Determinate progress including wavy Expressive variant.',
    source: `<LinearProgress value={60} />\n<CircularProgress value={75} />`,
    Component: ProgressExample,
  },
];

export const loadingIndicatorExamples: ComponentExampleDefinition[] = [
  {
    id: 'loading-contained',
    componentSlug: 'loading-indicator',
    title: 'Contained loader',
    description: 'Shape-cycling Expressive loading indicator.',
    source: `<LoadingIndicator contained />`,
    Component: LoadingIndicatorExample,
  },
];

export const meterExamples: ComponentExampleDefinition[] = [
  {
    id: 'meter-storage',
    componentSlug: 'meter',
    title: 'Storage meter',
    source: `<Meter value={65} label="Storage" />`,
    Component: MeterExample,
  },
];
