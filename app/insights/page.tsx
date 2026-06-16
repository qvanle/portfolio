import type { Metadata } from 'next';
import InsightsPage from '../components/insights/insights-page';

export const metadata: Metadata = {
	title: 'Insights',
	description:
		'Notes on engineering, automation workflows, and the decisions behind building RotexAI.',
};

export default function Page() {
	return <InsightsPage />;
}
