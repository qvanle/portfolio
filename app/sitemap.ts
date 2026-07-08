import type { MetadataRoute } from 'next';
import { getAllPostRoutes } from './data/posts';
import { siteUrl } from './lib/site-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	let posts: Awaited<ReturnType<typeof getAllPostRoutes>> = [];
	try {
		posts = await getAllPostRoutes();
	} catch (error) {
		console.error('Unable to add blog posts to sitemap', error);
	}
	const latestUpdate = posts.reduce<string | undefined>(
		(latest, post) =>
			!latest || post.updatedAt > latest ? post.updatedAt : latest,
		undefined,
	);
	return [
		{
			url: `${siteUrl}/`,
			...(latestUpdate ? { lastModified: latestUpdate } : {}),
		},
		{
			url: `${siteUrl}/insights`,
			...(latestUpdate ? { lastModified: latestUpdate } : {}),
		},
		...posts.map((post) => ({
			url: `${siteUrl}/insights/${post.slug}`,
			lastModified: post.updatedAt,
			alternates: {
				languages: {
					[post.language]: `${siteUrl}/insights/${post.slug}`,
					...(post.alternateLanguage && post.alternateSlug
						? {
								[post.alternateLanguage]: `${siteUrl}/insights/${post.alternateSlug}`,
							}
						: {}),
				},
			},
		})),
	];
}
