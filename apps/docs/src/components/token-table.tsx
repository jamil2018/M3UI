import { STATE_LAYER_OPACITIES, COLOR_ROLES, ELEVATION_LEVELS } from '@m3ui/tokens';

export function TokenTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid var(--md-sys-color-outline)' }}>
              Token
            </th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid var(--md-sys-color-outline)' }}>
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(STATE_LAYER_OPACITIES).map(([state, opacity]) => (
            <tr key={state}>
              <td style={{ padding: 8 }}>state-{state}-opacity</td>
              <td style={{ padding: 8 }}>{opacity}</td>
            </tr>
          ))}
          {Object.entries(ELEVATION_LEVELS).map(([level, vals]) => (
            <tr key={level}>
              <td style={{ padding: 8 }}>elevation-{level}</td>
              <td style={{ padding: 8 }}>
                {vals.elevation}px / tint {vals.surfaceTintOpacity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 16, fontSize: 14, opacity: 0.7 }}>
        {COLOR_ROLES.length} color roles defined
      </p>
    </div>
  );
}
