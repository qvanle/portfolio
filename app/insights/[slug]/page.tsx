import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, permanentRedirect } from 'next/navigation';
import PostModal from '../../components/insights/post-modal';
import JsonLd from '../../components/seo/json-ld';
import { getInsightsPosts, getPostBySlug } from '../../data/posts';
import { siteName, siteUrl } from '../../lib/site-config';

interface PageProps {
	params: Promise<{ slug: string }>;
}

async function selectedLanguage() {
	const cookieStore = await cookies();
	return cookieStore.get('site-language')?.value === 'vi' ? 'vi' : 'en';
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const [{ slug }, language] = await Promise.all([params, selectedLanguage()]);
	const post = await getPostBySlug(slug, language);
	if (!post) {
		return {
			title: 'Not Found',
			robots: { index: false },
		};
	}
	const alternateLanguage = language === 'en' ? 'vi' : 'en';
	return {
		title: post.title,
		description: post.excerpt,
		alternates: {
			canonical: `${siteUrl}/insights/${post.slug}`,
			languages: {
				[language]: `${siteUrl}/insights/${post.slug}`,
				...(post.alternateSlug
					? {
							[alternateLanguage]: `${siteUrl}/insights/${post.alternateSlug}`,
						}
					: {}),
			},
		},
		openGraph: {
			type: 'article',
			title: post.title,
			description: post.excerpt,
			url: `/insights/${post.slug}`,
			locale: language === 'vi' ? 'vi_VN' : 'en_US',
			publishedTime: post.publishedAt,
			modifiedTime: post.updatedAt,
			authors: [siteName],
			images: post.image ? [post.image] : undefined,
		},
		twitter: {
			card: post.image ? 'summary_large_image' : 'summary',
			title: post.title,
			description: post.excerpt,
		},
	};
}

export default async function Page({ params }: PageProps) {
	const { slug } = await params;
	const language = await selectedLanguage();

	const post = await getPostBySlug(slug, language);

	if (!post) {
		notFound();
	}
	if (post.slug !== slug) {
		permanentRedirect(`/insights/${post.slug}`);
	}

	const allPosts = await getInsightsPosts(language);
	const others = allPosts.filter((p) => p.slug !== slug);
	const sameCategory = others.filter((p) => p.category === post.category);
	const different = others.filter((p) => p.category !== post.category);
	const relatedPosts = [...sameCategory, ...different].slice(0, 3);

	const postUrl = `${siteUrl}/insights/${post.slug}`;

	return (
		<>
			<JsonLd
				data={{
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: post.title,
					description: post.excerpt,
					...(post.image ? { image: post.image } : {}),
					datePublished: post.publishedAt,
					dateModified: post.updatedAt,
					inLanguage: language,
					author: {
						'@type': 'Person',
						name: siteName,
						url: siteUrl,
					},
					mainEntityOfPage: postUrl,
				}}
			/>
			<JsonLd
				data={{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{
							'@type': 'ListItem',
							position: 1,
							name: 'Home',
							item: siteUrl,
						},
						{
							'@type': 'ListItem',
							position: 2,
							name: 'Insights',
							item: `${siteUrl}/insights`,
						},
						{
							'@type': 'ListItem',
							position: 3,
							name: post.title,
							item: postUrl,
						},
					],
				}}
			/>
			<PostModal post={post} relatedPosts={relatedPosts} />
		</>
	);
}
