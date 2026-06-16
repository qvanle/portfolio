'use client';

import { useMemo } from 'react';
import type { SitePost } from '../../data/posts';
import { getSiteCopy, localizePosts } from '../../data/site-copy';
import { useLanguage } from '../i18n/language-provider';
import PageShell from '../site/page-shell';
import PostList from '../site/post-list';
import SectionHeading from '../site/section-heading';

interface InsightsPageProps {
	posts: SitePost[];
}

export default function InsightsPage({ posts }: InsightsPageProps) {
	const { language } = useLanguage();
	const copy = getSiteCopy(language);
	const localizedPosts = useMemo(
		() => localizePosts(posts, language),
		[language, posts],
	);

	return (
		<PageShell>
			<div className='mx-auto max-w-6xl px-6 pb-20 pt-28 sm:px-8 lg:px-16'>
				<section className='max-w-5xl space-y-6'>
					<p className='text-xs uppercase tracking-[0.35em] text-black/40 dark:text-white/40'>
						{copy.insights.eyebrow}
					</p>
					<SectionHeading title={copy.insights.title} />
					<p className='max-w-2xl text-base leading-8 text-black/70 dark:text-white/68 sm:text-lg'>
						{copy.insights.intro}
					</p>
					<PostList posts={localizedPosts} locale={language} />
				</section>
			</div>
		</PageShell>
	);
}
