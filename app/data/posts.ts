import type { Language } from './site-copy';

export interface SitePost {
	title: string;
	slug: string;
	excerpt: string;
	publishedAt: string;
	featured: boolean;
	image?: string;
	body?: string;
	category?: string;
}

interface DirectusPostMeta {
	id: string;
	status: string;
	slug: string;
	featured: boolean;
	category?: string;
	image?: { id: string } | string | null;
	date_published?: string;
	translations?: DirectusTranslation[];
}

interface DirectusTranslation {
	title: string;
	excerpt: string;
	body?: string;
	languages_code: string;
}

const DIRECTUS_URL = process.env.DIRECTUS_URL?.replace(/\/$/, '') ?? '';

function resolveImageUrl(image: DirectusPostMeta['image']): string | undefined {
	if (!image) return undefined;
	const id = typeof image === 'string' ? image : image.id;
	return `${DIRECTUS_URL}/assets/${id}`;
}

function normalizePost(raw: DirectusPostMeta): SitePost | null {
	const t = raw.translations?.[0];
	if (!t) return null;

	return {
		title: t.title,
		slug: raw.slug,
		excerpt: t.excerpt,
		publishedAt: raw.date_published ?? '',
		featured: raw.featured ?? false,
		image: resolveImageUrl(raw.image),
		body: t.body ?? undefined,
		category: raw.category ?? undefined,
	};
}

async function fetchPostsMeta(language: Language): Promise<SitePost[]> {
	if (!DIRECTUS_URL) return [];

	const params = new URLSearchParams({
		'fields[]': [
			'id',
			'slug',
			'featured',
			'category',
			'date_published',
			'image.id',
			'translations.title',
			'translations.excerpt',
			'translations.languages_code',
		].join(','),
		'filter[status][_eq]': 'published',
		'deep[translations][_filter][languages_code][_eq]': language,
		sort: '-date_published',
		limit: '100',
	});

	try {
		const res = await fetch(`${DIRECTUS_URL}/items/posts_meta?${params}`, {
			headers: { Accept: 'application/json' },
			next: { revalidate: 60 },
		});

		if (!res.ok) return [];

		const json = await res.json();
		const items: DirectusPostMeta[] = json.data ?? [];
		return items.map(normalizePost).filter((p): p is SitePost => p !== null);
	} catch {
		return [];
	}
}

async function fetchPostBySlug(
	slug: string,
	language: Language,
): Promise<SitePost | null> {
	if (!DIRECTUS_URL) return null;

	const params = new URLSearchParams({
		'fields[]': [
			'id',
			'slug',
			'featured',
			'category',
			'date_published',
			'image.id',
			'translations.title',
			'translations.excerpt',
			'translations.body',
			'translations.languages_code',
		].join(','),
		'filter[slug][_eq]': slug,
		'filter[status][_eq]': 'published',
		'deep[translations][_filter][languages_code][_eq]': language,
		limit: '1',
	});

	try {
		const res = await fetch(`${DIRECTUS_URL}/items/posts_meta?${params}`, {
			headers: { Accept: 'application/json' },
			next: { revalidate: 60 },
		});

		if (!res.ok) return null;

		const json = await res.json();
		const items: DirectusPostMeta[] = json.data ?? [];
		return items.length > 0 ? normalizePost(items[0]) : null;
	} catch {
		return null;
	}
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
