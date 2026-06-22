import { cookies } from 'next/headers';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const DIRECTUS_URL =
	process.env.NEXT_PUBLIC_DIRECTUS_URL ??
	process.env.DIRECTUS_URL?.replace(/\/$/, '') ??
	'';

const SESSION_COOKIE = 'admin_session';
const CALLBACK_URL = `${APP_URL}/admin/callback`;

interface SessionData {
	access_token: string;
	expires_at: number;
}

export function getDirectusSSOUrl(): string {
	const params = new URLSearchParams({
		redirect: CALLBACK_URL,
	});
	return `${DIRECTUS_URL}/auth/login/keycloak?${params}`;
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

	// Token expired — try refreshing via Directus session cookie
	const sessionToken = cookieStore.get('directus_session_token')?.value;
	if (!sessionToken) return null;

	try {
		const serverUrl =
			process.env.DIRECTUS_URL?.replace(/\/$/, '') ?? DIRECTUS_URL;
		const res = await fetch(`${serverUrl}/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `directus_session_token=${sessionToken}`,
			},
			body: JSON.stringify({ mode: 'session' }),
		});

		if (!res.ok) return null;

		const json = await res.json();
		return {
			access_token: json.data.access_token,
			expires_at: Date.now() + json.data.expires,
		};
	} catch {
		return null;
	}
}

export async function directusFetch(
	path: string,
	init?: RequestInit,
): Promise<Response> {
	const session = await getSession();
	if (!session) {
		throw new Error('No valid session');
	}

	const serverUrl =
		process.env.DIRECTUS_URL?.replace(/\/$/, '') ?? DIRECTUS_URL;
	return fetch(`${serverUrl}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${session.access_token}`,
			'Content-Type': 'application/json',
			...init?.headers,
		},
	});
}
