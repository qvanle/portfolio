'use client';

import classNames from 'classnames';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './language-provider';

function UnitedStatesFlagOutlineIcon() {
	return (
		<svg
			aria-hidden='true'
			viewBox='0 0 24 24'
			className='h-9 w-9'
			fill='none'
			stroke='currentColor'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<circle cx='12' cy='12' r='10' strokeWidth='1.5' />
			<line x1='2' y1='9' x2='22' y2='9' strokeWidth='1.2' />
			<line x1='2' y1='15' x2='22' y2='15' strokeWidth='1.2' />
			<rect x='4' y='4.5' width='7' height='4.5' rx='0.5' strokeWidth='1.1' />
			<path
				d='M7.5 5.5l.35 1.05h1.1l-.9.65.35 1.05-.9-.65-.9.65.35-1.05-.9-.65h1.1z'
				strokeWidth='0.8'
			/>
		</svg>
	);
}

function VietnamFlagOutlineIcon() {
	return (
		<svg
			aria-hidden='true'
			viewBox='0 0 24 24'
			className='h-9 w-9'
			fill='none'
			stroke='currentColor'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<circle cx='12' cy='12' r='10' strokeWidth='1.5' />
			<path
				d='M12 6.5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L12 15.5l-3.52 1.85.67-3.93-2.85-2.78 3.94-.57L12 6.5z'
				strokeWidth='1.2'
			/>
		</svg>
	);
}

export default function LanguageSwitch() {
	const { language, toggleLanguage } = useLanguage();
	const [mounted, setMounted] = useState(false);
	const transitionRef = useRef<ViewTransition | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleToggle = () => {
		if (typeof document !== 'undefined' && 'startViewTransition' in document) {
			if (transitionRef.current) {
				toggleLanguage();
				return;
			}
			const transition = document.startViewTransition(() => {
				toggleLanguage();
			});
			transitionRef.current = transition;
			transition.finished.then(() => {
				transitionRef.current = null;
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
			{mounted ? (
				language === 'en' ? (
					<UnitedStatesFlagOutlineIcon />
				) : (
					<VietnamFlagOutlineIcon />
				)
			) : (
				<div className='h-9 w-9 rounded-full border border-transparent' />
			)}
		</motion.button>
	);
}
