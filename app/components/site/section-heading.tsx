'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { merryWeather } from '../../fonts';

interface SectionHeadingProps {
	title: string;
	actionHref?: string;
	actionLabel?: string;
	className?: string;
}

export default function SectionHeading({
	title,
	actionHref,
	actionLabel = 'More',
	className,
}: SectionHeadingProps) {
	return (
		<div
			className={classNames(
				'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
				className,
			)}
		>
			<h2
				className={classNames(merryWeather.className, 'text-3xl leading-none')}
			>
				{title}
			</h2>
			{actionHref ? (
				<Link
					href={actionHref}
					className='inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-current transition-colors hover:bg-black/5 hover:text-primary-500 dark:hover:bg-white/10'
					data-skip-splash-cursor
				>
					{actionLabel}
				</Link>
			) : null}
		</div>
	);
}
