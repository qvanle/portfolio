export const baseUrl = 'https://dalelarroder.com';

export default function sitemap() {
	return [
		{
			url: `${baseUrl}/`,
			lastModified: new Date().toISOString().split('T')[0],
		},
		{
			url: `${baseUrl}/insights`,
			lastModified: new Date().toISOString().split('T')[0],
		},
	];
}
