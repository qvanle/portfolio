import { type NextRequest, NextResponse } from 'next/server';
import {
	clearPKCECookies,
	exchangeCodeForTokens,
	getPKCECookies,
	setSessionCookie,
} from '../../lib/auth';

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

	const pkce = await getPKCECookies();

	if (!pkce.codeVerifier || !pkce.state || pkce.state !== state) {
		return NextResponse.redirect(new URL('/admin/login', request.url));
	}

	try {
		const tokens = await exchangeCodeForTokens(code, pkce.codeVerifier);
		await setSessionCookie(tokens);
		await clearPKCECookies();
		return NextResponse.redirect(new URL('/admin', request.url));
	} catch {
		return NextResponse.redirect(new URL('/admin/login', request.url));
	}
}
