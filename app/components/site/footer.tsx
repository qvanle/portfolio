'use client';

import Link from 'next/link';
import { getSiteCopy } from '../../data/site-copy';
import { useLanguage } from '../i18n/language-provider';
import SocialLinks from './social-links';

export default function Footer() {
	const { language } = useLanguage();
	const copy = getSiteCopy(language);

	const navItems = [
		{ label: copy.nav.home, href: '/' },
		{ label: copy.nav.about, href: '/#about' },
		{ label: copy.nav.featured, href: '/#featured' },
		{ label: copy.nav.insight, href: '/insights' },
		{ label: copy.nav.contact, href: '/#contact' },
	];

	return (
		<footer className='border-t border-black/8 dark:border-white/8'>
			<div className='mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-16'>
				<div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-3'>
					<div className='space-y-4'>
						<p className='text-sm font-semibold'>qvanle</p>
						<p className='max-w-xs text-sm leading-relaxed text-black/55 dark:text-white/50'>
							{copy.home.headline.prefix}
							{copy.home.headline.strong}
							{copy.home.headline.middle}
							{copy.home.headline.accent}
							{copy.home.headline.suffix}
						</p>
					</div>

					<nav className='space-y-4'>
						<p className='text-xs uppercase tracking-[0.28em] text-black/40 dark:text-white/40'>
							{copy.nav.home}
						</p>
						<ul className='space-y-2'>
							{navItems.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										className='text-sm text-black/60 transition-colors hover:text-primary-500 dark:text-white/55'
										data-skip-splash-cursor
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className='space-y-4'>
						<p className='text-xs uppercase tracking-[0.28em] text-black/40 dark:text-white/40'>
							{copy.home.contact.directLinks}
						</p>
						<SocialLinks />
					</div>
				</div>

				<div className='mt-12 border-t border-black/6 pt-6 dark:border-white/6'>
					<p className='text-xs text-black/35 dark:text-white/30'>
						&copy; {new Date().getFullYear()} qvanle. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
