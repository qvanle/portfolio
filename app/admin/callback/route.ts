import { type NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '../../lib/auth';

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const code = searchParams.get('code');
	const state = searchParams.get('state');
	const error = searchParams.get('error');

	if (error) {
		const description = searchParams.get('error_description') ?? error;
		return NextResponse.redirect(
			new URL(
				`/admin/login?error=${encodeURIComponent(description)}`,
				request.url,
			),
		);
	}

	if (!code || !state) {
		return NextResponse.redirect(new URL('/admin/login', request.url));
	}

	const codeVerifier = request.cookies.get('pkce_verifier')?.value;
	const savedState = request.cookies.get('oauth_state')?.value;

	if (!codeVerifier || !savedState || savedState !== state) {
		return NextResponse.redirect(new URL('/admin/login', request.url));
	}

	try {
		const tokens = await exchangeCodeForTokens(code, codeVerifier);

		const session = JSON.stringify({
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			id_token: tokens.id_token,
			expires_at: Date.now() + tokens.expires_in * 1000,
		});

		const response = NextResponse.redirect(new URL('/admin', request.url));

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
		return NextResponse.redirect(new URL('/admin/login', request.url));
	}
}
