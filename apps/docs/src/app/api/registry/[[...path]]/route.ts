import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { NextResponse } from 'next/server';

const REGISTRY_DIR = join(process.cwd(), '../../packages/react/registry');

export async function GET(_request: Request, context: { params: Promise<{ path?: string[] }> }) {
  const { path: pathSegments } = await context.params;

  if (!pathSegments || pathSegments.length === 0) {
    const file = join(REGISTRY_DIR, 'registry.json');
    if (!existsSync(file)) {
      return NextResponse.json({ error: 'Registry not built' }, { status: 404 });
    }
    return new NextResponse(readFileSync(file, 'utf-8'), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = pathSegments.join('/');
  const file = join(REGISTRY_DIR, 'r', `${name}.json`);
  if (!existsSync(file)) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return new NextResponse(readFileSync(file, 'utf-8'), {
    headers: { 'Content-Type': 'application/json' },
  });
}
