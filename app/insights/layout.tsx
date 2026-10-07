import type { Metadata } from 'next';
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
	const [en, vi] = await Promise.all([
		getInsightsPosts('en'),
		getInsightsPosts('vi'),
	]);

	return <InsightsLayout posts={{ en, vi }}>{children}</InsightsLayout>;
}
