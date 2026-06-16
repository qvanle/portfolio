import type { ReactNode } from 'react';
import SplashCursor from '../splash-cursor';
import TopbarNav from './topbar-nav';

interface PageShellProps {
	children: ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
	return (
		<main className='relative min-h-svh overflow-hidden'>
			<TopbarNav />
			<SplashCursor
				containerClassName='min-h-svh w-screen'
				usePrimaryColors={true}
				SPLAT_RADIUS={0.08}
				SPLAT_FORCE={2400}
				COLOR_UPDATE_SPEED={6}
			>
				<div className='relative min-h-svh'>{children}</div>
			</SplashCursor>
		</main>
	);
}
