import type { Metadata } from 'next';
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
	const [en, vi] = await Promise.all([getHomePosts('en'), getHomePosts('vi')]);

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
			<HomePage posts={{ en, vi }} />
		</>
	);
}
