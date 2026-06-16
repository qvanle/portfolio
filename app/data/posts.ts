export interface SitePost {
	title: string;
	slug: string;
	excerpt: string;
	publishedAt: string;
	featured: boolean;
}

interface StrapiPostRecord {
	attributes?: Record<string, unknown>;
	title?: unknown;
	slug?: unknown;
	excerpt?: unknown;
	summary?: unknown;
	description?: unknown;
	publishedAt?: unknown;
	featured?: unknown;
	isFeatured?: unknown;
}

const fallbackPosts: SitePost[] = [
	{
		title: 'How I scope automation before I build it',
		slug: 'scoping-automation-before-building',
		excerpt:
			'A simple checklist I use to keep repetitive work honest, measurable, and worth automating.',
		publishedAt: '2026-06-03',
		featured: true,
	},
	{
		title: 'The cost of manual repetition in small teams',
		slug: 'cost-of-manual-repetition',
		excerpt:
			'Why tiny inefficiencies matter once they are repeated across a whole engineering org.',
		publishedAt: '2026-05-22',
		featured: true,
	},
	{
		title: 'Building tools for myself first',
		slug: 'building-tools-for-myself-first',
		excerpt:
			'A practical rule that keeps product decisions grounded in actual usage.',
		publishedAt: '2026-05-11',
		featured: true,
	},
	{
		title: 'What I want RotexAI to save people from',
		slug: 'what-rotexai-should-save-people-from',
		excerpt:
			'The class of tasks I think should disappear from a modern workflow stack.',
		publishedAt: '2026-04-29',
		featured: true,
	},
	{
		title: 'A calmer way to think about workflow design',
		slug: 'calmer-way-to-think-about-workflow-design',
		excerpt:
			'Less ceremony, fewer steps, and a clearer path from input to result.',
		publishedAt: '2026-04-17',
		featured: true,
	},
	{
		title: 'Why I still write implementation notes',
		slug: 'why-i-still-write-implementation-notes',
		excerpt:
			'Short notes keep decisions recoverable when context disappears later.',
		publishedAt: '2026-06-10',
		featured: false,
	},
	{
		title: 'How I choose when not to automate something',
		slug: 'how-i-choose-when-not-to-automate',
		excerpt:
			'Automation is only worth it when the result is easier to trust than the manual path.',
		publishedAt: '2026-06-08',
		featured: false,
	},
	{
		title: 'Designing for first-time users who are busy',
		slug: 'designing-for-busy-first-time-users',
		excerpt:
			'Small interfaces work best when they explain themselves without ceremony.',
		publishedAt: '2026-05-30',
		featured: false,
	},
	{
		title: 'The parts of a workflow that should stay visible',
		slug: 'parts-of-a-workflow-that-should-stay-visible',
		excerpt:
			'Visibility is what lets people trust a system they are about to rely on.',
		publishedAt: '2026-05-19',
		featured: false,
	},
	{
		title: 'Open-source tools that should be boring to use',
		slug: 'open-source-tools-that-should-be-boring',
		excerpt:
			'The best utilities disappear into the work instead of asking for attention.',
		publishedAt: '2026-05-07',
		featured: false,
	},
];

function normalizeStrapiPost(raw: StrapiPostRecord): SitePost | null {
	const data = raw?.attributes ?? raw;

	if (!data?.title || !data?.slug || !data?.publishedAt) {
		return null;
	}

	return {
		title: String(data.title),
		slug: String(data.slug),
		excerpt: String(
			data.excerpt ??
				data.summary ??
				data.description ??
				'Notes on building tools, workflows, and useful systems.',
		),
		publishedAt: String(data.publishedAt),
		featured: Boolean(data.featured ?? data.isFeatured ?? false),
	};
}

async function fetchStrapiPosts(): Promise<SitePost[] | null> {
	const baseUrl = process.env.STRAPI_URL?.trim();

	if (!baseUrl) {
		return null;
	}

	const token = process.env.STRAPI_API_TOKEN?.trim();
	const endpoint = `${baseUrl.replace(/\/$/, '')}/api/posts?sort=publishedAt:desc&pagination[pageSize]=100`;

	try {
		const response = await fetch(endpoint, {
			headers: {
				Accept: 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			next: {
				revalidate: 60,
			},
		});

		if (!response.ok) {
			return null;
		}

		const payload = await response.json();
		const entries: StrapiPostRecord[] = Array.isArray(payload?.data)
			? payload.data
			: [];
		const posts = entries
			.map((entry) => normalizeStrapiPost(entry))
			.filter((post): post is SitePost => post !== null);

		return posts.length > 0 ? posts : null;
	} catch {
		return null;
	}
}

async function loadPosts(): Promise<SitePost[]> {
	const remotePosts = await fetchStrapiPosts();

	if (remotePosts && remotePosts.length > 0) {
		return remotePosts;
	}

	return fallbackPosts;
}

function byNewestFirst(left: SitePost, right: SitePost) {
	return (
		new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
	);
}

export async function getHomePosts() {
	const posts = await loadPosts();
	const latest = [...posts].sort(byNewestFirst).slice(0, 5);
	const featured = [...posts]
		.filter((post) => post.featured)
		.sort(byNewestFirst)
		.slice(0, 5);

	return {
		featured,
		latest,
	};
}

export async function getInsightsPosts() {
	const posts = await loadPosts();

	return [...posts].sort(byNewestFirst);
}
