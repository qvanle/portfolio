import 'server-only';

import postcss from 'postcss';
import prefixSelector from 'postcss-prefix-selector';
import sanitizeHtml from 'sanitize-html';
import type { Database, SqlJsStatic } from 'sql.js';
import initSqlJs from 'sql.js/dist/sql-asm.js';
import type { Language } from './site-copy';

export interface SitePost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	publishedAt: string;
	updatedAt: string;
	featured: boolean;
	tags: string[];
	image?: string;
	category?: string;
	body?: string;
	styles?: string;
	alternateSlug?: string;
}

interface BlogHeaderTranslation {
	title: string;
	slug: string;
	summary?: string;
	tags?: string[];
}

interface BlogHeader {
	id: string;
	category?: string;
	featured?: boolean;
	cover_image?: string | null;
	created_at: string;
	updated_at: string;
	status: string;
	languages: Language[];
	en?: BlogHeaderTranslation;
	vi?: BlogHeaderTranslation;
}

interface PostRow {
	id: string;
	title: string;
	slug: string;
	summary: string;
	language: string;
	tags: string;
	category: string;
	created_at: string;
	updated_at: string;
	featured: number;
	cover_image: string | null;
	alternate_slug: string | null;
}

const INDEX_REVALIDATE_SECONDS = 60;
let sqlPromise: Promise<SqlJsStatic> | undefined;

export function getBlogContentUrl() {
	const value = process.env.BLOG_CONTENT_URL?.trim().replace(/\/$/, '');
	if (!value) {
		throw new Error('BLOG_CONTENT_URL is not configured');
	}
	return value;
}

export async function fetchBlogIndex(): Promise<ArrayBuffer> {
	const response = await fetch(`${getBlogContentUrl()}/index.db`, {
		next: { revalidate: INDEX_REVALIDATE_SECONDS },
	});
	if (!response.ok) {
		throw new Error(`Blog index request failed with ${response.status}`);
	}
	return response.arrayBuffer();
}

async function getSql() {
	sqlPromise ??= initSqlJs();
	return sqlPromise;
}

async function openDatabase(): Promise<Database> {
	const [SQL, bytes] = await Promise.all([getSql(), fetchBlogIndex()]);
	return new SQL.Database(new Uint8Array(bytes));
}

function parseTags(value: string): string[] {
	try {
		const tags = JSON.parse(value);
		return Array.isArray(tags)
			? tags.filter((tag): tag is string => typeof tag === 'string')
			: [];
	} catch {
		return value ? value.split(',').map((tag) => tag.trim()) : [];
	}
}

function absolutePostUrl(postId: string, path: string) {
	return new URL(path, `${getBlogContentUrl()}/${postId}/`).toString();
}

function rowToPost(row: PostRow): SitePost {
	return {
		id: row.id,
		title: row.title,
		slug: row.slug,
		excerpt: row.summary,
		publishedAt: row.created_at,
		updatedAt: row.updated_at,
		featured: row.featured === 1,
		tags: parseTags(row.tags),
		image: row.cover_image
			? absolutePostUrl(row.id, row.cover_image)
			: undefined,
		category: row.category || undefined,
		alternateSlug: row.alternate_slug ?? undefined,
	};
}

function queryRows(
	database: Database,
	sql: string,
	parameters: Record<string, string>,
): PostRow[] {
	const statement = database.prepare(sql);
	try {
		statement.bind(parameters);
		const rows: PostRow[] = [];
		while (statement.step()) {
			rows.push(statement.getAsObject() as unknown as PostRow);
		}
		return rows;
	} finally {
		statement.free();
	}
}

const POST_SELECT = `
	SELECT
		p.id, p.category, p.created_at, p.updated_at, p.featured,
		p.cover_image, t.language, t.title, t.slug, t.summary, t.tags,
		alternate.slug AS alternate_slug
	FROM posts p
	JOIN post_translations t ON t.post_id = p.id
	LEFT JOIN post_translations alternate
		ON alternate.post_id = p.id AND alternate.language <> t.language
`;

async function listPosts(language: Language): Promise<SitePost[]> {
	const database = await openDatabase();
	try {
		return queryRows(
			database,
			`${POST_SELECT}
			 WHERE p.status = 'published' AND t.language = :language
			 ORDER BY p.created_at DESC`,
			{ ':language': language },
		).map(rowToPost);
	} finally {
		database.close();
	}
}

function resolveUrl(value: string, baseUrl: string) {
	if (
		!value ||
		value.startsWith('#') ||
		/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)
	) {
		return value;
	}
	return new URL(value, baseUrl).toString();
}

function rewriteSrcset(value: string, baseUrl: string) {
	return value
		.split(',')
		.map((candidate) => {
			const [url, ...descriptor] = candidate.trim().split(/\s+/);
			return [resolveUrl(url, baseUrl), ...descriptor].join(' ');
		})
		.join(', ');
}

function sanitizeArticle(html: string, baseUrl: string) {
	const urlAttributes = new Set(['href', 'src', 'poster']);
	return sanitizeHtml(html, {
		allowedTags: [
			...sanitizeHtml.defaults.allowedTags,
			'article',
			'img',
			'figure',
			'figcaption',
			'picture',
			'source',
			'svg',
			'path',
			'circle',
			'line',
			'polyline',
			'polygon',
			'rect',
			'video',
		],
		allowedAttributes: {
			'*': ['class', 'id', 'aria-*', 'data-*'],
			a: ['href', 'target', 'rel', 'title'],
			img: ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading'],
			source: ['src', 'srcset', 'type', 'media'],
			video: ['src', 'poster', 'controls', 'preload', 'muted', 'loop'],
			svg: ['viewBox', 'fill', 'stroke', 'aria-hidden'],
			path: ['d', 'fill', 'stroke', 'stroke-width'],
			circle: ['cx', 'cy', 'r', 'fill', 'stroke'],
			line: ['x1', 'x2', 'y1', 'y2', 'stroke'],
			polyline: ['points', 'fill', 'stroke'],
			polygon: ['points', 'fill', 'stroke'],
			rect: ['x', 'y', 'width', 'height', 'rx', 'fill', 'stroke'],
		},
		allowedSchemes: ['http', 'https', 'mailto'],
		transformTags: {
			'*': (tagName, attributes) => {
				const rewritten = { ...attributes };
				for (const attribute of urlAttributes) {
					if (rewritten[attribute]) {
						rewritten[attribute] = resolveUrl(rewritten[attribute], baseUrl);
					}
				}
				if (rewritten.srcset) {
					rewritten.srcset = rewriteSrcset(rewritten.srcset, baseUrl);
				}
				if (tagName === 'a' && rewritten.target === '_blank') {
					rewritten.rel = 'noopener noreferrer';
				}
				return { tagName, attribs: rewritten };
			},
		},
	});
}

function rewriteCssUrls(css: string, baseUrl: string) {
	return css.replace(
		/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
		(_match, quote, url) => {
			return `url(${quote}${resolveUrl(url.trim(), baseUrl)}${quote})`;
		},
	);
}

async function scopeArticleCss(css: string, postId: string, baseUrl: string) {
	const wrapper = `[data-blog-post="${postId}"]`;
	const result = await postcss([
		prefixSelector({
			prefix: wrapper,
			transform(prefix: string, selector: string) {
				if (
					selector === ':root' ||
					selector === 'html' ||
					selector === 'body'
				) {
					return prefix;
				}
				return `${prefix} ${selector}`;
			},
		}),
	]).process(rewriteCssUrls(css, baseUrl), { from: undefined });
	return result.css;
}

async function loadArticle(
	post: SitePost,
	language: Language,
): Promise<SitePost> {
	const baseUrl = `${getBlogContentUrl()}/${post.id}/content/`;
	const [htmlResponse, cssResponse] = await Promise.all([
		fetch(`${baseUrl}index_${language}.html`, {
			next: { revalidate: INDEX_REVALIDATE_SECONDS },
		}),
		fetch(`${baseUrl}styles.css`, {
			next: { revalidate: INDEX_REVALIDATE_SECONDS },
		}),
	]);
	if (!htmlResponse.ok || !cssResponse.ok) {
		throw new Error(`Article assets unavailable for ${post.id}/${language}`);
	}
	const [html, css] = await Promise.all([
		htmlResponse.text(),
		cssResponse.text(),
	]);
	return {
		...post,
		body: sanitizeArticle(html, baseUrl),
		styles: await scopeArticleCss(css, post.id, baseUrl),
	};
}

async function fetchFeed(name: 'top-10' | 'featured'): Promise<BlogHeader[]> {
	const response = await fetch(`${getBlogContentUrl()}/feeds/${name}.json`, {
		next: { revalidate: INDEX_REVALIDATE_SECONDS },
	});
	if (!response.ok) {
		throw new Error(
			`Blog feed '${name}' request failed with ${response.status}`,
		);
	}
	return response.json();
}

function headerToPost(header: BlogHeader, language: Language): SitePost | null {
	const localized = header[language];
	if (!localized) {
		return null;
	}
	const alternateLanguage: Language = language === 'en' ? 'vi' : 'en';
	return {
		id: header.id,
		title: localized.title,
		slug: localized.slug,
		excerpt: localized.summary ?? '',
		publishedAt: header.created_at,
		updatedAt: header.updated_at,
		featured: header.featured === true,
		tags: localized.tags ?? [],
		image: header.cover_image
			? absolutePostUrl(header.id, header.cover_image)
			: undefined,
		category: header.category || undefined,
		alternateSlug: header[alternateLanguage]?.slug,
	};
}

export async function getHomePosts(language: Language) {
	const [latestFeed, featuredFeed] = await Promise.all([
		fetchFeed('top-10'),
		fetchFeed('featured'),
	]);
	const toPosts = (headers: BlogHeader[]) =>
		headers
			.map((header) => headerToPost(header, language))
			.filter((post): post is SitePost => post !== null);
	return {
		featured: toPosts(featuredFeed).slice(0, 6),
		latest: toPosts(latestFeed).slice(0, 6),
	};
}

export async function getInsightsPosts(language: Language) {
	return listPosts(language);
}

export async function getPostBySlug(slug: string, language: Language) {
	const database = await openDatabase();
	try {
		const rows = queryRows(
			database,
			`${POST_SELECT}
			 WHERE p.status = 'published'
			 AND t.language = :language
			 AND p.id = (
				SELECT post_id FROM post_translations WHERE slug = :slug LIMIT 1
			 )
			 LIMIT 1`,
			{ ':language': language, ':slug': slug },
		);
		return rows[0] ? loadArticle(rowToPost(rows[0]), language) : null;
	} finally {
		database.close();
	}
}

export async function getAllPostRoutes() {
	const database = await openDatabase();
	try {
		const result = database.exec(`
			SELECT
				t.language, t.slug, p.updated_at,
				alternate.language AS alternate_language,
				alternate.slug AS alternate_slug
			FROM post_translations t
			JOIN posts p ON p.id = t.post_id
			LEFT JOIN post_translations alternate
				ON alternate.post_id = t.post_id AND alternate.language <> t.language
			WHERE p.status = 'published'
			ORDER BY p.created_at DESC
		`)[0];
		if (!result) return [];
		return result.values.map(
			([language, slug, updatedAt, alternateLanguage, alternateSlug]) => ({
				language: String(language) as Language,
				slug: String(slug),
				updatedAt: String(updatedAt),
				alternateLanguage: alternateLanguage
					? (String(alternateLanguage) as Language)
					: undefined,
				alternateSlug: alternateSlug ? String(alternateSlug) : undefined,
			}),
		);
	} finally {
		database.close();
	}
}
