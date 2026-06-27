'use client';

import classNames from 'classnames';
import { motion } from 'motion/react';
import Link from 'next/link';
import { getSiteCopy } from '../../data/site-copy';
import { merryWeather } from '../../fonts';
import { useLanguage } from '../i18n/language-provider';
import SocialLinks from '../site/social-links';

const ease = [0.22, 0.61, 0.36, 1] as const;

const fadeIn = (delay: number) => ({
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { delay, duration: 0.7, ease },
});

export default function Hero() {
	const { language } = useLanguage();
	const copy = getSiteCopy(language);

	return (
		<section
			id='hello'
			className='relative flex min-h-svh scroll-mt-24 items-center justify-center px-6 sm:px-8 lg:px-16'
		>
			<div className='max-w-4xl space-y-8 text-center'>
				<motion.p
					{...fadeIn(0.1)}
					className='text-xs uppercase tracking-[0.35em] text-black/40 dark:text-white/40'
				>
					{copy.home.eyebrow}
				</motion.p>
				<motion.h1
					{...fadeIn(0.2)}
					className={classNames(
						merryWeather.className,
						'mx-auto max-w-3xl text-4xl leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-6xl',
					)}
				>
					{copy.home.headline.prefix}
					<span className='font-bold'>{copy.home.headline.strong}</span>
					{copy.home.headline.middle}
					<span className='italic'>{copy.home.headline.accent}</span>
					{copy.home.headline.suffix}
				</motion.h1>
				<motion.p
					{...fadeIn(0.35)}
					className='mx-auto max-w-3xl text-base leading-8 text-black/70 dark:text-white/68 sm:text-lg'
				>
					{copy.home.intro}
				</motion.p>
				<motion.div
					{...fadeIn(0.45)}
					className='flex flex-wrap justify-center gap-3'
				>
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
				</motion.div>
				<motion.div {...fadeIn(0.55)} className='flex justify-center pt-2'>
					<SocialLinks />
				</motion.div>
			</div>

			<div className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'>
				<svg
					aria-hidden='true'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.5'
					className='h-5 w-5 text-black/30 dark:text-white/30'
				>
					<path d='M6 9l6 6 6-6' />
				</svg>
			</div>
		</section>
	);
}
