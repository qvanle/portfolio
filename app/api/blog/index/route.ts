import { fetchBlogIndex } from '../../../data/posts';

export const runtime = 'nodejs';

export async function GET() {
	try {
		const database = await fetchBlogIndex();
		return new Response(database, {
			headers: {
				'Content-Type': 'application/vnd.sqlite3',
				'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
			},
		});
	} catch (error) {
		console.error('Unable to serve blog index', error);
		return Response.json(
			{ error: 'Blog index is temporarily unavailable.' },
			{ status: 503 },
		);
	}
}
