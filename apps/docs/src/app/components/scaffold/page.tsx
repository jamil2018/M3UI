'use client';

import {
  Scaffold,
  TopAppBar,
  NavigationRail,
  NavigationBar,
  Fab,
  FabAnchor,
  Snackbar,
  useSnackbar,
  Button,
} from '@m3ui/react';
import { componentPage } from '@/components/component-page';

function SnackTrigger() {
  const { show } = useSnackbar();
  return <Button variant="filled-tonal" onClick={() => show({ message: 'Saved' })}>Show snackbar</Button>;
}

export default componentPage(
  'scaffold',
  'Scaffold',
  <Snackbar>
    <Scaffold
      topAppBar={<TopAppBar title="M3UI" size="small" />}
      navigationRail={<NavigationRail destinations={[{ value: 'a', label: 'Home', icon: '🏠' }, { value: 'b', label: 'Browse', icon: '📂' }, { value: 'c', label: 'Settings', icon: '⚙️' }]} />}
      navigationBar={<NavigationBar destinations={[{ value: 'a', label: 'Home', icon: '🏠' }, { value: 'b', label: 'Browse', icon: '📂' }, { value: 'c', label: 'Settings', icon: '⚙️' }]} />}
      fab={<FabAnchor><Fab aria-label="Add" icon="+" /></FabAnchor>}
    >
      <div style={{ padding: 24 }}>
        <p>Main content with correct inset offsets for app bars, navigation, FAB, and snackbar.</p>
        <SnackTrigger />
      </div>
    </Scaffold>
  </Snackbar>,
);
