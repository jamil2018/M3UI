'use client';

import type { RegistryInstallInfo } from '@/components/doc/types';
import { CodeBlock } from './code-block';
import { TabGroup } from './tab-group';

export interface InstallTabsProps {
  install: RegistryInstallInfo;
}

export function InstallTabs({ install }: InstallTabsProps) {
  const hasRegistryDeps = install.registryDependencies.length > 0;

  return (
    <TabGroup
      label="Install method"
      defaultTabId="registry"
      items={[
        {
          id: 'registry',
          label: 'shadcn registry',
          content: (
            <div className="doc-install-panel">
              <p className="doc-install-hint">
                Copy-paste the component source into your project via the M3UI shadcn-compatible
                registry.
              </p>
              {hasRegistryDeps ? (
                <p className="doc-install-deps">
                  Registry dependencies:{' '}
                  {install.registryDependencies.map((dep) => (
                    <code key={dep} className="doc-inline-code">
                      {dep}
                    </code>
                  ))}
                </p>
              ) : null}
              <CodeBlock code={install.registryCommand} language="bash" copyLabel="Copy command" />
            </div>
          ),
        },
        {
          id: 'npm',
          label: 'npm package',
          content: (
            <div className="doc-install-panel">
              <p className="doc-install-hint">
                Install M3UI workspace packages, then import from <code>@m3ui/react</code>.
              </p>
              <CodeBlock code={install.npmInstallCommand} language="bash" copyLabel="Copy command" />
              <p className="doc-install-note">
                Package dependencies for this component:{' '}
                {install.npmDependencies.join(', ')}
              </p>
            </div>
          ),
        },
      ]}
    />
  );
}
