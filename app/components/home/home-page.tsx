'use client';

import Image from 'next/image';
import Link from 'next/link';
import portraitImage from '../../assets/portrait.jpg';
import type { SitePost } from '../../data/posts';
import { getSiteCopy } from '../../data/site-copy';
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

	return (
		<PageShell splashCursorSize='small'>
			<div className='pb-20'>
				<Hero />

				<section id='about' className='scroll-mt-24 py-32'>
					<SectionReveal>
						<div className='mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16 lg:px-16'>
							<div className='relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-black/10 bg-black/[0.02] shadow-sm dark:border-white/10 dark:bg-white/[0.03] lg:mx-0'>
								<Image
									src={portraitImage}
									alt='Portrait of qvanle'
									sizes='(min-width: 1024px) 360px, (min-width: 640px) 384px, 90vw'
									className='aspect-[4/5] h-auto w-full object-cover object-center'
									placeholder='blur'
								/>
							</div>

							<div className='space-y-6'>
								<SectionHeading title={copy.home.about.title} />
								<div className='space-y-5 text-base leading-8 text-black/72 dark:text-white/68 sm:text-lg'>
									{copy.home.about.paragraphs.map((paragraph) => (
										<p key={paragraph}>{paragraph}</p>
									))}
								</div>
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
							{featured.map((post, i) => (
								<PostCard
									key={post.slug}
									post={post}
									index={i}
									locale={language}
									href={`/insights/${post.slug}`}
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
							{latest.map((post, i) => (
								<PostCard
									key={post.slug}
									post={post}
									index={i}
									locale={language}
									href={`/insights/${post.slug}`}
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
