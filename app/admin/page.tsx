import { listPosts } from '../actions/admin-posts';
import PostsTable from '../components/admin/posts-table';

export default async function AdminDashboardPage() {
	const result = await listPosts(1);
	const posts = result.data?.posts ?? [];
	const total = result.data?.total ?? 0;

	return (
		<div>
			<h1 className='mb-6 text-2xl font-semibold text-black dark:text-white'>
				Posts
			</h1>
			<PostsTable initialPosts={posts} initialTotal={total} />
		</div>
	);
}
