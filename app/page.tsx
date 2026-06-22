import { cookies } from 'next/headers';
import HomePage from './components/home/home-page';
import { getHomePosts } from './data/posts';

export default async function Home() {
	const cookieStore = await cookies();
	const language =
		cookieStore.get('site-language')?.value === 'vi' ? 'vi' : 'en';
	const { featured, latest } = await getHomePosts(language);

	return <HomePage featured={featured} latest={latest} />;
}
