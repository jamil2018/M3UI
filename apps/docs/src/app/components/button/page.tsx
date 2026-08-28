'use client';

import {
  Button,
  IconButton,
  Fab,
  ExtendedFab,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Card,
  List,
  ListItem,
  Divider,
  Badge,
  Tooltip,
  RichTooltip,
} from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'button',
  'Button',
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
    <Button variant="filled">Filled</Button>
    <Button variant="elevated">Elevated</Button>
    <Button variant="filled-tonal">Tonal</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="text">Text</Button>
  </div>,
);
