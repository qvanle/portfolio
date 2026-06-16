'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { getSiteCopy } from '../../data/site-copy';
import { merryWeather } from '../../fonts';
import { useLanguage } from '../i18n/language-provider';
import SocialLinks from '../site/social-links';

export default function Hero() {
	const { language } = useLanguage();
	const copy = getSiteCopy(language);

	return (
		<section
			id='hello'
			className='scroll-mt-24 px-6 pb-20 pt-32 sm:px-8 lg:px-16 lg:pt-36'
		>
			<div className='max-w-4xl space-y-8'>
				<p className='text-xs uppercase tracking-[0.35em] text-black/40 dark:text-white/40'>
					{copy.home.eyebrow}
				</p>
				<h1
					className={classNames(
						merryWeather.className,
						'max-w-3xl text-4xl leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-6xl',
					)}
				>
					{copy.home.headline.prefix}
					<span className='font-bold'>{copy.home.headline.strong}</span>
					{copy.home.headline.middle}
					<span className='italic border-b border-b-primary-500'>
						{copy.home.headline.accent}
					</span>
					{copy.home.headline.suffix}
				</h1>
				<p className='max-w-3xl text-base leading-8 text-black/70 dark:text-white/68 sm:text-lg'>
					{copy.home.intro}
				</p>
				<div className='flex flex-wrap gap-3'>
					<Link
						href='/insights'
						className='inline-flex items-center justify-center rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black'
						data-skip-splash-cursor
					>
						{copy.home.ctas.insight}
					</Link>
					<Link
						href='#about'
						className='inline-flex items-center justify-center rounded-md border border-black/12 px-5 py-2.5 text-sm font-medium text-current transition-colors hover:border-primary-500 hover:text-primary-500 dark:border-white/15'
						data-skip-splash-cursor
					>
						{copy.home.ctas.about}
					</Link>
				</div>
				<SocialLinks className='pt-2' />
			</div>
		</section>
	);
}
