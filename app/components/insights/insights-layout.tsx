'use client';

import classNames from 'classnames';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { SitePost } from '../../data/posts';
import { getSiteCopy, type Language } from '../../data/site-copy';
import { merryWeather } from '../../fonts';
import { searchBlogPostIds } from '../../lib/blog-search';
import { useLanguage } from '../i18n/language-provider';
import Footer from '../site/footer';
import PageShell from '../site/page-shell';
import PostCard from '../site/post-card';
import SectionReveal from '../site/section-reveal';

interface InsightsLayoutProps {
	posts: Record<Language, SitePost[]>;
	children: ReactNode;
}

const ease = [0.22, 0.61, 0.36, 1] as const;

const fadeIn = (delay: number) => ({
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { delay, duration: 0.7, ease },
});

export default function InsightsLayout({
	posts: postsByLanguage,
	children,
}: InsightsLayoutProps) {
	const { language } = useLanguage();
	const posts = postsByLanguage[language];
	const copy = getSiteCopy(language);

	const [searchQuery, setSearchQuery] = useState('');
	const [activeCategory, setActiveCategory] = useState('all');
	const [searchIds, setSearchIds] = useState<string[] | null>(null);
	const categoryKeys = useMemo(
		() => [
			'all',
			...Array.from(
				new Set(
					posts
						.map((post) => post.category)
						.filter((category): category is string => Boolean(category)),
				),
			).sort(),
		],
		[posts],
	);

	useEffect(() => {
		const query = searchQuery.trim();
		if (!query) {
			setSearchIds(null);
			return;
		}

		let cancelled = false;
		const timer = window.setTimeout(() => {
			searchBlogPostIds(query, language)
				.then((ids) => {
					if (!cancelled) setSearchIds(ids);
				})
				.catch(() => {
					if (cancelled) return;
					const normalized = query.toLowerCase();
					setSearchIds(
						posts
							.filter(
								(post) =>
									post.title.toLowerCase().includes(normalized) ||
									post.excerpt.toLowerCase().includes(normalized),
							)
							.map((post) => post.id),
					);
				});
		}, 180);
		return () => {
			cancelled = true;
			window.clearTimeout(timer);
		};
	}, [language, posts, searchQuery]);

	const filteredPosts = useMemo(() => {
		return posts.filter((post) => {
			if (activeCategory !== 'all' && post.category !== activeCategory) {
				return false;
			}
			return searchIds === null || searchIds.includes(post.id);
		});
	}, [posts, searchIds, activeCategory]);

	return (
		<PageShell>
			<header className='mx-auto max-w-3xl px-6 pt-32 pb-16 text-center sm:px-8'>
				<motion.p
					{...fadeIn(0.1)}
					className='text-xs uppercase tracking-[0.35em] text-black/40 dark:text-white/40'
				>
					{copy.insights.eyebrow}
				</motion.p>
				<motion.h1
					{...fadeIn(0.2)}
					className={classNames(
						merryWeather.className,
						'mt-6 text-4xl leading-none sm:text-5xl',
					)}
				>
					{copy.insights.title}
				</motion.h1>
				<motion.p
					{...fadeIn(0.35)}
					className='mx-auto mt-6 max-w-2xl text-base leading-8 text-black/70 dark:text-white/68 sm:text-lg'
				>
					{copy.insights.intro}
				</motion.p>
			</header>

			<div className='mx-auto max-w-6xl px-6 pb-10 sm:px-8 lg:px-16'>
				<motion.div {...fadeIn(0.45)} className='space-y-5'>
					<div className='relative'>
						<svg
							aria-hidden='true'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							className='absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-black/35 dark:text-white/35'
						>
							<circle cx='11' cy='11' r='8' />
							<path d='m21 21-4.3-4.3' />
						</svg>
						<input
							type='text'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder={copy.insights.searchPlaceholder}
							className='w-full rounded-xl border border-black/12 bg-white/50 py-3 pr-4 pl-11 text-sm text-black placeholder:text-black/40 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-white/12 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35'
							data-skip-splash-cursor
						/>
					</div>

					<div className='flex flex-wrap gap-2'>
						{categoryKeys.map((key) => (
							<button
								key={key}
								type='button'
								onClick={() => setActiveCategory(key)}
								className={classNames(
									'rounded-full px-4 py-2 text-sm leading-none transition-colors',
									activeCategory === key
										? 'bg-black text-white dark:bg-white dark:text-black'
										: 'text-black/65 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white',
								)}
								data-skip-splash-cursor
							>
								{copy.insights.categories[key] ?? key}
							</button>
						))}
					</div>
				</motion.div>
			</div>

			<section className='bg-black/[0.015] py-28 dark:bg-white/[0.02]'>
				<SectionReveal>
					<div className='mx-auto max-w-6xl px-6 sm:px-8 lg:px-16'>
						{filteredPosts.length > 0 ? (
							<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
								{filteredPosts.map((post, i) => (
									<PostCard
										key={post.slug}
										post={post}
										index={i}
										locale={language}
										href={`/insights/${post.slug}`}
									/>
								))}
							</div>
						) : (
							<p className='py-12 text-center text-base text-black/50 dark:text-white/45'>
								{copy.insights.noResults}
							</p>
						)}
					</div>
				</SectionReveal>
			</section>

			<Footer />
			{children}
		</PageShell>
	);
}
