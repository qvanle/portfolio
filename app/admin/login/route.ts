import { type NextRequest, NextResponse } from 'next/server';
import { generatePKCE, getKeycloakAuthUrl } from '../../lib/auth';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function GET(request: NextRequest) {
	const session = request.cookies.get('admin_session');
	if (session?.value) {
		return NextResponse.redirect(`${APP_URL}/admin`);
	}

	const { codeVerifier, codeChallenge } = await generatePKCE();
	const state = crypto.randomUUID();
	const authUrl = getKeycloakAuthUrl(codeChallenge, state);

	const response = NextResponse.redirect(authUrl);

	const cookieOpts = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax' as const,
		path: '/',
		maxAge: 300,
	};

	response.cookies.set('pkce_verifier', codeVerifier, cookieOpts);
	response.cookies.set('oauth_state', state, cookieOpts);

	return response;
}
