import { createPost } from '../../../actions/admin-posts';
import PostForm from '../../../components/admin/post-form';

export default function NewPostPage() {
	return (
		<div>
			<h1 className='mb-6 text-2xl font-semibold text-black dark:text-white'>
				New Post
			</h1>
			<PostForm onSubmit={createPost} />
		</div>
	);
}
