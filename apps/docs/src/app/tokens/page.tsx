import { STATE_LAYER_OPACITIES, COLOR_ROLES, TYPE_SCALE, SHAPE_SCALE } from '@m3ui/tokens';

export default function TokensPage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
      <h1>Design Tokens</h1>
      <p>Generated from androidx Material3 and material-web spec JSON.</p>

      <h2>Color Roles</h2>
      <ul>
        {COLOR_ROLES.map((role) => (
          <li key={role}>{role}</li>
        ))}
      </ul>

      <h2>Type Scale</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Role</th>
            <th>Size</th>
            <th>Weight</th>
            <th>Emphasized</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(TYPE_SCALE).map(([role, scale]) => (
            <tr key={role}>
              <td>{role}</td>
              <td>{scale.size}px</td>
              <td>{scale.weight}</td>
              <td>{Math.min(scale.weight + 200, 900)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Shape Scale</h2>
      <ul>
        {Object.entries(SHAPE_SCALE).map(([name, px]) => (
          <li key={name}>
            {name}: {px}px
          </li>
        ))}
      </ul>

      <h2>State Layers</h2>
      <ul>
        {Object.entries(STATE_LAYER_OPACITIES).map(([state, opacity]) => (
          <li key={state}>
            {state}: {opacity * 100}%
          </li>
        ))}
      </ul>
    </main>
  );
}
