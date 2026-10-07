import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Static hosting has no /api route, so ship the SQLite search index as a plain
// asset that the browser loads for client-side search.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = process.env.BLOG_CONTENT_URL?.trim().replace(/\/$/, '');

if (!base) {
	throw new Error('BLOG_CONTENT_URL is not configured');
}

const response = await fetch(`${base}/index.db`);
if (!response.ok) {
	throw new Error(`Blog index request failed with ${response.status}`);
}

const target = resolve(root, 'public/blog-index.db');
await mkdir(dirname(target), { recursive: true });
await writeFile(target, Buffer.from(await response.arrayBuffer()));
