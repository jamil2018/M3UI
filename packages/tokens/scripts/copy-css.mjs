import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const generated = join(__dirname, '../src/generated');
const dist = join(__dirname, '../dist');

mkdirSync(dist, { recursive: true });
copyFileSync(join(generated, 'tokens.css'), join(dist, 'tokens.css'));
copyFileSync(join(generated, 'theme.css'), join(dist, 'theme.css'));
