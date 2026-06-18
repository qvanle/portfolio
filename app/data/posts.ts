export interface SitePost {
	title: string;
	slug: string;
	excerpt: string;
	publishedAt: string;
	featured: boolean;
	image?: string;
	body?: string[];
	category?: string;
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
	body?: unknown;
	content?: unknown;
	category?: unknown;
}

const fallbackPosts: SitePost[] = [
	{
		title: 'How I scope automation before I build it',
		slug: 'scoping-automation-before-building',
		excerpt:
			'A simple checklist I use to keep repetitive work honest, measurable, and worth automating.',
		publishedAt: '2026-06-03',
		featured: true,
		category: 'automation',
		body: [
			'Every automation project starts with the same temptation: just build it. The task is repetitive, the solution seems obvious, and the cost of doing nothing feels high. But I have learned that the cost of automating the wrong thing is often higher.',
			'Before I write any code, I run through a short checklist. How often does this task actually happen? How long does it take each time? What is the error rate when a person does it? If the answers do not add up to a clear case, I stop. Not every repetitive task deserves a system around it.',
			'The checklist also forces me to define what "done" looks like. A successful automation is not one that runs — it is one that people trust enough to stop checking. That trust comes from scoping the work honestly before any code is written.',
		],
	},
	{
		title: 'The cost of manual repetition in small teams',
		slug: 'cost-of-manual-repetition',
		excerpt:
			'Why tiny inefficiencies matter once they are repeated across a whole engineering org.',
		publishedAt: '2026-05-22',
		featured: true,
		category: 'automation',
		body: [
			'In a small team, every person carries more weight. When one engineer spends twenty minutes a day on a task that could be automated, that is not just twenty minutes lost — it is twenty minutes of context-switching, twenty minutes of reduced focus on the work that actually matters.',
			'I started tracking these micro-costs at RotexAI. The numbers were surprising. A five-person team doing three manual tasks a day, each taking ten minutes, loses over twelve hours a week. That is an entire person-day and a half, every single week, spent on work that a machine could handle.',
			'The fix is not to automate everything at once. It is to make the cost visible. Once people can see the time they are losing, the conversation about what to automate becomes much easier.',
		],
	},
	{
		title: 'Building tools for myself first',
		slug: 'building-tools-for-myself-first',
		excerpt:
			'A practical rule that keeps product decisions grounded in actual usage.',
		publishedAt: '2026-05-11',
		featured: true,
		category: 'product',
		body: [
			'Before anyone else uses something I build, I use it myself. This is not a philosophy — it is a practical constraint. If I cannot rely on my own tool for my own work, I have no business asking someone else to.',
			'This rule catches problems that testing alone never would. Testing tells you if the code works. Using the tool tells you if the experience works. There is a difference between a feature that passes tests and a feature that feels right in the middle of a real workflow.',
			'The hardest part is honesty. It is easy to make excuses for your own product. The rule forces me to notice when I reach for a different tool instead of my own, and to ask why.',
		],
	},
	{
		title: 'What I want RotexAI to save people from',
		slug: 'what-rotexai-should-save-people-from',
		excerpt:
			'The class of tasks I think should disappear from a modern workflow stack.',
		publishedAt: '2026-04-29',
		featured: true,
		category: 'product',
		body: [
			'There is a category of work that should not exist in a modern team: tasks that are predictable, low-judgment, and repeated often enough that everyone knows the steps by heart. These are the tasks people describe by saying "it is just a matter of" — and that phrase is the tell.',
			'If you can describe a task as "just a matter of," it means the decision-making is already done. The only thing left is execution. And execution without decisions is exactly what machines are good at.',
			'RotexAI is built to absorb that category. Not the creative work, not the judgment calls, not the conversations — just the predictable steps that follow a known path. The goal is to give people back the time they spend on work that does not need them.',
		],
	},
	{
		title: 'A calmer way to think about workflow design',
		slug: 'calmer-way-to-think-about-workflow-design',
		excerpt:
			'Less ceremony, fewer steps, and a clearer path from input to result.',
		publishedAt: '2026-04-17',
		featured: true,
		category: 'workflow',
		body: [
			'Most workflow tools make things harder before they make things easier. They introduce new concepts, new interfaces, new abstractions. By the time you have set up the workflow, you have spent more time configuring it than you would have spent doing the task by hand.',
			'I think the best workflows are the ones that feel inevitable. You look at them and think, "of course that is how it should work." There is no ceremony, no extra steps, no configuration for the sake of flexibility. Just a clear path from input to result.',
			'At RotexAI, this means starting with the output. What does the person need at the end? Work backward from there. Every step that does not directly serve the result gets cut.',
		],
	},
	{
		title: 'Why I still write implementation notes',
		slug: 'why-i-still-write-implementation-notes',
		excerpt:
			'Short notes keep decisions recoverable when context disappears later.',
		publishedAt: '2026-06-10',
		featured: true,
		category: 'engineering',
		body: [
			'Code tells you what happened. It does not tell you why. Six months from now, I will look at a function and wonder why I chose this approach over the obvious alternative. Without a note, that context is gone.',
			'My implementation notes are short — rarely more than a paragraph. They answer one question: "Why this and not that?" The format does not matter. What matters is that the reasoning is written down while it is still fresh.',
			'I have been burned enough times by context loss to make this non-negotiable. The ten minutes I spend writing a note today saves hours of archaeology later.',
		],
	},
	{
		title: 'How I choose when not to automate something',
		slug: 'how-i-choose-when-not-to-automate',
		excerpt:
			'Automation is only worth it when the result is easier to trust than the manual path.',
		publishedAt: '2026-06-08',
		featured: false,
		category: 'automation',
		body: [
			'Not everything should be automated. Some tasks change too often. Some involve judgment that is hard to encode. Some are so rare that the automation would cost more to maintain than the manual work it replaces.',
			'My test is simple: will the automated version be easier to trust than the manual version? If the answer is no — if people will still need to check the output every time — then the automation is not saving anyone anything. It is just adding a layer.',
			'The best automation is invisible. If people feel the need to supervise it, something is wrong with the scope.',
		],
	},
	{
		title: 'Designing for first-time users who are busy',
		slug: 'designing-for-busy-first-time-users',
		excerpt:
			'Small interfaces work best when they explain themselves without ceremony.',
		publishedAt: '2026-05-30',
		featured: false,
		category: 'product',
		body: [
			'A first-time user who is busy will give your product about thirty seconds. In that time, they need to understand what it does and how to start. If they cannot, they leave.',
			'This constraint is a gift. It forces you to strip away everything that is not essential. No onboarding tours, no tooltips, no "getting started" guides. Just an interface that makes its purpose obvious.',
			'The trick is labeling. Every button, every field, every section should say exactly what it does in the plainest possible language. Clever names are a luxury that busy people cannot afford.',
		],
	},
	{
		title: 'The parts of a workflow that should stay visible',
		slug: 'parts-of-a-workflow-that-should-stay-visible',
		excerpt:
			'Visibility is what lets people trust a system they are about to rely on.',
		publishedAt: '2026-05-19',
		featured: false,
		category: 'workflow',
		body: [
			'When a workflow hides too much, people stop trusting it. They start checking outputs manually, adding verification steps, building workarounds. The automation becomes something they work around instead of something they work with.',
			'The fix is selective visibility. Not everything needs to be shown — that leads to dashboards nobody reads. But the critical decision points, the places where the workflow could go wrong, should always be visible.',
			'At RotexAI, we surface three things: what the workflow received, what it decided, and what it produced. Everything else stays hidden until someone asks for it.',
		],
	},
	{
		title: 'Open-source tools that should be boring to use',
		slug: 'open-source-tools-that-should-be-boring',
		excerpt:
			'The best utilities disappear into the work instead of asking for attention.',
		publishedAt: '2026-05-07',
		featured: false,
		category: 'engineering',
		body: [
			'The best developer tools are boring. You install them, they work, and you forget they exist. They do not have personality. They do not surprise you. They just quietly do their job.',
			'This is harder to achieve than it sounds. It requires resisting the urge to add features, to make the tool "smart," to differentiate it from alternatives. Boring tools are built by people who understand that the user\'s attention belongs to their work, not to the tool.',
			'When I evaluate open-source tools for RotexAI, the first thing I look for is how quickly I can forget about them. If a tool keeps reminding me it exists, it is not ready.',
		],
	},
];

function normalizeStrapiPost(raw: StrapiPostRecord): SitePost | null {
	const data = raw?.attributes ?? raw;

	if (!data?.title || !data?.slug || !data?.publishedAt) {
		return null;
	}

	const rawBody = data.body ?? data.content;
	let body: string[] | undefined;
	if (typeof rawBody === 'string' && rawBody.trim()) {
		body = rawBody.split(/\n\n+/).filter(Boolean);
	} else if (Array.isArray(rawBody)) {
		body = rawBody.map(String);
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
		body,
		...(data.category ? { category: String(data.category) } : {}),
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
	const latest = [...posts].sort(byNewestFirst).slice(0, 6);
	const featured = [...posts]
		.filter((post) => post.featured)
		.sort(byNewestFirst)
		.slice(0, 6);

	return {
		featured,
		latest,
	};
}

export async function getInsightsPosts() {
	const posts = await loadPosts();

	return [...posts].sort(byNewestFirst);
}

export async function getPostBySlug(slug: string) {
	const posts = await loadPosts();

	return posts.find((post) => post.slug === slug) ?? null;
}
