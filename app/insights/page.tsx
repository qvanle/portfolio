import type { Metadata } from 'next';
import InsightsPage from '../components/insights/insights-page';
import { getInsightsPosts } from '../data/posts';

export const metadata: Metadata = {
	title: 'Insights',
	description:
		'Notes on engineering, automation workflows, and the decisions behind building RotexAI.',
};

export default async function Page() {
	const posts = await getInsightsPosts();

	return <InsightsPage posts={posts} />;
}
