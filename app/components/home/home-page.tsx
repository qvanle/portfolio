import Link from 'next/link';
import { getHomePosts } from '../../data/posts';
import Hero from '../hero/hero';
import PageShell from '../site/page-shell';
import PostList from '../site/post-list';
import SectionHeading from '../site/section-heading';
import SocialLinks from '../site/social-links';

export default async function HomePage() {
	const { featured, latest } = await getHomePosts();

	return (
		<PageShell>
			<div className='mx-auto max-w-6xl px-6 pb-20 sm:px-8 lg:px-16'>
				<Hero />

				<section id='about' className='scroll-mt-24 px-0 pb-20 pt-4'>
					<div className='max-w-4xl space-y-6'>
						<SectionHeading title='About Me' />
						<div className='space-y-5 text-base leading-8 text-black/72 dark:text-white/68 sm:text-lg'>
							<p>
								I&apos;m qvanle — founder of RotexAI, an AI workflow automation
								platform aimed at optimizing costs for repetitive tasks. Having
								learned so much from the tech community over the years, I built
								this space not just as a portfolio, but to give back and share
								my knowledge.
							</p>
							<p>
								I believe everything must revolve around people; tools are
								meaningless if their goal is not to serve humanity. My rule is
								simple: before anyone else can use my products, I must be my own
								first user. This site documents that process through notes on
								engineering, automation workflows, and the lessons that come
								with building tools for real use.
							</p>
						</div>
					</div>
				</section>

				<section id='featured' className='scroll-mt-24 pb-20 pt-4'>
					<div className='max-w-5xl'>
						<SectionHeading title='Featured' actionHref='/insights' />
						<PostList posts={featured} />
					</div>
				</section>

				<section id='latest' className='scroll-mt-24 pb-20 pt-4'>
					<div className='max-w-5xl'>
						<SectionHeading title='Latest' actionHref='/insights' />
						<PostList posts={latest} />
					</div>
				</section>

				<section id='contact' className='scroll-mt-24 pb-12 pt-4'>
					<div className='max-w-4xl space-y-6'>
						<SectionHeading title='Get in Touch' />
						<p className='max-w-2xl text-base leading-8 text-black/70 dark:text-white/68 sm:text-lg'>
							If something here helped you, send a note. I&apos;m always open to
							engineering discussions, automation ideas, and thoughtful
							feedback.
						</p>
						<div className='space-y-4'>
							<p className='text-sm uppercase tracking-[0.28em] text-black/40 dark:text-white/40'>
								Direct links
							</p>
							<SocialLinks />
						</div>
						<p className='text-sm leading-7 text-black/55 dark:text-white/50'>
							Email:{' '}
							<Link
								href='mailto:qvanle@rotexai.com'
								className='text-current transition-colors hover:text-primary-500'
								data-skip-splash-cursor
							>
								qvanle@rotexai.com
							</Link>
						</p>
					</div>
				</section>
			</div>
		</PageShell>
	);
}
