export const siteUrl =
	process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
	'https://qvanle.rotexai.com';

// Covers that are figures or diagrams rather than photos: cropping to the card's
// 2:1 frame clips their labels, so show them whole on white. Keyed by post id.
// A dedicated cover image in the blog content would make this unnecessary.
export const coverFit: Record<string, 'contain'> = {
	'019f40b4-163f-79a3-90be-47066b0dbf40': 'contain', // PhysMirror
};

export const siteName = 'qvanle';

export const siteDescription =
	'A minimalist knowledge-sharing hub for engineering notes, automation workflows, and open-source tools.';
