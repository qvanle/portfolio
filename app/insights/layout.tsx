import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import InsightsLayout from '../components/insights/insights-layout';
import { getInsightsPosts } from '../data/posts';

export const metadata: Metadata = {
	title: 'Insights',
	description:
		'Notes on engineering, automation workflows, and the decisions behind building RotexAI.',
};

export default async function Layout({ children }: { children: ReactNode }) {
	const cookieStore = await cookies();
	const language =
		cookieStore.get('site-language')?.value === 'vi' ? 'vi' : 'en';
	const posts = await getInsightsPosts(language);

	return <InsightsLayout posts={posts}>{children}</InsightsLayout>;
}
