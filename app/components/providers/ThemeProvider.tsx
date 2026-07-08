'use client';

import {
	ThemeProvider as NextThemesProvider,
	type ThemeProviderProps,
} from 'next-themes';

// next-themes renders an inline <script> to set the theme before first paint.
// React 19 flags any <script> rendered from a component, but this one is a
// false positive (see pacocoursey/next-themes#385) — silence it in dev only.
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
	const originalError = console.error;
	console.error = (...args: unknown[]) => {
		if (
			typeof args[0] === 'string' &&
			args[0].includes(
				'Encountered a script tag while rendering React component',
			)
		) {
			return;
		}
		originalError(...args);
	};
}

export default function ThemeProvider({
	children,
	...props
}: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
