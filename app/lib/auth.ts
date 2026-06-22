import { cookies } from 'next/headers';

const KEYCLOAK_URL =
	process.env.NEXT_PUBLIC_KEYCLOAK_URL ??
	'https://auth.rotexai.com/realms/internal';
const CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? 'blog-web';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const DIRECTUS_URL = process.env.DIRECTUS_URL?.replace(/\/$/, '') ?? '';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN ?? '';

const REDIRECT_URI = `${APP_URL}/admin/callback`;
const TOKEN_ENDPOINT = `${KEYCLOAK_URL}/protocol/openid-connect/token`;
const AUTH_ENDPOINT = `${KEYCLOAK_URL}/protocol/openid-connect/auth`;
const END_SESSION_ENDPOINT = `${KEYCLOAK_URL}/protocol/openid-connect/logout`;

const SESSION_COOKIE = 'admin_session';
const PKCE_COOKIE = 'pkce_verifier';
const STATE_COOKIE = 'oauth_state';

interface SessionData {
	access_token: string;
	refresh_token: string;
	id_token: string;
	expires_at: number;
}

interface TokenResponse {
	access_token: string;
	refresh_token: string;
	id_token: string;
	expires_in: number;
	token_type: string;
}

function base64url(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

export async function generatePKCE() {
	const verifierBytes = new Uint8Array(64);
	crypto.getRandomValues(verifierBytes);
	const codeVerifier = base64url(verifierBytes.buffer);

	const encoder = new TextEncoder();
	const digest = await crypto.subtle.digest(
		'SHA-256',
		encoder.encode(codeVerifier),
	);
	const codeChallenge = base64url(digest);

	return { codeVerifier, codeChallenge };
}

export function getKeycloakAuthUrl(
	codeChallenge: string,
	state: string,
): string {
	const params = new URLSearchParams({
		response_type: 'code',
		client_id: CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		code_challenge: codeChallenge,
		code_challenge_method: 'S256',
		scope: 'openid profile email',
		state,
	});
	return `${AUTH_ENDPOINT}?${params}`;
}

export function getKeycloakLogoutUrl(idToken: string): string {
	const params = new URLSearchParams({
		id_token_hint: idToken,
		post_logout_redirect_uri: `${APP_URL}/admin/login`,
	});
	return `${END_SESSION_ENDPOINT}?${params}`;
}

export async function exchangeCodeForTokens(
	code: string,
	codeVerifier: string,
): Promise<TokenResponse> {
	const res = await fetch(TOKEN_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			client_id: CLIENT_ID,
			code,
			redirect_uri: REDIRECT_URI,
			code_verifier: codeVerifier,
		}),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Token exchange failed: ${res.status} ${text}`);
	}

	return res.json();
}

export async function setSessionCookie(tokens: TokenResponse) {
	const cookieStore = await cookies();
	const session: SessionData = {
		access_token: tokens.access_token,
		refresh_token: tokens.refresh_token,
		id_token: tokens.id_token,
		expires_at: Date.now() + tokens.expires_in * 1000,
	};
	cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24,
	});
}

export async function setPKCECookies(codeVerifier: string, state: string) {
	const cookieStore = await cookies();
	const opts = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax' as const,
		path: '/',
		maxAge: 300,
	};
	cookieStore.set(PKCE_COOKIE, codeVerifier, opts);
	cookieStore.set(STATE_COOKIE, state, opts);
}

export async function getPKCECookies() {
	const cookieStore = await cookies();
	return {
		codeVerifier: cookieStore.get(PKCE_COOKIE)?.value ?? null,
		state: cookieStore.get(STATE_COOKIE)?.value ?? null,
	};
}

export async function clearPKCECookies() {
	const cookieStore = await cookies();
	cookieStore.delete(PKCE_COOKIE);
	cookieStore.delete(STATE_COOKIE);
}

export async function clearSession() {
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionData | null> {
	const cookieStore = await cookies();
	const raw = cookieStore.get(SESSION_COOKIE)?.value;
	if (!raw) return null;

	let session: SessionData;
	try {
		session = JSON.parse(raw);
	} catch {
		return null;
	}

	if (Date.now() < session.expires_at - 30_000) {
		return session;
	}

	try {
		const tokens = await refreshKeycloakToken(session.refresh_token);
		const refreshed: SessionData = {
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			id_token: tokens.id_token,
			expires_at: Date.now() + tokens.expires_in * 1000,
		};
		cookieStore.set(SESSION_COOKIE, JSON.stringify(refreshed), {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24,
		});
		return refreshed;
	} catch {
		cookieStore.delete(SESSION_COOKIE);
		return null;
	}
}

export async function directusFetch(
	path: string,
	init?: RequestInit,
): Promise<Response> {
	const url = `${DIRECTUS_URL}${path}`;
	return fetch(url, {
		...init,
		headers: {
			Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
			'Content-Type': 'application/json',
			...init?.headers,
		},
	});
}
