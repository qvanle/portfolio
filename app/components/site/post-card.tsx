'use client';

import classNames from 'classnames';
import Link from 'next/link';
import type { SitePost } from '../../data/posts';
import { categoryLabel } from '../../data/site-copy';
import { coverFit } from '../../lib/site-config';

interface PostCardProps {
	post: SitePost;
	index: number;
	locale: 'en' | 'vi';
	className?: string;
	href?: string;
}

const gradients = [
	'from-amber-400/80 to-orange-500/80',
	'from-emerald-400/80 to-teal-500/80',
	'from-violet-400/80 to-purple-500/80',
	'from-sky-400/80 to-blue-500/80',
	'from-rose-400/80 to-pink-500/80',
];

function formatPostDate(value: string, locale: 'en' | 'vi') {
	return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
	}).format(new Date(value));
}

export default function PostCard({
	post,
	index,
	locale,
	className,
	href,
}: PostCardProps) {
	const card = (
		<article
			className={classNames(
				'group flex h-full min-h-[28rem] cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-white/5',
				className,
			)}
		>
			{post.image ? (
				<div className='relative aspect-[16/8] w-full shrink-0 overflow-hidden'>
					<img
						src={post.image}
						alt={post.title}
						className={classNames(
							'h-full w-full transition-transform duration-300 group-hover:scale-105',
							coverFit[post.id] === 'contain'
								? 'bg-white object-contain p-2'
								: 'object-cover',
						)}
					/>
				</div>
			) : (
				<div
					className={`relative flex aspect-[16/8] w-full shrink-0 items-end overflow-hidden bg-gradient-to-br ${gradients[index % gradients.length]} p-4`}
				>
					<span className='text-xs font-medium uppercase tracking-widest text-white/70'>
						{formatPostDate(post.publishedAt, locale)}
					</span>
				</div>
			)}
			<div className='flex flex-1 flex-col p-5'>
				{post.category && (
					<p className='mb-2 text-xs font-medium uppercase tracking-widest text-primary-600 dark:text-primary-400'>
						{categoryLabel(locale, post.category)}
					</p>
				)}
				<h3 className='line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary-500'>
					{post.title}
				</h3>
				<p className='mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-black/60 dark:text-white/55'>
					{post.excerpt}
				</p>
				{post.image && (
					<p className='mt-3 text-xs uppercase tracking-widest text-black/40 dark:text-white/35'>
						{formatPostDate(post.publishedAt, locale)}
					</p>
				)}
			</div>
		</article>
	);

	if (href) {
		return (
			<Link href={href} className='block h-full' data-skip-splash-cursor>
				{card}
			</Link>
		);
	}

	return card;
}
