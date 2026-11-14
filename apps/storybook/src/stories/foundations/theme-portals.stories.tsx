import type { Meta, StoryObj } from '@storybook/react';
import { type CSSProperties, useState } from 'react';
import {
  M3Provider,
  DatePicker,
  TimePicker,
  SnackbarProvider,
  useSnackbar,
  Dialog,
  Button,
  Tooltip,
  Select,
  Menu,
  MenuItem,
} from '@m3ui/react';

const meta = {
  title: 'Foundations/Theme portals',
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function ThemePortalReview() {
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState(false);
  return (
    <M3Provider seed="#6750A4" scheme="light">
      <style>{`.portal-review-theme { --portal-review-marker: class-override; --md-comp-dialog-container-color: rgb(30, 70, 60); }`}</style>
      <p>Outer light theme. The nested theme below is clipped; its portals must remain visible.</p>
      <M3Provider
        seed="#006A6A"
        scheme={dark ? 'dark' : 'light'}
        direction="rtl"
        className="portal-review-theme"
        style={
          {
            '--portal-review-custom': 'nested-override',
            overflow: 'hidden',
            height: 160,
            padding: 16,
          } as CSSProperties
        }
      >
        <Button
          onClick={() => {
            setDark(!dark);
          }}
        >
          Toggle nested theme
        </Button>
        <Dialog
          trigger={<Button>Open themed dialog</Button>}
          open={open}
          onOpenChange={setOpen}
          actions={
            <>
              <Button
                onClick={() => {
                  setDark(!dark);
                }}
              >
                Change open dialog theme
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                }}
              >
                Close themed dialog
              </Button>
            </>
          }
          headline="Nested themed dialog"
          body="Dark teal, RTL, and custom dialog color survive the body portal."
        />
        <Select
          label="Themed choice"
          options={[
            { value: 'one', label: 'First option' },
            { value: 'two', label: 'Second option' },
          ]}
        />
        <Tooltip trigger={<Button>Hover for tooltip</Button>} content="Nested tooltip theme" />
        <Menu trigger={<Button>Open themed menu</Button>}>
          <MenuItem>Nested menu item</MenuItem>
        </Menu>
      </M3Provider>
    </M3Provider>
  );
}

export const NestedProvider: Story = { render: () => <ThemePortalReview /> };

function SnackbarTrigger() {
  const snackbar = useSnackbar();
  return (
    <Button
      onClick={() => snackbar.show({ message: 'A responsive snackbar message', timeout: 10000 })}
    >
      Show review snackbar
    </Button>
  );
}
export const OverlayLayouts: Story = {
  render: () => (
    <M3Provider scheme="dark">
      <SnackbarProvider>
        <DatePicker variant="modal" trigger={<Button>Open review date picker</Button>} />
        <TimePicker trigger={<Button>Open review time picker</Button>} />
        <Tooltip trigger={<Button>Review tooltip</Button>} content="Review tooltip content" />
        <SnackbarTrigger />
      </SnackbarProvider>
    </M3Provider>
  ),
};
