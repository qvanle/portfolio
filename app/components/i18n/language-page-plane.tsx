'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { PlaneOutlineIcon } from '../layouts/icons/plane-outline-icon';
import { useLanguage } from './language-provider';

export default function LanguagePagePlane() {
	const { languageTransitionId } = useLanguage();
	const [activeTransitionId, setActiveTransitionId] = useState(0);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (languageTransitionId === 0) {
			return;
		}

		setActiveTransitionId(languageTransitionId);
		setIsVisible(true);
	}, [languageTransitionId]);

	return (
		<AnimatePresence mode='wait'>
			{isVisible && activeTransitionId > 0 ? (
				<motion.div
					key={activeTransitionId}
					className='pointer-events-none fixed inset-0 z-40 overflow-hidden'
					initial='initial'
					animate='animate'
					exit='exit'
				>
					<motion.div
						className='absolute right-4 top-4 text-primary-500/90 dark:text-primary-400/90'
						variants={{
							initial: {
								opacity: 0,
								x: 0,
								y: 0,
								scale: 0.75,
								rotate: -8,
							},
							animate: {
								opacity: [0, 1, 1, 0],
								x: ['0vw', '-28vw', '-58vw', '-86vw'],
								y: ['0vh', '22vh', '48vh', '82vh'],
								scale: [0.75, 1, 1, 0.9],
								rotate: [0, 10, 22, 30],
								transition: {
									duration: 1.15,
									ease: 'easeInOut',
								},
							},
							exit: {
								opacity: 0,
								transition: { duration: 0.12 },
							},
						}}
						onAnimationComplete={() => setIsVisible(false)}
					>
						<PlaneOutlineIcon className='h-5 w-5' />
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
