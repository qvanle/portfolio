import { type NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '../../lib/auth';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const code = searchParams.get('code');
	const state = searchParams.get('state');
	const error = searchParams.get('error');

	if (error) {
		const description = searchParams.get('error_description') ?? error;
		return NextResponse.redirect(
			`${APP_URL}/admin/login?error=${encodeURIComponent(description)}`,
		);
	}

	if (!code || !state) {
		return NextResponse.redirect(`${APP_URL}/admin/login`);
	}

	const codeVerifier = request.cookies.get('pkce_verifier')?.value;
	const savedState = request.cookies.get('oauth_state')?.value;

	if (!codeVerifier || !savedState || savedState !== state) {
		return NextResponse.redirect(`${APP_URL}/admin/login`);
	}

	try {
		const tokens = await exchangeCodeForTokens(code, codeVerifier);

		const session = JSON.stringify({
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			id_token: tokens.id_token,
			expires_at: Date.now() + tokens.expires_in * 1000,
		});

		const response = NextResponse.redirect(`${APP_URL}/admin`);

		response.cookies.set('admin_session', session, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24,
		});

		response.cookies.delete('pkce_verifier');
		response.cookies.delete('oauth_state');

		return response;
	} catch {
		return NextResponse.redirect(`${APP_URL}/admin/login`);
	}
}
