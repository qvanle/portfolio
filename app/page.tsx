import HomePage from './components/home/home-page';
import { getHomePosts } from './data/posts';

export default async function Home() {
	const { featured, latest } = await getHomePosts();

	return <HomePage featured={featured} latest={latest} />;
}
