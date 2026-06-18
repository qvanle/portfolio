'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { SitePost } from '../../data/posts';
import { getSiteCopy, localizePosts } from '../../data/site-copy';
import Hero from '../hero/hero';
import { useLanguage } from '../i18n/language-provider';
import PageShell from '../site/page-shell';
import PostList from '../site/post-list';
import SectionHeading from '../site/section-heading';
import SocialLinks from '../site/social-links';
import ContactForm from './contact-form';

interface HomePageProps {
	featured: SitePost[];
	latest: SitePost[];
}

export default function HomePage({ featured, latest }: HomePageProps) {
	const { language } = useLanguage();
	const copy = getSiteCopy(language);
	const localizedFeatured = useMemo(
		() => localizePosts(featured, language),
		[featured, language],
	);
	const localizedLatest = useMemo(
		() => localizePosts(latest, language),
		[latest, language],
	);

	return (
		<PageShell>
			<div className='mx-auto max-w-6xl px-6 pb-20 sm:px-8 lg:px-16'>
				<Hero />

				<section id='about' className='scroll-mt-24 px-0 pb-20 pt-4'>
					<div className='max-w-4xl space-y-6'>
						<SectionHeading title={copy.home.about.title} />
						<div className='space-y-5 text-base leading-8 text-black/72 dark:text-white/68 sm:text-lg'>
							{copy.home.about.paragraphs.map((paragraph) => (
								<p key={paragraph}>{paragraph}</p>
							))}
						</div>
					</div>
				</section>

				<section id='featured' className='scroll-mt-24 pb-20 pt-4'>
					<div className='max-w-5xl'>
						<SectionHeading
							title={copy.home.featured.title}
							actionHref='/insights'
							actionLabel={copy.home.featured.more}
						/>
						<PostList posts={localizedFeatured} locale={language} />
					</div>
				</section>

				<section id='latest' className='scroll-mt-24 pb-20 pt-4'>
					<div className='max-w-5xl'>
						<SectionHeading
							title={copy.home.latest.title}
							actionHref='/insights'
							actionLabel={copy.home.latest.more}
						/>
						<PostList posts={localizedLatest} locale={language} />
					</div>
				</section>

				<section id='contact' className='scroll-mt-24 pb-12 pt-4'>
					<SectionHeading title={copy.home.contact.title} />
					<div className='mt-6 grid gap-10 md:grid-cols-2'>
						<div className='space-y-6'>
							<p className='text-base leading-8 text-black/70 dark:text-white/68 sm:text-lg'>
								{copy.home.contact.intro}
							</p>
							<div className='space-y-4'>
								<p className='text-sm uppercase tracking-[0.28em] text-black/40 dark:text-white/40'>
									{copy.home.contact.directLinks}
								</p>
								<SocialLinks />
							</div>
							<p className='text-sm leading-7 text-black/55 dark:text-white/50'>
								{copy.home.contact.emailLabel}:{' '}
								<Link
									href='mailto:qvanle@rotexai.com'
									className='text-current transition-colors hover:text-primary-500'
									data-skip-splash-cursor
								>
									qvanle@rotexai.com
								</Link>
							</p>
						</div>
						<ContactForm />
					</div>
				</section>
			</div>
		</PageShell>
	);
}
