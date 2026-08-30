import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PINNED_REVISIONS, SPEC_VERSION } from './config.js';
import { parseAllKotlinTokenFiles } from './parse-kotlin.js';
import { parseAllScssTokenFiles, resolveMotionTokenReferences } from './parse-scss.js';
import {
  SPEC_OUTPUT_DIR,
  fetchGitHubDirectory,
  fetchGitHubFile,
  hashContent,
  readLocalDirectory,
  readLocalFile,
  writeJsonFile,
} from './utils.js';

const LOCAL_MATERIAL_WEB = process.env.SPEC_SYNC_LOCAL_MATERIAL_WEB;

interface SpecManifest {
  version: string;
  syncedAt: string;
  revisions: typeof PINNED_REVISIONS;
  androidx: {
    fileCount: number;
    contentHash: string;
  };
  materialWeb: {
    fileCount: number;
    contentHash: string;
  };
}

async function syncAndroidxTokens(): Promise<Record<string, unknown>> {
  const { repo, ref, tokensPath } = PINNED_REVISIONS.androidx;
  console.log(`Fetching androidx tokens from ${repo}@${ref}...`);

  try {
    const filePaths = await fetchGitHubDirectory(repo, ref, tokensPath);
    const ktFiles = filePaths.filter((p) => p.endsWith('.kt'));

    if (ktFiles.length === 0) {
      throw new Error('No .kt token files found in androidx');
    }

    const files: Array<{ name: string; content: string }> = [];
    for (const filePath of ktFiles) {
      const name = filePath.split('/').pop() ?? filePath;
      const content = await fetchGitHubFile(repo, ref, filePath);
      files.push({ name, content });
    }

    const parsed = parseAllKotlinTokenFiles(files);
    console.log(`  Parsed ${String(Object.keys(parsed).length)} Kotlin token files`);
    return parsed;
  } catch (err) {
    const fallbackPath = join(SPEC_OUTPUT_DIR, 'androidx-tokens.json');
    if (existsSync(fallbackPath)) {
      console.warn(`  Androidx fetch failed (${String(err)}); reusing committed ${fallbackPath}`);
      return JSON.parse(readFileSync(fallbackPath, 'utf-8')) as Record<string, unknown>;
    }
    throw err;
  }
}

async function syncMaterialWebTokens(): Promise<Record<string, unknown>> {
  const { repo, ref, paths } = PINNED_REVISIONS.materialWeb;
  const source = LOCAL_MATERIAL_WEB ? `local:${LOCAL_MATERIAL_WEB}` : `${repo}@${ref}`;
  console.log(`Fetching material-web tokens from ${source}...`);

  const allFilePaths = new Set<string>();
  for (const dirPath of paths) {
    console.log(`  Scanning ${dirPath}/...`);
    const filePaths = LOCAL_MATERIAL_WEB
      ? await readLocalDirectory(LOCAL_MATERIAL_WEB, dirPath)
      : await fetchGitHubDirectory(repo, ref, dirPath);
    for (const p of filePaths) allFilePaths.add(p);
  }

  const scssFiles = [...allFilePaths].filter(
    (p) =>
      p.endsWith('.scss') &&
      (p.includes('_md-comp-') || p.includes('_md-sys-') || p.includes('motion') || p.includes('shape')),
  );

  if (scssFiles.length === 0) {
    throw new Error('No md-comp/md-sys SCSS token files found in material-web');
  }

  const files: Array<{ name: string; content: string }> = [];
  for (const filePath of scssFiles) {
    const baseName = filePath.split('/').pop() ?? filePath;
    const dirParts = filePath.split('/').slice(0, -1);
    const prefix = dirParts.slice(-2).join('-');
    const name =
      dirParts.length > 1 && !filePath.startsWith('tokens/_')
        ? `${prefix}-${baseName}`
        : baseName;
    const content = LOCAL_MATERIAL_WEB
      ? await readLocalFile(LOCAL_MATERIAL_WEB, filePath)
      : await fetchGitHubFile(repo, ref, filePath);
    files.push({ name, content });
  }

  const parsed = parseAllScssTokenFiles(files);
  resolveMotionTokenReferences(parsed);
  console.log(`  Parsed ${String(Object.keys(parsed).length)} SCSS token files`);

  const motionStyle = parsed['styles-motion-md-motion-tokens-easing'];
  const motionVarCount = Object.keys(motionStyle?.variables ?? {}).filter((k) =>
    k.startsWith('--md-sys-motion-'),
  ).length;
  if (motionVarCount > 0) {
    console.log(`  Motion tokens: ${String(motionVarCount)} resolved from labs/gb/styles/motion`);
  }

  const filledButton = parsed['md-comp-filled-button'];
  if (filledButton?.tokenLists.supported) {
    const supported = filledButton.tokenLists.supported.length;
    const unsupported = filledButton.tokenLists.unsupported?.length ?? 0;
    console.log(`  Validation: md-comp-filled-button → ${String(supported)} supported, ${String(unsupported)} unsupported tokens`);
    if (supported < 35 || supported > 42) {
      console.warn(`  WARNING: expected ~38 supported tokens for md-comp-filled-button, got ${String(supported)}`);
    }
    if (unsupported !== 4) {
      console.warn(`  WARNING: expected 4 unsupported tokens for md-comp-filled-button, got ${String(unsupported)}`);
    }
  }

  return parsed;
}

async function main(): Promise<void> {
  const syncedAt = new Date().toISOString();

  const androidxTokens = await syncAndroidxTokens();
  const materialWebTokens = await syncMaterialWebTokens();

  const androidxContent = JSON.stringify(androidxTokens);
  const materialWebContent = JSON.stringify(materialWebTokens);

  const manifest: SpecManifest = {
    version: SPEC_VERSION,
    syncedAt,
    revisions: PINNED_REVISIONS,
    androidx: {
      fileCount: Object.keys(androidxTokens).length,
      contentHash: hashContent(androidxContent),
    },
    materialWeb: {
      fileCount: Object.keys(materialWebTokens).length,
      contentHash: hashContent(materialWebContent),
    },
  };

  await writeJsonFile(join(SPEC_OUTPUT_DIR, 'manifest.json'), manifest);
  await writeJsonFile(join(SPEC_OUTPUT_DIR, 'androidx-tokens.json'), androidxTokens);
  await writeJsonFile(join(SPEC_OUTPUT_DIR, 'material-web-tokens.json'), materialWebTokens);

  console.log('\nSpec sync complete:');
  console.log(`  androidx: ${String(manifest.androidx.fileCount)} files (${manifest.androidx.contentHash})`);
  console.log(
    `  material-web: ${String(manifest.materialWeb.fileCount)} files (${manifest.materialWeb.contentHash})`,
  );
  console.log(`  Output: ${SPEC_OUTPUT_DIR}`);
}

main().catch((err: unknown) => {
  console.error('Spec sync failed:', err);
  process.exit(1);
});
