'use client';

import type { Language } from '../data/site-copy';

interface BrowserDatabase {
	pointer?: number;
	close: () => void;
	exec: (options: {
		sql: string;
		bind: Record<string, string>;
		rowMode: 'object';
		returnValue: 'resultRows';
	}) => Record<string, unknown>[];
}

interface BrowserSqlite {
	oo1: { DB: new (filename: string, flags: string) => BrowserDatabase };
	wasm: { allocFromTypedArray: (bytes: Uint8Array) => number };
	capi: {
		sqlite3_deserialize: (
			database: number,
			schema: string,
			pointer: number,
			databaseSize: number,
			bufferSize: number,
			flags: number,
		) => number;
	};
}

type InitSqlite = () => Promise<BrowserSqlite>;

let databasePromise: Promise<BrowserDatabase> | undefined;

async function initializeSqlite() {
	const moduleUrl = '/sqlite/index.mjs';
	const module = (await import(/* webpackIgnore: true */ moduleUrl)) as {
		default: InitSqlite;
	};
	return module.default();
}

async function loadDatabase() {
	const [sqlite3, response] = await Promise.all([
		initializeSqlite(),
		fetch('/blog-index.db'),
	]);
	if (!response.ok) {
		throw new Error(`Blog search index request failed with ${response.status}`);
	}
	const bytes = new Uint8Array(await response.arrayBuffer());
	const database = new sqlite3.oo1.DB(':memory:', 'c');
	const pointer = sqlite3.wasm.allocFromTypedArray(bytes);
	const result = sqlite3.capi.sqlite3_deserialize(
		database.pointer ?? 0,
		'main',
		pointer,
		bytes.byteLength,
		bytes.byteLength,
		1 | 4,
	);
	if (result !== 0) {
		database.close();
		throw new Error(`Unable to open blog search index (${result})`);
	}
	return database;
}

function getDatabase() {
	databasePromise ??= loadDatabase().catch((error) => {
		databasePromise = undefined;
		throw error;
	});
	return databasePromise;
}

function toFtsQuery(input: string) {
	return input
		.trim()
		.split(/\s+/)
		.map((token) => token.replaceAll('"', ''))
		.filter(Boolean)
		.map((token) => `"${token}"*`)
		.join(' AND ');
}

export async function searchBlogPostIds(query: string, language: Language) {
	const ftsQuery = toFtsQuery(query);
	if (!ftsQuery) return [];
	const database = await getDatabase();
	const rows = database.exec({
		sql: `
			SELECT post_id FROM post_translations_fts
			WHERE post_translations_fts MATCH :query AND language = :language
			ORDER BY bm25(post_translations_fts)
		`,
		bind: { ':query': ftsQuery, ':language': language },
		rowMode: 'object',
		returnValue: 'resultRows',
	});
	return rows.flatMap((row) =>
		typeof row.post_id === 'string' ? [row.post_id] : [],
	);
}
