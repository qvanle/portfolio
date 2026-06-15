'use client';

import classNames from 'classnames';
import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface SunMediumIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface SunMediumIconProps {
	size?: number;
	className?: string;
}

const pathVariants: Variants = {
	normal: { opacity: 1 },
	animate: (i: number) => ({
		opacity: [0, 1],
		transition: { delay: i * 0.1, duration: 0.3 },
	}),
};

const SunMediumIcon = forwardRef<SunMediumIconHandle, SunMediumIconProps>(
	({ className, size = 28 }, ref) => {
		const controls = useAnimation();
		const isControlledRef = useRef(false);

		useImperativeHandle(ref, () => {
			isControlledRef.current = true;

			return {
				startAnimation: () => controls.start('animate'),
				stopAnimation: () => controls.start('normal'),
			};
		});

		return (
			<div
				className={classNames(
					'flex items-center justify-center rounded-md p-2 transition-colors duration-200 hover:bg-accent',
					className,
				)}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width={size}
					height={size}
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					role='img'
					aria-label='sun icon'
				>
					<circle cx='12' cy='12' r='4' />
					{[
						'M12 3v1',
						'M12 20v1',
						'M3 12h1',
						'M20 12h1',
						'm18.364 5.636-.707.707',
						'm6.343 17.657-.707.707',
						'm5.636 5.636.707.707',
						'm17.657 17.657.707.707',
					].map((d, index) => (
						<motion.path
							key={d}
							d={d}
							animate={controls}
							variants={pathVariants}
							custom={index + 1}
						/>
					))}
				</svg>
			</div>
		);
	},
);

SunMediumIcon.displayName = 'SunMediumIcon';

export { SunMediumIcon };
