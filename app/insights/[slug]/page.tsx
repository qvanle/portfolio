import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import PostModal from '../../components/insights/post-modal';
import { getInsightsPosts, getPostBySlug } from '../../data/posts';

interface PageProps {
	params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dalelarroder.com';

async function selectedLanguage() {
	const cookieStore = await cookies();
	return cookieStore.get('site-language')?.value === 'vi' ? 'vi' : 'en';
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const [{ slug }, language] = await Promise.all([params, selectedLanguage()]);
	const post = await getPostBySlug(slug, language);
	if (!post) return {};
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
			title: post.title,
			description: post.excerpt,
			images: post.image ? [post.image] : undefined,
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
		redirect(`/insights/${post.slug}`);
	}

	const allPosts = await getInsightsPosts(language);
	const others = allPosts.filter((p) => p.slug !== slug);
	const sameCategory = others.filter((p) => p.category === post.category);
	const different = others.filter((p) => p.category !== post.category);
	const relatedPosts = [...sameCategory, ...different].slice(0, 3);

	return <PostModal post={post} relatedPosts={relatedPosts} />;
}
