import { existsSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const source = join(dist, 'assets', 'node_modules');
const target = join(dist, 'assets', 'vendor');

if (existsSync(source)) {
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
  }

  renameSync(source, target);
}

const textExtensions = new Set(['.css', '.html', '.js', '.json', '.map']);

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);

    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }

    if (!textExtensions.has(path.slice(path.lastIndexOf('.')))) {
      continue;
    }

    const content = readFileSync(path, 'utf8');
    const updated = content.replaceAll('/assets/node_modules/', '/assets/vendor/');

    if (updated !== content) {
      writeFileSync(path, updated);
    }
  }
}

walk(dist);
