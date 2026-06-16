import { getInsightsPosts } from '../../data/posts';
import PageShell from '../site/page-shell';
import PostList from '../site/post-list';
import SectionHeading from '../site/section-heading';

export default async function InsightsPage() {
	const posts = await getInsightsPosts();

	return (
		<PageShell>
			<div className='mx-auto max-w-6xl px-6 pb-20 pt-28 sm:px-8 lg:px-16'>
				<section className='max-w-5xl space-y-6'>
					<p className='text-xs uppercase tracking-[0.35em] text-black/40 dark:text-white/40'>
						Insight
					</p>
					<SectionHeading title='Writing' />
					<p className='max-w-2xl text-base leading-8 text-black/70 dark:text-white/68 sm:text-lg'>
						Notes on engineering, automation workflows, and the decisions behind
						building RotexAI.
					</p>
					<PostList posts={posts} />
				</section>
			</div>
		</PageShell>
	);
}
