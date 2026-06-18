'use client';

import classNames from 'classnames';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import type { SitePost } from '../../data/posts';
import { getSiteCopy, localizePosts } from '../../data/site-copy';
import { merryWeather } from '../../fonts';
import { useLanguage } from '../i18n/language-provider';
import { XIcon } from '../layouts/icons/x-icon';
import PostCard from '../site/post-card';

interface PostModalProps {
	post: SitePost;
	relatedPosts: SitePost[];
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
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(value));
}

function gradientIndexForSlug(slug: string) {
	let hash = 0;
	for (const char of slug) {
		hash = (hash * 31 + char.charCodeAt(0)) | 0;
	}
	return Math.abs(hash) % gradients.length;
}

export default function PostModal({ post, relatedPosts }: PostModalProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const copy = getSiteCopy(language);
	const [localizedPost] = localizePosts([post], language);
	const localizedRelated = useMemo(
		() => localizePosts(relatedPosts, language),
		[relatedPosts, language],
	);
	const gradientIndex = gradientIndexForSlug(post.slug);

	const close = useCallback(() => {
		router.push('/insights');
	}, [router]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close();
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [close]);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	}, []);

	const body = localizedPost.body ?? post.body ?? [];

	return (
		<AnimatePresence>
			<div className='fixed inset-0 z-50 flex items-center justify-center'>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
					className='absolute inset-0 bg-black/60 backdrop-blur-sm'
					onClick={close}
					aria-hidden='true'
				/>

				<motion.article
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.5,
						ease: [0.22, 0.61, 0.36, 1] as const,
					}}
					className='relative h-[95vh] w-[95vw] overflow-y-auto rounded-2xl border border-black/8 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-950'
				>
					<button
						type='button'
						onClick={close}
						aria-label='Close'
						className='sticky top-4 right-4 z-10 float-right mr-4 mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black/70 transition-colors hover:bg-black/20 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20'
						data-skip-splash-cursor
					>
						<XIcon className='h-5 w-5' />
					</button>

					{post.image ? (
						<div className='h-56 w-full overflow-hidden sm:h-72'>
							<img
								src={post.image}
								alt={localizedPost.title}
								className='h-full w-full object-cover'
							/>
						</div>
					) : (
						<div
							className={`h-56 w-full rounded-t-2xl bg-gradient-to-br sm:h-72 ${gradients[gradientIndex]}`}
						/>
					)}

					<div className='mx-auto max-w-3xl px-6 py-12 sm:px-10 sm:py-16'>
						<p className='text-sm uppercase tracking-[0.28em] text-black/45 dark:text-white/40'>
							{formatPostDate(localizedPost.publishedAt, language)}
						</p>
						<h1
							className={classNames(
								merryWeather.className,
								'mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl',
							)}
						>
							{localizedPost.title}
						</h1>
						<p className='mt-6 text-lg leading-8 text-black/60 dark:text-white/55'>
							{localizedPost.excerpt}
						</p>

						{body.length > 0 && (
							<div className='mt-10 space-y-6 border-t border-black/8 pt-10 text-base leading-8 text-black/72 dark:border-white/8 dark:text-white/68 sm:text-lg'>
								{body.map((paragraph) => (
									<p key={paragraph}>{paragraph}</p>
								))}
							</div>
						)}

						{localizedRelated.length > 0 && (
							<div className='mt-16 border-t border-black/8 pt-10 dark:border-white/8'>
								<p className='mb-6 text-xs uppercase tracking-[0.28em] text-black/40 dark:text-white/40'>
									{copy.insights.relatedLabel}
								</p>
								<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
									{localizedRelated.map((related, i) => (
										<PostCard
											key={related.slug}
											post={related}
											index={i}
											locale={language}
											href={`/insights/${related.slug}`}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				</motion.article>
			</div>
		</AnimatePresence>
	);
}
