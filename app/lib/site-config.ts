export const siteUrl =
	process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
	'https://qvanle.rotexai.com';

export const siteName = 'qvanle';

export const siteDescription =
	'A minimalist knowledge-sharing hub for engineering notes, automation workflows, and open-source tools.';
