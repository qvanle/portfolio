'use client';

import classNames from 'classnames';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { PlaneOutlineIcon } from '../layouts/icons/plane-outline-icon';
import { useLanguage } from './language-provider';

function UnitedStatesFlagOutlineIcon() {
	return (
		<svg aria-hidden='true' viewBox='0 0 24 24' className='h-9 w-9 fill-none'>
			<path
				d='M5 20V4.75C5 4.34 5.34 4 5.75 4h11.4c.41 0 .85.18 1.15.5l.7.74c.28.3.73.47 1.12.42l.15-.02a.75.75 0 0 1 .83.75v10.86a.75.75 0 0 1-.83.75l-.15-.02c-.39-.05-.84.12-1.12.42l-.7.74c-.3.32-.74.5-1.15.5H5.75A.75.75 0 0 1 5 20Z'
				className='stroke-current'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M8 4v16M5 8h6M5 12h9M5 16h6'
				className='stroke-current'
				strokeWidth='1.2'
				strokeLinecap='round'
			/>
			<path
				d='M13.75 7.3 14.1 8.2l.95.07-.73.59.24.92-.81-.49-.81.49.24-.92-.73-.59.95-.07Z'
				className='stroke-current'
				strokeWidth='1'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

function VietnamFlagOutlineIcon() {
	return (
		<svg aria-hidden='true' viewBox='0 0 24 24' className='h-9 w-9 fill-none'>
			<path
				d='M5 20V4.75C5 4.34 5.34 4 5.75 4h11.4c.41 0 .85.18 1.15.5l.7.74c.28.3.73.47 1.12.42l.15-.02a.75.75 0 0 1 .83.75v10.86a.75.75 0 0 1-.83.75l-.15-.02c-.39-.05-.84.12-1.12.42l-.7.74c-.3.32-.74.5-1.15.5H5.75A.75.75 0 0 1 5 20Z'
				className='stroke-current'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M12 7.6 13.07 10h2.53l-2.05 1.48.78 2.52L12 12.47l-2.33 1.53.78-2.52L8.4 10h2.53L12 7.6Z'
				className='stroke-current'
				strokeWidth='1.1'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

export default function LanguageSwitch() {
	const { language, signalLanguageTransition, toggleLanguage } = useLanguage();
	const [burstId, setBurstId] = useState(0);
	const [showBurst, setShowBurst] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!showBurst) {
			return;
		}

		const timer = window.setTimeout(() => {
			setShowBurst(false);
		}, 720);

		return () => window.clearTimeout(timer);
	}, [showBurst]);

	const planeTrails = useMemo(
		() => [
			{ x: 16, y: -8, rotate: -12, delay: 0 },
			{ x: 24, y: -16, rotate: 6, delay: 0.05 },
			{ x: 32, y: -4, rotate: 18, delay: 0.1 },
			{ x: 40, y: -20, rotate: 28, delay: 0.15 },
		],
		[],
	);

	const handleToggle = () => {
		setBurstId((value) => value + 1);
		setShowBurst(true);
		signalLanguageTransition();

		if (typeof document !== 'undefined' && 'startViewTransition' in document) {
			document.startViewTransition(() => {
				toggleLanguage();
			});
			return;
		}

		toggleLanguage();
	};

	return (
		<motion.button
			type='button'
			aria-label={
				language === 'en'
					? 'Switch language to Vietnamese'
					: 'Đổi ngôn ngữ sang tiếng Anh'
			}
			className={classNames(
				'inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-lg shadow-black/5 backdrop-blur-md transition-colors hover:text-primary-500 dark:border-white/10 dark:bg-black/80 dark:text-white dark:shadow-black/30',
			)}
			whileTap={{
				scale: 0.7,
				rotate: 360,
				transition: { duration: 0.2 },
			}}
			whileHover={{ scale: 1.2 }}
			onClick={handleToggle}
			data-skip-splash-cursor
		>
			<div className='relative flex h-9 w-9 items-center justify-center overflow-visible'>
				{mounted ? (
					language === 'en' ? (
						<UnitedStatesFlagOutlineIcon />
					) : (
						<VietnamFlagOutlineIcon />
					)
				) : (
					<div className='h-9 w-9 rounded-full border border-transparent' />
				)}
				<AnimatePresence mode='wait'>
					{showBurst ? (
						<motion.div
							key={burstId}
							className='pointer-events-none absolute inset-0 overflow-visible'
							initial='initial'
							animate='animate'
							exit='exit'
						>
							{planeTrails.map((trail) => (
								<motion.div
									key={`${burstId}-${trail.x}-${trail.y}-${trail.rotate}`}
									className='absolute left-1/2 top-1/2 text-primary-500/95 dark:text-primary-400/95'
									variants={{
										initial: {
											opacity: 0,
											x: 0,
											y: 0,
											scale: 0.6,
											rotate: 0,
										},
										animate: {
											opacity: [0, 1, 0],
											x: [0, trail.x * 0.45, trail.x],
											y: [0, trail.y * 0.45, trail.y],
											scale: [0.6, 1, 0.9],
											rotate: [0, trail.rotate * 0.5, trail.rotate],
											transition: {
												duration: 0.72,
												delay: trail.delay,
												ease: 'easeOut',
											},
										},
										exit: {
											opacity: 0,
											transition: { duration: 0.12 },
										},
									}}
									style={{
										transform: 'translate(-50%, -50%)',
									}}
								>
									<PlaneOutlineIcon className='h-4 w-4' />
								</motion.div>
							))}
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>
		</motion.button>
	);
}
