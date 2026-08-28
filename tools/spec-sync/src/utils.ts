import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = join(__dirname, '../../..');
export const SPEC_OUTPUT_DIR = join(REPO_ROOT, 'packages/tokens/src/spec');

export async function writeJsonFile(path: string, data: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const content = JSON.stringify(data, null, 2) + '\n';
  await writeFile(path, content, 'utf-8');
}

export async function readJsonFile<T>(path: string): Promise<T> {
  const content = await readFile(path, 'utf-8');
  return JSON.parse(content) as T;
}

export function hashContent(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 12);
}

export async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${String(response.status)} ${response.statusText}`);
  }
  return response.text();
}

export async function fetchGitHubDirectory(
  repo: string,
  ref: string,
  dirPath: string,
): Promise<string[]> {
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${dirPath}?ref=${ref}`;
  const response = await fetch(apiUrl, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'm3ui-spec-sync',
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub API error for ${dirPath}: ${String(response.status)}`);
  }
  const items = (await response.json()) as Array<{ name: string; type: string; path: string }>;
  return items.filter((item) => item.type === 'file').map((item) => item.path);
}

export async function fetchGitHubFile(repo: string, ref: string, filePath: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/${repo}/${ref}/${filePath}`;
  return fetchText(url);
}
