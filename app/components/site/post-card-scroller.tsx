'use client';

import type { SitePost } from '../../data/posts';
import PostCard from './post-card';

interface PostCardScrollerProps {
	posts: SitePost[];
	locale: 'en' | 'vi';
}

export default function PostCardScroller({
	posts,
	locale,
}: PostCardScrollerProps) {
	return (
		<div className='mt-8'>
			<div className='flex gap-5 overflow-x-auto px-6 pb-4 sm:px-8 lg:pl-[calc((100vw-72rem)/2+4rem)] lg:pr-8 scrollbar-hide'>
				{posts.map((post, i) => (
					<PostCard
						key={post.slug}
						post={post}
						index={i}
						locale={locale}
						className='w-72 shrink-0 sm:w-80'
					/>
				))}
			</div>
		</div>
	);
}
