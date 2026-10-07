'use client';

import classNames from 'classnames';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import type { SitePost } from '../../data/posts';
import { getSiteCopy } from '../../data/site-copy';
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
	const gradientIndex = gradientIndexForSlug(post.slug);

	const close = useCallback(() => {
		router.push('/insights');
	}, [router]);

	// Each post is a static page in one language; follow the reader's language
	// to the translated slug, on arrival and whenever they switch.
	const switched = useRef(false);
	useEffect(() => {
		let target = language;
		if (!switched.current) {
			switched.current = true;
			try {
				const stored = window.localStorage.getItem('site-language');
				if (stored === 'en' || stored === 'vi') target = stored;
			} catch {
				// ignore storage failures
			}
		}
		if (target !== post.language && post.alternateSlug) {
			router.replace(`/insights/${post.alternateSlug}`);
		}
	}, [language, post.language, post.alternateSlug, router]);

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

	return (
		<AnimatePresence>
			<div className='fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6'>
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
					className='relative h-[95vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-black/8 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-950'
				>
					<button
						type='button'
						onClick={close}
						aria-label='Close'
						className='absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-black/70 shadow-sm transition-colors hover:bg-white dark:bg-black/70 dark:text-white/70 dark:hover:bg-black'
						data-skip-splash-cursor
					>
						<XIcon className='h-5 w-5' />
					</button>

					{post.image ? (
						<div className='h-52 w-full overflow-hidden rounded-t-2xl bg-white sm:h-72 lg:h-[22rem] dark:bg-white'>
							<img
								src={post.image}
								alt={post.title}
								className='h-full w-full object-contain'
							/>
						</div>
					) : (
						<div
							className={`h-20 w-full rounded-t-2xl bg-gradient-to-br sm:h-28 ${gradients[gradientIndex]}`}
						/>
					)}

					<div className='mx-auto max-w-4xl px-6 py-10 sm:px-10 sm:py-12'>
						{post.body ? (
							<div data-blog-post={post.id}>
								{post.styles && (
									<style dangerouslySetInnerHTML={{ __html: post.styles }} />
								)}
								<div dangerouslySetInnerHTML={{ __html: post.body }} />
							</div>
						) : (
							<>
								<p className='text-sm uppercase tracking-[0.28em] text-black/45 dark:text-white/40'>
									{formatPostDate(post.publishedAt, language)}
								</p>
								<h1
									className={classNames(
										merryWeather.className,
										'mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl',
									)}
								>
									{post.title}
								</h1>
								<p className='mt-6 text-lg leading-8 text-black/60 dark:text-white/55'>
									{post.excerpt}
								</p>
							</>
						)}

						{relatedPosts.length > 0 && (
							<div className='mt-16 border-t border-black/8 pt-10 dark:border-white/8'>
								<p className='mb-6 text-xs uppercase tracking-[0.28em] text-black/40 dark:text-white/40'>
									{copy.insights.relatedLabel}
								</p>
								<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
									{relatedPosts.map((related, i) => (
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
