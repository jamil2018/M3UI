import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { after, test } from 'node:test';
import { ESLint } from 'eslint';

const docsRequire = createRequire(new URL('../apps/docs/package.json', import.meta.url));
const configRequire = createRequire(docsRequire.resolve('eslint-config-next'));
const pluginPath = configRequire.resolve('@next/eslint-plugin-next');
const pluginRequire = createRequire(pluginPath);
const { getRootDirs } = pluginRequire(join(dirname(pluginPath), 'utils/get-root-dirs.js'));
const nextPlugin = configRequire('@next/eslint-plugin-next').default;
const fixture = mkdtempSync(join(tmpdir(), 'material-dependency-security-'));
for (const directory of ['alpha/pages', 'alpha/nested', 'beta/app', 'hidden/.private']) {
  mkdirSync(join(fixture, directory), { recursive: true });
}
writeFileSync(join(fixture, 'alpha/pages/index.js'), 'export default function Page() {}');
writeFileSync(join(fixture, 'file.txt'), 'not a directory');
symlinkSync(join(fixture, 'alpha'), join(fixture, 'alpha-link'), 'junction');
after(() => rmSync(fixture, { recursive: true, force: true }));

const roots = (rootDir) => getRootDirs({ cwd: fixture, settings: { next: { rootDir } } });
const identities = (paths) => paths.map((path) => resolve(path)).sort();

test('default and static roots retain directory-only semantics without expanding descendants', () => {
  assert.deepEqual(getRootDirs({ cwd: fixture, settings: {} }), [fixture]);
  assert.deepEqual(identities(roots(join(fixture, 'alpha'))), [join(fixture, 'alpha')]);
  assert.deepEqual(roots(join(fixture, '*.txt')), []);
  assert.deepEqual(roots(join(fixture, 'missing')), []);
});

test('wildcards, alternatives, extglobs, and character classes retain their matching roots', () => {
  const expected = identities([join(fixture, 'alpha'), join(fixture, 'beta')]);
  for (const pattern of ['{alpha,beta}', '@(alpha|beta)', '[ab]*']) {
    assert.deepEqual(
      identities(roots(join(fixture, pattern))),
      pattern === '[ab]*' ? identities([...expected, join(fixture, 'alpha-link')]) : expected,
    );
  }
  assert.deepEqual(
    identities(roots(join(fixture, '*/pages'))),
    identities([join(fixture, 'alpha/pages'), join(fixture, 'alpha-link/pages')]),
  );
});

test('empty alternatives, arrays, symlinks, and separator normalization remain supported', () => {
  assert.deepEqual(
    identities(roots(`${fixture}/{alpha,}`)),
    identities([fixture, join(fixture, 'alpha')]),
  );
  assert.deepEqual(
    identities(roots([join(fixture, 'alpha'), null, join(fixture, 'beta')])),
    identities([join(fixture, 'alpha'), join(fixture, 'beta')]),
  );
  assert.deepEqual(identities(roots(join(fixture, 'alpha-link'))), [join(fixture, 'alpha-link')]);
  assert.deepEqual(identities(roots(join(fixture, 'alpha').replaceAll('/', '\\'))), [
    join(fixture, 'alpha'),
  ]);
});

test('the Next internal-link rule still reports links using configured root globs', async () => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: ['**/*.jsx'],
        languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
        plugins: { '@next/next': nextPlugin },
        settings: { next: { rootDir: `${fixture}/{alpha,beta}` } },
        rules: { '@next/next/no-html-link-for-pages': 'error' },
      },
    ],
  });
  const [result] = await eslint.lintText('<a href="/">Home</a>', {
    filePath: 'dependency-probe.jsx',
  });
  assert.equal(result.errorCount, 1);
  assert.equal(result.messages[0].ruleId, '@next/next/no-html-link-for-pages');
});
