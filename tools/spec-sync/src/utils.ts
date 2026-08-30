import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Dirent } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = join(__dirname, '../../..');
export const SPEC_OUTPUT_DIR = join(REPO_ROOT, 'packages/tokens/src/spec');

const GH_HEADERS = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'm3ui-spec-sync',
  };
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const commitShaCache = new Map<string, string>();
const commitTreeShaCache = new Map<string, string>();
const subtreeShaCache = new Map<string, string>();

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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: GH_HEADERS() });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${String(response.status)} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { headers: GH_HEADERS() });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${String(response.status)} ${response.statusText}`);
  }
  return response.text();
}

interface GitRef {
  object: { sha: string; type: string };
}

interface GitCommit {
  tree: { sha: string };
}

interface GitTreeItem {
  path: string;
  type: string;
  sha: string;
}

interface GitTreeResponse {
  sha: string;
  tree: GitTreeItem[];
  truncated?: boolean;
}

async function resolveCommitSha(repo: string, ref: string): Promise<string> {
  const cacheKey = `${repo}@${ref}`;
  const cached = commitShaCache.get(cacheKey);
  if (cached) return cached;

  const refUrl = `https://api.github.com/repos/${repo}/git/ref/heads/${ref}`;
  try {
    const refData = await fetchJson<GitRef>(refUrl);
    if (refData.object.type === 'commit') {
      commitShaCache.set(cacheKey, refData.object.sha);
      return refData.object.sha;
    }
  } catch {
    // ref may be a tag or full SHA — fall through
  }
  const commitUrl = `https://api.github.com/repos/${repo}/commits/${ref}`;
  const commit = await fetchJson<{ sha: string }>(commitUrl);
  commitShaCache.set(cacheKey, commit.sha);
  return commit.sha;
}

async function resolveCommitTreeSha(repo: string, commitSha: string): Promise<string> {
  const cacheKey = `${repo}@${commitSha}`;
  const cached = commitTreeShaCache.get(cacheKey);
  if (cached) return cached;

  const commit = await fetchJson<GitCommit>(
    `https://api.github.com/repos/${repo}/git/commits/${commitSha}`,
  );
  commitTreeShaCache.set(cacheKey, commit.tree.sha);
  return commit.tree.sha;
}

async function getSubtreeSha(repo: string, rootTreeSha: string, dirPath: string): Promise<string> {
  const cacheKey = `${repo}@${rootTreeSha}:${dirPath}`;
  const cached = subtreeShaCache.get(cacheKey);
  if (cached) return cached;

  const parts = dirPath.split('/').filter(Boolean);
  let currentSha = rootTreeSha;

  for (const part of parts) {
    const tree = await fetchJson<GitTreeResponse>(
      `https://api.github.com/repos/${repo}/git/trees/${currentSha}`,
    );
    const entry = tree.tree.find((item) => item.path === part && item.type === 'tree');
    if (!entry) {
      throw new Error(`Directory not found: ${dirPath} (missing segment "${part}")`);
    }
    currentSha = entry.sha;
  }

  subtreeShaCache.set(cacheKey, currentSha);
  return currentSha;
}

/**
 * Recursively list all file paths under a directory using the Git Trees API.
 * Resolves the subtree SHA first so large repos (e.g. androidx) are not truncated.
 */
export async function fetchGitHubDirectory(
  repo: string,
  ref: string,
  dirPath: string,
): Promise<string[]> {
  const commitSha = await resolveCommitSha(repo, ref);
  const rootTreeSha = await resolveCommitTreeSha(repo, commitSha);

  const subtreeSha = await getSubtreeSha(repo, rootTreeSha, dirPath);
  const url = `https://api.github.com/repos/${repo}/git/trees/${subtreeSha}?recursive=1`;
  const data = await fetchJson<GitTreeResponse>(url);

  if (data.truncated) {
    throw new Error(`Git tree for ${repo}@${ref}/${dirPath} was truncated`);
  }

  const prefix = dirPath.endsWith('/') ? dirPath : `${dirPath}/`;
  return data.tree
    .filter((item) => item.type === 'blob')
    .map((item) => `${prefix}${item.path}`);
}

export async function fetchGitHubFile(repo: string, ref: string, filePath: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/${repo}/${ref}/${filePath}`;
  return fetchText(url);
}

/** Walk a local clone (fallback when GitHub API rate limits block directory listing). */
export async function readLocalDirectory(localRoot: string, dirPath: string): Promise<string[]> {
  const base = join(localRoot, dirPath);
  const files: string[] = [];
  const prefix = dirPath.endsWith('/') ? dirPath : `${dirPath}/`;

  async function walk(currentAbs: string, rel: string): Promise<void> {
    let entries: Dirent[];
    try {
      entries = await readdir(currentAbs, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const relPath = rel ? `${rel}/${entry.name}` : entry.name;
      const abs = join(currentAbs, entry.name);
      if (entry.isDirectory()) await walk(abs, relPath);
      else if (entry.isFile()) files.push(`${prefix}${relPath.replace(/\\/g, '/')}`);
    }
  }

  await walk(base, '');
  return files;
}

export async function readLocalFile(localRoot: string, filePath: string): Promise<string> {
  return readFile(join(localRoot, filePath), 'utf-8');
}
