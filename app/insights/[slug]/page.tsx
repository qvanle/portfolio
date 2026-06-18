import { notFound } from 'next/navigation';
import PostModal from '../../components/insights/post-modal';
import { getInsightsPosts, getPostBySlug } from '../../data/posts';

interface PageProps {
	params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const allPosts = await getInsightsPosts();
	const others = allPosts.filter((p) => p.slug !== slug);
	const sameCategory = others.filter((p) => p.category === post.category);
	const different = others.filter((p) => p.category !== post.category);
	const relatedPosts = [...sameCategory, ...different].slice(0, 3);

	return <PostModal post={post} relatedPosts={relatedPosts} />;
}
