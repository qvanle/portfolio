import { notFound } from 'next/navigation';
import { getPost, updatePost } from '../../../../../actions/admin-posts';
import PostForm from '../../../../../components/admin/post-form';

interface EditPostPageProps {
	params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
	const { id } = await params;
	const result = await getPost(id);

	if (!result.success || !result.data) notFound();

	const post = result.data;

	async function handleUpdate(data: Parameters<typeof updatePost>[1]) {
		'use server';
		return updatePost(id, data);
	}

	return (
		<div>
			<h1 className='mb-6 text-2xl font-semibold text-black dark:text-white'>
				Edit Post
			</h1>
			<PostForm initialData={post} onSubmit={handleUpdate} />
		</div>
	);
}
