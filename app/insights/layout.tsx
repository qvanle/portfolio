import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import InsightsLayout from '../components/insights/insights-layout';
import { getInsightsPosts } from '../data/posts';

const insightsDescription =
	'Notes on engineering, automation workflows, and the decisions behind building RotexAI.';

export const metadata: Metadata = {
	title: 'Insights',
	description: insightsDescription,
	alternates: {
		canonical: '/insights',
	},
	openGraph: {
		type: 'website',
		title: 'Insights',
		description: insightsDescription,
		url: '/insights',
	},
};

export default async function Layout({ children }: { children: ReactNode }) {
	const cookieStore = await cookies();
	const language =
		cookieStore.get('site-language')?.value === 'vi' ? 'vi' : 'en';
	const posts = await getInsightsPosts(language);

	return <InsightsLayout posts={posts}>{children}</InsightsLayout>;
}
