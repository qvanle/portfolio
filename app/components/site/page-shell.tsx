'use client';

import type { ReactNode } from 'react';
import ParticleNetwork from '../particle-network';
import SplashCursor from '../splash-cursor';
import TopbarNav from './topbar-nav';

interface PageShellProps {
	children: ReactNode;
	splashCursorSize?: 'default' | 'small';
}

export default function PageShell({
	children,
	splashCursorSize = 'default',
}: PageShellProps) {
	const splashProps =
		splashCursorSize === 'small'
			? {
					SPLAT_RADIUS: 0.03,
					SPLAT_FORCE: 3600,
				}
			: { SPLAT_RADIUS: 0.08, SPLAT_FORCE: 3600 };
	const splashPerf = {
		SIM_RESOLUTION: 64,
		DYE_RESOLUTION: 512,
		PRESSURE_ITERATIONS: 10,
	};

	return (
		<main className='relative min-h-svh overflow-hidden'>
			<TopbarNav />
			<SplashCursor
				containerClassName='min-h-svh w-screen'
				usePrimaryColors={true}
				COLOR_UPDATE_SPEED={6}
				{...splashProps}
				{...splashPerf}
			>
				<ParticleNetwork />
				<div className='relative min-h-svh'>{children}</div>
			</SplashCursor>
		</main>
	);
}
