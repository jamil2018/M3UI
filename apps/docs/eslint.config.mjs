import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Hydration guards deliberately set mounted state after the first client render.
  {
    files: ['src/components/providers.tsx', 'src/components/doc/live-preview.tsx'],
    rules: { 'react-hooks/set-state-in-effect': 'off' },
  },
  globalIgnores(['.next/**', 'next-env.d.ts']),
]);
