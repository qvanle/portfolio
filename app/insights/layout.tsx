import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import InsightsLayout from '../components/insights/insights-layout';
import { getInsightsPosts } from '../data/posts';

export const metadata: Metadata = {
	title: 'Insights',
	description:
		'Notes on engineering, automation workflows, and the decisions behind building RotexAI.',
};

export default async function Layout({ children }: { children: ReactNode }) {
	const posts = await getInsightsPosts();

	return <InsightsLayout posts={posts}>{children}</InsightsLayout>;
}
