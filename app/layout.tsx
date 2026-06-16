import ThemeProvider from 'app/components/providers/ThemeProvider';
import classNames from 'classnames';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { LanguageProvider } from './components/i18n/language-provider';
import TopRightControls from './components/layouts/top-right-controls/top-right-controls';
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

export default async function RootLayout({ children }: RootLayoutProps) {
	const cookieStore = await cookies();
	const language =
		cookieStore.get('site-language')?.value === 'vi' ? 'vi' : 'en';

	return (
		<html
			lang={language}
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
					<LanguageProvider initialLanguage={language}>
						<TopRightControls />
						{children}
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
