import {
  ButtonGroup,
  ButtonGroupItem,
  SplitButton,
  FabMenu,
  Toolbar,
  ToolbarButton,
  MenuItem,
} from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function ButtonGroupExample() {
  return (
    <ButtonGroup>
      <ButtonGroupItem>Save</ButtonGroupItem>
      <ButtonGroupItem>Share</ButtonGroupItem>
    </ButtonGroup>
  );
}

function SplitButtonExample() {
  return <SplitButton menuItems={<MenuItem>Schedule</MenuItem>}>Send</SplitButton>;
}

function FabMenuExample() {
  return (
    <FabMenu
      aria-label="Create"
      icon="+"
      actions={[{ label: 'Task', icon: '✓', onClick: () => undefined }]}
    />
  );
}

function ToolbarExample() {
  return (
    <Toolbar variant="floating">
      <ToolbarButton aria-label="Copy">C</ToolbarButton>
      <ToolbarButton aria-label="Paste">P</ToolbarButton>
    </Toolbar>
  );
}

export const buttonGroupExamples: ComponentExampleDefinition[] = [
  {
    id: 'button-group-connected',
    componentSlug: 'button-group',
    title: 'Connected group',
    source: `<ButtonGroup>\n  <ButtonGroupItem>Save</ButtonGroupItem>\n</ButtonGroup>`,
    Component: ButtonGroupExample,
  },
];

export const splitButtonExamples: ComponentExampleDefinition[] = [
  {
    id: 'split-button-send',
    componentSlug: 'split-button',
    title: 'Send with menu',
    source: `<SplitButton menuItems={...}>Send</SplitButton>`,
    Component: SplitButtonExample,
  },
];

export const fabMenuExamples: ComponentExampleDefinition[] = [
  {
    id: 'fab-menu-actions',
    componentSlug: 'fab-menu',
    title: 'Labeled actions',
    source: `<FabMenu icon="+" actions={actions} />`,
    Component: FabMenuExample,
  },
];

export const toolbarExamples: ComponentExampleDefinition[] = [
  {
    id: 'toolbar-floating',
    componentSlug: 'toolbar',
    title: 'Floating toolbar',
    source: `<Toolbar variant="floating">...</Toolbar>`,
    Component: ToolbarExample,
  },
];
