'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { XIcon } from '../layouts/icons/x-icon';

interface NavigationItem {
	label: string;
	href: string;
}

const navigationItems: NavigationItem[] = [
	{ label: 'Home', href: '/' },
	{ label: 'About Me', href: '/#about' },
	{ label: 'Featured', href: '/#featured' },
	{ label: 'Latest', href: '/#latest' },
	{ label: 'Get in Touch', href: '/#contact' },
	{ label: 'Insight', href: '/insights' },
];

function MenuIcon() {
	return (
		<svg
			aria-hidden='true'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='1.8'
			className='h-5 w-5'
		>
			<path d='M4 6h16' />
			<path d='M4 12h16' />
			<path d='M4 18h16' />
		</svg>
	);
}

function NavItem({
	item,
	active,
	onClick,
	navigate,
}: {
	item: NavigationItem;
	active?: boolean;
	onClick?: () => void;
	navigate: (href: string) => void;
}) {
	const isRouteLink = item.href === '/' || item.href === '/insights';

	return (
		<Link
			href={item.href}
			onClick={(event) => {
				if (onClick) {
					onClick();
				}

				if (!isRouteLink) {
					return;
				}

				event.preventDefault();
				navigate(item.href);
			}}
			aria-current={active ? 'page' : undefined}
			data-skip-splash-cursor
			className={classNames(
				'rounded-full px-4 py-2 text-sm leading-none transition-colors',
				active
					? 'bg-black text-white dark:bg-white dark:text-black'
					: 'text-black/65 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white',
			)}
		>
			{item.label}
		</Link>
	);
}

export default function TopbarNav() {
	const pathname = usePathname();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [activeHref, setActiveHref] = useState('/');

	const isInsightsRoute = useMemo(
		() => pathname.startsWith('/insights'),
		[pathname],
	);

	useEffect(() => {
		if (isInsightsRoute) {
			setActiveHref('/insights');
			return;
		}

		const sections = [
			{ href: '/', id: 'hello' },
			{ href: '/#about', id: 'about' },
			{ href: '/#featured', id: 'featured' },
			{ href: '/#latest', id: 'latest' },
			{ href: '/#contact', id: 'contact' },
		];

		const updateActiveSection = () => {
			const threshold = Math.max(120, window.innerHeight * 0.28);
			let nextHref = '/';

			for (const section of sections) {
				const element = document.getElementById(section.id);
				if (!element) {
					continue;
				}

				const rect = element.getBoundingClientRect();
				if (rect.top <= threshold) {
					nextHref = section.href;
				}
			}

			setActiveHref(nextHref);
		};

		updateActiveSection();
		window.addEventListener('scroll', updateActiveSection, { passive: true });
		window.addEventListener('resize', updateActiveSection);

		return () => {
			window.removeEventListener('scroll', updateActiveSection);
			window.removeEventListener('resize', updateActiveSection);
		};
	}, [isInsightsRoute]);

	const navigate = (href: string) => {
		if (href === pathname) {
			if (href === '/' && window.scrollY > 0) {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
			return;
		}

		const direction = href === '/' ? 'backward' : 'forward';
		const root = document.documentElement;

		if (
			typeof document === 'undefined' ||
			!('startViewTransition' in document)
		) {
			router.push(href);
			return;
		}

		root.dataset.pageTransition = direction;
		const transition = document.startViewTransition(() => {
			router.push(href);
		});

		void transition.finished.finally(() => {
			delete root.dataset.pageTransition;
		});
	};

	return (
		<>
			<div className='fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 lg:block'>
				<nav className='flex items-center gap-1 rounded-full border border-black/10 bg-white/90 px-2 py-2 shadow-lg shadow-black/5 backdrop-blur-md dark:border-white/10 dark:bg-black/80 dark:shadow-black/30'>
					{navigationItems.map((item) => (
						<NavItem
							key={item.label}
							item={item}
							active={activeHref === item.href}
							navigate={navigate}
						/>
					))}
				</nav>
			</div>

			<div className='fixed inset-x-4 top-4 z-50 flex items-center justify-between gap-3 lg:hidden'>
				<button
					type='button'
					aria-label='Open navigation'
					aria-expanded={isOpen}
					onClick={() => setIsOpen((value) => !value)}
					className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-lg shadow-black/5 backdrop-blur-md transition-colors hover:text-primary-500 dark:border-white/10 dark:bg-black/80 dark:text-white dark:shadow-black/30'
					data-skip-splash-cursor
				>
					{isOpen ? <XIcon className='h-5 w-5' /> : <MenuIcon />}
				</button>
			</div>

			{isOpen ? (
				<div className='fixed inset-0 z-40 bg-black/60 p-4 backdrop-blur-sm lg:hidden'>
					<div className='mx-auto mt-16 max-w-md rounded-[2rem] border border-white/10 bg-black px-5 py-6 text-white shadow-2xl shadow-black/35'>
						<nav className='flex flex-col gap-2'>
							{navigationItems.map((item) => (
								<NavItem
									key={item.label}
									item={item}
									active={activeHref === item.href}
									onClick={() => setIsOpen(false)}
									navigate={navigate}
								/>
							))}
						</nav>
					</div>
				</div>
			) : null}
		</>
	);
}
