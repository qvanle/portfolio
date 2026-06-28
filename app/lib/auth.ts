import { cookies } from 'next/headers';

const DIRECTUS_URL =
	process.env.DIRECTUS_URL?.replace(/\/$/, '') ??
	process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, '') ??
	'https://cms.rotexai.com';
const SESSION_COOKIE = 'admin_session';

interface SessionData {
	access_token: string;
	refresh_token?: string;
	expires_at: number;
}

export async function setSession(session: {
	access_token: string;
	refresh_token?: string;
	expires: number;
}) {
	const cookieStore = await cookies();
	const expiresAt = Date.now() + session.expires;

	cookieStore.set(
		SESSION_COOKIE,
		JSON.stringify({
			access_token: session.access_token,
			refresh_token: session.refresh_token,
			expires_at: expiresAt,
		}),
		{
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
		},
	);
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
		await clearSession();
		return null;
	}

	if (Date.now() < session.expires_at - 30_000) return session;
	if (!session.refresh_token) return null;

	try {
		const res = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				refresh_token: session.refresh_token,
				mode: 'json',
			}),
			cache: 'no-store',
		});

		if (!res.ok) {
			await clearSession();
			return null;
		}

		const json = await res.json();
		const { access_token, expires } = json.data;
		const refresh_token = json.data.refresh_token ?? session.refresh_token;
		const refreshed: SessionData = {
			access_token,
			refresh_token,
			expires_at: Date.now() + expires,
		};

		await setSession({ access_token, refresh_token, expires });

		return refreshed;
	} catch {
		return null;
	}
}

export async function directusFetch(path: string, init: RequestInit = {}) {
	const session = await getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	const headers = new Headers(init.headers);
	if (!(init.body instanceof FormData)) {
		headers.set(
			'Content-Type',
			headers.get('Content-Type') ?? 'application/json',
		);
	}

	if (!headers.has('Authorization')) {
		headers.set('Authorization', `Bearer ${session.access_token}`);
	}

	return fetch(`${DIRECTUS_URL}${path}`, {
		...init,
		headers,
	});
}

export default directusFetch;
