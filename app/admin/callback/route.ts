import { type NextRequest, NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const DIRECTUS_URL =
	process.env.DIRECTUS_URL?.replace(/\/$/, '') ?? 'https://cms.rotexai.com';

export async function GET(request: NextRequest) {
	const sessionToken = request.cookies.get('directus_session_token')?.value;

	if (!sessionToken) {
		return NextResponse.redirect(`${APP_URL}/admin/login`);
	}

	try {
		const res = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `directus_session_token=${sessionToken}`,
			},
			body: JSON.stringify({ mode: 'session' }),
		});

		if (!res.ok) {
			return NextResponse.redirect(`${APP_URL}/admin/login`);
		}

		const json = await res.json();
		const { access_token, expires } = json.data;

		const session = JSON.stringify({
			access_token,
			expires_at: Date.now() + expires,
		});

		const response = NextResponse.redirect(`${APP_URL}/admin`);

		response.cookies.set('admin_session', session, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24,
		});

		return response;
	} catch {
		return NextResponse.redirect(`${APP_URL}/admin/login`);
	}
}
