import { STATE_LAYER_OPACITIES, COLOR_ROLES, TYPE_SCALE, SHAPE_SCALE } from '@m3ui/tokens';
import { DocsContent } from '@/components/docs-content';

export default function TokensPage() {
  return (
    <DocsContent
      title="Design Tokens"
      description="Generated from androidx Material3 and material-web spec JSON."
    >
      <section className="docs-section docs-section-first">
        <h2>Color Roles</h2>
        <ul className="docs-token-list">
          {COLOR_ROLES.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
      </section>

      <section className="docs-section">
        <h2>Type Scale</h2>
        <table className="docs-table">
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
      </section>

      <section className="docs-section">
        <h2>Shape Scale</h2>
        <ul className="docs-token-list">
          {Object.entries(SHAPE_SCALE).map(([name, px]) => (
            <li key={name}>
              {name}: {px}px
            </li>
          ))}
        </ul>
      </section>

      <section className="docs-section">
        <h2>State Layers</h2>
        <ul className="docs-token-list">
          {Object.entries(STATE_LAYER_OPACITIES).map(([state, opacity]) => (
            <li key={state}>
              {state}: {opacity * 100}%
            </li>
          ))}
        </ul>
      </section>
    </DocsContent>
  );
}
