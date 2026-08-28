import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(__dirname, '../dist'), { recursive: true });
copyFileSync(
  join(__dirname, '../src/motion.css'),
  join(__dirname, '../dist/motion.css'),
);
