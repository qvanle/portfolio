'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface SectionRevealProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

export default function SectionReveal({
	children,
	className,
	delay = 0,
}: SectionRevealProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 32 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-80px' }}
			transition={{
				duration: 0.7,
				ease: [0.22, 0.61, 0.36, 1] as const,
				delay,
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}
