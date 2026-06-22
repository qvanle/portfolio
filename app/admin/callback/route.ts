import { type NextRequest, NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const accessToken = searchParams.get('access_token');
	const refreshToken = searchParams.get('refresh_token');
	const expires = searchParams.get('expires');

	if (!accessToken || !refreshToken) {
		return NextResponse.redirect(`${APP_URL}/admin/login`);
	}

	const expiresMs = expires ? Number(expires) : 900_000;
	const session = JSON.stringify({
		access_token: accessToken,
		refresh_token: refreshToken,
		expires_at: Date.now() + expiresMs,
	});

	const response = NextResponse.redirect(`${APP_URL}/admin`);

	response.cookies.set('admin_session', session, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24,
	});

	return response;
}
