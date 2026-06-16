import ThemeProvider from 'app/components/providers/ThemeProvider';
import classNames from 'classnames';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ThemeSwitch from './components/layouts/theme-switch/theme-switch';
import { mukta } from './fonts';
import './tailwind.css';

export const metadata: Metadata = {
	title: {
		template: '%s | qvanle',
		default: 'qvanle',
	},
	description:
		'A minimalist knowledge-sharing hub for engineering notes, automation workflows, and open-source tools.',
	metadataBase: new URL('https://dalelarroder.com'),
};

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
			className={classNames(mukta.className, 'scroll-smooth')}
		>
			<head>
				<link
					rel='apple-touch-icon'
					sizes='76x76'
					href='/static/favicons/favicon.ico'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='/static/favicons/favicon.ico'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='/static/favicons/favicon.ico'
				/>
				<meta name='msapplication-TileColor' content='#000000' />
				<meta name='theme-color' content='#000000' />
			</head>
			<body className='bg-white text-black antialiased selection:bg-primary-500 selection:text-white dark:bg-black dark:text-white'>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					themes={['dark', 'light']}
				>
					<ThemeSwitch />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
