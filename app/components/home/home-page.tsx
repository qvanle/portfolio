'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { SitePost } from '../../data/posts';
import { getSiteCopy, localizePosts } from '../../data/site-copy';
import Hero from '../hero/hero';
import { useLanguage } from '../i18n/language-provider';
import Footer from '../site/footer';
import PageShell from '../site/page-shell';
import PostCard from '../site/post-card';
import SectionHeading from '../site/section-heading';
import SectionReveal from '../site/section-reveal';
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
			<div className='pb-20'>
				<Hero />

				<section id='about' className='scroll-mt-24 py-32'>
					<SectionReveal>
						<div className='mx-auto max-w-3xl space-y-6 px-6 sm:px-8'>
							<SectionHeading title={copy.home.about.title} />
							<div className='space-y-5 text-base leading-8 text-black/72 dark:text-white/68 sm:text-lg'>
								{copy.home.about.paragraphs.map((paragraph) => (
									<p key={paragraph}>{paragraph}</p>
								))}
							</div>
						</div>
					</SectionReveal>
				</section>

				<section
					id='featured'
					className='scroll-mt-24 mx-auto max-w-6xl bg-black/[0.015] px-6 py-28 sm:px-8 lg:px-16 dark:bg-white/[0.02]'
				>
					<SectionReveal>
						<SectionHeading
							title={copy.home.featured.title}
							actionHref='/insights'
							actionLabel={copy.home.featured.more}
						/>
						<div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
							{localizedFeatured.map((post, i) => (
								<PostCard
									key={post.slug}
									post={post}
									index={i}
									locale={language}
								/>
							))}
						</div>
					</SectionReveal>
				</section>

				<section
					id='latest'
					className='scroll-mt-24 mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-16'
				>
					<SectionReveal>
						<SectionHeading
							title={copy.home.latest.title}
							actionHref='/insights'
							actionLabel={copy.home.latest.more}
						/>
						<div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
							{localizedLatest.map((post, i) => (
								<PostCard
									key={post.slug}
									post={post}
									index={i}
									locale={language}
								/>
							))}
						</div>
					</SectionReveal>
				</section>

				<section
					id='contact'
					className='scroll-mt-24 bg-black/[0.015] py-28 dark:bg-white/[0.02]'
				>
					<SectionReveal>
						<div className='mx-auto max-w-4xl px-6 sm:px-8 lg:px-16'>
							<SectionHeading title={copy.home.contact.title} />
							<div className='mt-10 grid gap-12 md:grid-cols-2'>
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
						</div>
					</SectionReveal>
				</section>
			</div>
			<Footer />
		</PageShell>
	);
}
