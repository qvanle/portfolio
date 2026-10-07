import type { MetadataRoute } from 'next';
import { siteDescription, siteName } from './lib/site-config';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteName,
		short_name: siteName,
		description: siteDescription,
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#ffffff',
		icons: [
			{
				src: '/static/favicons/favicon.ico',
				sizes: '48x48',
				type: 'image/x-icon',
			},
		],
	};
}
