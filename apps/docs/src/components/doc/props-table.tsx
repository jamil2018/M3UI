import { DocSection } from './doc-section';
import type { PropDefinition } from './types';

export interface PropsTableProps {
  props: PropDefinition[];
  title?: string;
  description?: string;
}

export function PropsTable({
  props,
  title = 'API Reference',
  description = 'Props for the root component. Compound subcomponents may be documented separately.',
}: PropsTableProps) {
  if (props.length === 0) {
    return null;
  }

  return (
    <DocSection id="api" title={title} description={description}>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th scope="col">Prop</th>
              <th scope="col">Type</th>
              <th scope="col">Default</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name}>
                <td>
                  <code className="doc-inline-code">{prop.name}</code>
                  {prop.required ? (
                    <span className="doc-required-badge" aria-label="Required">
                      required
                    </span>
                  ) : null}
                </td>
                <td>
                  <code className="doc-type-code">{prop.type}</code>
                </td>
                <td>{prop.default ?? '—'}</td>
                <td>{prop.description ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DocSection>
  );
}
