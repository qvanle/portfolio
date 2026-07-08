import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import HomePage from './components/home/home-page';
import JsonLd from './components/seo/json-ld';
import { getHomePosts } from './data/posts';
import { siteDescription, siteName, siteUrl } from './lib/site-config';

export const metadata: Metadata = {
	alternates: {
		canonical: '/',
	},
};

export default async function Home() {
	const cookieStore = await cookies();
	const language =
		cookieStore.get('site-language')?.value === 'vi' ? 'vi' : 'en';
	const { featured, latest } = await getHomePosts(language);

	return (
		<>
			<JsonLd
				data={{
					'@context': 'https://schema.org',
					'@graph': [
						{
							'@type': 'WebSite',
							name: siteName,
							url: siteUrl,
							description: siteDescription,
						},
						{
							'@type': 'Person',
							name: siteName,
							url: siteUrl,
						},
					],
				}}
			/>
			<HomePage featured={featured} latest={latest} />
		</>
	);
}
