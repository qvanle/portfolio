import ThemeProvider from 'app/components/providers/ThemeProvider';
import classNames from 'classnames';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { LanguageProvider } from './components/i18n/language-provider';
import TopRightControls from './components/layouts/top-right-controls/top-right-controls';
import { merryWeather, mukta } from './fonts';
import { siteDescription, siteName, siteUrl } from './lib/site-config';
import './tailwind.css';

export const metadata: Metadata = {
	title: {
		template: `%s | ${siteName}`,
		default: siteName,
	},
	description: siteDescription,
	metadataBase: new URL(siteUrl),
	openGraph: {
		type: 'website',
		siteName,
		url: '/',
		locale: 'en_US',
		title: siteName,
		description: siteDescription,
	},
	twitter: {
		card: 'summary_large_image',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	icons: {
		icon: '/static/favicons/favicon.ico',
		shortcut: '/static/favicons/favicon.ico',
		apple: '/static/favicons/favicon.ico',
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#000000' },
	],
};

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
			className={classNames(
				mukta.className,
				merryWeather.variable,
				'scroll-smooth',
			)}
		>
			<head>
				{/* Elements faded in by JS ship hidden; without JS they must still show. */}
				<noscript>
					<style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
				</noscript>
			</head>
			<body className='bg-white text-black antialiased selection:bg-primary-500 selection:text-white dark:bg-black dark:text-white'>
				<ThemeProvider
					attribute='class'
					defaultTheme='light'
					themes={['dark', 'light']}
				>
					<LanguageProvider initialLanguage='en'>
						<TopRightControls />
						{children}
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
