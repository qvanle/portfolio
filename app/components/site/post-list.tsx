'use client';

import type { SitePost } from '../../data/posts';

interface PostListProps {
	posts: SitePost[];
	locale: 'en' | 'vi';
}

function formatPostDate(value: string, locale: 'en' | 'vi') {
	return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
	}).format(new Date(value));
}

export default function PostList({ posts, locale }: PostListProps) {
	return (
		<ul className='mt-8 space-y-2'>
			{posts.map((post) => (
				<li key={post.slug} className='group py-4'>
					<article className='grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6'>
						<p className='text-xs uppercase tracking-[0.28em] text-black/45 dark:text-white/40'>
							{formatPostDate(post.publishedAt, locale)}
						</p>
						<div className='min-w-0'>
							<h3 className='text-lg font-semibold leading-tight transition-colors group-hover:text-primary-500'>
								{post.title}
							</h3>
							<p className='mt-2 max-w-3xl truncate text-sm leading-7 text-black/65 dark:text-white/60'>
								{post.excerpt}
							</p>
						</div>
					</article>
				</li>
			))}
		</ul>
	);
}
