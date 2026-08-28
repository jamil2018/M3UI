import { join } from 'node:path';
import { PINNED_REVISIONS, SPEC_VERSION } from './config.js';
import { parseAllKotlinTokenFiles } from './parse-kotlin.js';
import { parseAllScssTokenFiles } from './parse-scss.js';
import {
  SPEC_OUTPUT_DIR,
  fetchGitHubDirectory,
  fetchGitHubFile,
  hashContent,
  writeJsonFile,
} from './utils.js';

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
}

async function syncMaterialWebTokens(): Promise<Record<string, unknown>> {
  const { repo, ref, tokensPath } = PINNED_REVISIONS.materialWeb;
  console.log(`Fetching material-web tokens from ${repo}@${ref}...`);

  const filePaths = await fetchGitHubDirectory(repo, ref, tokensPath);
  const scssFiles = filePaths.filter(
    (p) => p.endsWith('.scss') && (p.includes('_md-comp-') || p.includes('_md-sys-')),
  );

  if (scssFiles.length === 0) {
    throw new Error('No md-comp/md-sys SCSS token files found in material-web');
  }

  const files: Array<{ name: string; content: string }> = [];
  for (const filePath of scssFiles) {
    const name = filePath.split('/').pop() ?? filePath;
    const content = await fetchGitHubFile(repo, ref, filePath);
    files.push({ name, content });
  }

  const parsed = parseAllScssTokenFiles(files);
  console.log(`  Parsed ${String(Object.keys(parsed).length)} SCSS token files`);
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
