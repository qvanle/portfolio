'use client';

import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { getSiteCopy } from '../../../data/site-copy';
import { useLanguage } from '../../i18n/language-provider';
import { MoonIcon } from '../icons/moon-icon';
import { SunMediumIcon } from '../icons/sun-icon';

const ThemeSwitch = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme, resolvedTheme } = useTheme();
	const { language } = useLanguage();
	const copy = getSiteCopy(language);
	const transitionRef = useRef<ViewTransition | null>(null);

	useEffect(() => setMounted(true), []);

	const toggleTheme = () => {
		const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

		if (typeof document !== 'undefined' && 'startViewTransition' in document) {
			if (transitionRef.current) {
				setTheme(newTheme);
				return;
			}
			const transition = document.startViewTransition(() => {
				setTheme(newTheme);
			});
			transitionRef.current = transition;
			transition.finished.then(() => {
				transitionRef.current = null;
			});
			return;
		}

		setTheme(newTheme);
	};

	return (
		<motion.button
			aria-label={copy.controls.themeLabel}
			type='button'
			className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-lg shadow-black/5 backdrop-blur-md transition-colors hover:text-primary-500 dark:border-white/10 dark:bg-black/80 dark:text-white dark:shadow-black/30'
			whileTap={{
				scale: 0.7,
				rotate: 360,
				transition: { duration: 0.2 },
			}}
			whileHover={{ scale: 1.2 }}
			onClick={toggleTheme}
			data-skip-splash-cursor
		>
			{mounted && (theme === 'dark' || resolvedTheme === 'dark') ? (
				<SunMediumIcon className='h-9 w-9' />
			) : (
				<MoonIcon className='h-9 w-9' />
			)}
		</motion.button>
	);
};

export default ThemeSwitch;
