import JsonLd from '../components/seo/json-ld';
import { siteName, siteUrl } from '../lib/site-config';

export default function Page() {
	return (
		<JsonLd
			data={{
				'@context': 'https://schema.org',
				'@type': 'Blog',
				name: `Insights | ${siteName}`,
				url: `${siteUrl}/insights`,
				description:
					'Notes on engineering, automation workflows, and the decisions behind building RotexAI.',
			}}
		/>
	);
}
