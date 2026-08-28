import { M3Provider, PlaceholderButton, Surface } from "@m3ui/react";

export function App() {
  return (
    <M3Provider seed="#6750A4">
      <div data-testid="demo-root" style={{ padding: 24 }}>
        <h1>M3UI Foundation Demo</h1>
        <Surface elevation="level1" style={{ padding: 24 }}>
          <PlaceholderButton>Expressive Button</PlaceholderButton>
        </Surface>
      </div>
    </M3Provider>
  );
}
