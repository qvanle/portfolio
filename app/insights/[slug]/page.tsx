import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import PostModal from '../../components/insights/post-modal';
import { getInsightsPosts, getPostBySlug } from '../../data/posts';

interface PageProps {
	params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
	const { slug } = await params;
	const cookieStore = await cookies();
	const language =
		cookieStore.get('site-language')?.value === 'vi' ? 'vi' : 'en';

	const post = await getPostBySlug(slug, language);

	if (!post) {
		notFound();
	}

	const allPosts = await getInsightsPosts(language);
	const others = allPosts.filter((p) => p.slug !== slug);
	const sameCategory = others.filter((p) => p.category === post.category);
	const different = others.filter((p) => p.category !== post.category);
	const relatedPosts = [...sameCategory, ...different].slice(0, 3);

	return <PostModal post={post} relatedPosts={relatedPosts} />;
}
