'use client';

import classNames from 'classnames';

interface PlaneOutlineIconProps {
	className?: string;
}

export function PlaneOutlineIcon({ className }: PlaneOutlineIconProps) {
	return (
		<svg
			aria-hidden='true'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.8'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={classNames('h-4 w-4', className)}
		>
			<path d='M21 3 3 10l8 2 2 8 8-17Z' />
			<path d='m11 12 4-4' />
		</svg>
	);
}
