import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const contentRoot = resolve(process.cwd(), '../blog-content/publish');
const postId = '019f40b4-163f-79a3-90be-47066b0dbf40';

describe('blog content reader', () => {
	beforeEach(() => {
		process.env.BLOG_CONTENT_URL = 'https://content.example.test';
		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: string | URL | Request) => {
				const url = String(input);
				if (url.endsWith('/index.db')) {
					return new Response(await readFile(resolve(contentRoot, 'index.db')));
				}
				if (url.endsWith('/feeds/top-10.json')) {
					return new Response(
						await readFile(resolve(contentRoot, 'feeds/top-10.json')),
					);
				}
				if (url.endsWith('/feeds/featured.json')) {
					return new Response(
						await readFile(resolve(contentRoot, 'feeds/featured.json')),
					);
				}
				if (url.endsWith('/content/index_en.html')) {
					return new Response(
						'<article><img src="assets/figure.png"><script>alert(1)</script></article>',
					);
				}
				if (url.endsWith('/content/styles.css')) {
					return new Response(':root{--tone:red} article{color:var(--tone)}');
				}
				return new Response(null, { status: 404 });
			}),
		);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('lists localized featured and latest posts from the precomputed feeds', async () => {
		const { getHomePosts } = await import('./posts');
		const result = await getHomePosts('en');
		expect(result.featured).toHaveLength(1);
		expect(result.featured[0]).toMatchObject({
			id: postId,
			featured: true,
			slug: 'physmirror-physics-aware-mirror-object-generation',
		});
		expect(result.featured[0]?.image).toMatch(
			new RegExp(`^https://content\\.example\\.test/${postId}/content/assets/`),
		);
		expect(result.latest.map((post) => post.id)).toContain(postId);
		expect(result.latest[0]?.alternateSlug).toBe(
			'physmirror-tao-vat-the-guong-nhan-thuc-vat-ly',
		);
	});

	it('resolves translated slugs and isolates article assets', async () => {
		const { getPostBySlug } = await import('./posts');
		const post = await getPostBySlug(
			'physmirror-tao-vat-the-guong-nhan-thuc-vat-ly',
			'en',
		);
		expect(post?.slug).toBe(
			'physmirror-physics-aware-mirror-object-generation',
		);
		expect(post?.body).toContain(
			`src="https://content.example.test/${postId}/content/assets/figure.png"`,
		);
		expect(post?.body).not.toContain('script');
		expect(post?.styles).toContain(`[data-blog-post="${postId}"]`);
	});
});
