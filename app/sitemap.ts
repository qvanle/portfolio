import { getAllPostRoutes } from './data/posts';

export const baseUrl = 'https://dalelarroder.com';

export default async function sitemap() {
	let posts: Awaited<ReturnType<typeof getAllPostRoutes>> = [];
	try {
		posts = await getAllPostRoutes();
	} catch (error) {
		console.error('Unable to add blog posts to sitemap', error);
	}
	return [
		{
			url: `${baseUrl}/`,
			lastModified: new Date().toISOString().split('T')[0],
		},
		{
			url: `${baseUrl}/insights`,
			lastModified: new Date().toISOString().split('T')[0],
		},
		...posts.map((post) => ({
			url: `${baseUrl}/insights/${post.slug}`,
			lastModified: post.updatedAt,
			alternates: {
				languages: {
					[post.language]: `${baseUrl}/insights/${post.slug}`,
					...(post.alternateLanguage && post.alternateSlug
						? {
								[post.alternateLanguage]: `${baseUrl}/insights/${post.alternateSlug}`,
							}
						: {}),
				},
			},
		})),
	];
}
