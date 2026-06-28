import type { Language } from './site-copy';

export interface SitePost {
	title: string;
	slug: string;
	excerpt: string;
	publishedAt: string;
	featured: boolean;
	image?: string;
	category?: string;
	content?: string;
	body?: string;
}

interface DirectusPostMetaRef {
	id: string;
	status: string;
	slug: string;
	featured: boolean;
	category?: string | null;
	image?: { id: string } | string | null;
	date_published?: string | null;
	date_created?: string | null;
}

interface DirectusPostTranslation {
	title: string;
	excerpt: string;
	body?: string;
	languages_code: string;
	posts_meta_id: DirectusPostMetaRef;
}

const DIRECTUS_URL =
	process.env.DIRECTUS_URL?.replace(/\/$/, '') ?? 'https://cms.rotexai.com';

function resolveImageUrl(
	image: DirectusPostMetaRef['image'],
): string | undefined {
	if (!image) return undefined;
	const id = typeof image === 'string' ? image : image.id;
	return `${DIRECTUS_URL}/assets/${id}`;
}

function normalizePost(raw: DirectusPostTranslation): SitePost | null {
	const meta = raw.posts_meta_id;
	if (!meta || meta.status !== 'published') return null;

	return {
		title: raw.title,
		slug: meta.slug,
		excerpt: raw.excerpt,
		publishedAt: meta.date_published ?? meta.date_created ?? '',
		featured: Boolean(meta.featured),
		image: resolveImageUrl(meta.image),
		category: meta.category ?? undefined,
		content: raw.body,
		body: raw.body,
	};
}

async function fetchPostTranslations(params: URLSearchParams) {
	const res = await fetch(`${DIRECTUS_URL}/items/posts?${params}`, {
		next: { revalidate: 60 },
	});

	if (!res.ok) return [];
	const json = await res.json();
	return (json.data ?? []) as DirectusPostTranslation[];
}

async function fetchPostsMeta(language: Language): Promise<SitePost[]> {
	const params = new URLSearchParams({
		'fields[]': [
			'title',
			'excerpt',
			'body',
			'languages_code',
			'posts_meta_id.id',
			'posts_meta_id.status',
			'posts_meta_id.slug',
			'posts_meta_id.featured',
			'posts_meta_id.category',
			'posts_meta_id.image.id',
			'posts_meta_id.date_published',
			'posts_meta_id.date_created',
		].join(','),
		'filter[languages_code][_eq]': language,
		'filter[posts_meta_id][status][_eq]': 'published',
		sort: '-posts_meta_id.date_published',
		limit: '100',
	});

	const translations = await fetchPostTranslations(params);
	return translations
		.map(normalizePost)
		.filter((post): post is SitePost => Boolean(post));
}

async function fetchPostBySlug(
	slug: string,
	language: Language,
): Promise<SitePost | null> {
	const params = new URLSearchParams({
		'fields[]': [
			'title',
			'excerpt',
			'body',
			'languages_code',
			'posts_meta_id.id',
			'posts_meta_id.status',
			'posts_meta_id.slug',
			'posts_meta_id.featured',
			'posts_meta_id.category',
			'posts_meta_id.image.id',
			'posts_meta_id.date_published',
			'posts_meta_id.date_created',
		].join(','),
		'filter[languages_code][_eq]': language,
		'filter[posts_meta_id][slug][_eq]': slug,
		'filter[posts_meta_id][status][_eq]': 'published',
		limit: '1',
	});

	const translations = await fetchPostTranslations(params);
	return normalizePost(translations[0]);
}

function byNewestFirst(left: SitePost, right: SitePost) {
	return (
		new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
	);
}

export async function getHomePosts(language: Language) {
	const posts = await fetchPostsMeta(language);
	const sorted = [...posts].sort(byNewestFirst);
	const latest = sorted.slice(0, 6);
	const featured = sorted.filter((p) => p.featured).slice(0, 6);
	return { featured, latest };
}

export async function getInsightsPosts(language: Language) {
	const posts = await fetchPostsMeta(language);
	return [...posts].sort(byNewestFirst);
}

export async function getPostBySlug(slug: string, language: Language) {
	return fetchPostBySlug(slug, language);
}
