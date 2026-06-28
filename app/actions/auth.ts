'use server';

import { redirect } from 'next/navigation';
import { clearSession, setSession } from '../lib/auth';

const DIRECTUS_URL =
	process.env.DIRECTUS_URL?.replace(/\/$/, '') ??
	process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, '') ??
	'https://cms.rotexai.com';

export async function loginAction(formData: FormData) {
	const email = String(formData.get('email') ?? '').trim();
	const password = String(formData.get('password') ?? '');
	let loginFailed = false;

	if (!email || !password) {
		redirect('/admin/login?error=missing');
	}

	try {
		const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
				mode: 'json',
			}),
			cache: 'no-store',
		});

		if (!response.ok) {
			loginFailed = true;
		} else {
			const json = await response.json();
			const { access_token, refresh_token, expires } = json.data;

			await setSession({ access_token, refresh_token, expires });
		}
	} catch {
		redirect('/admin/login?error=network');
	}

	if (loginFailed) {
		redirect('/admin/login?error=invalid');
	}

	redirect('/admin');
}

export async function logoutAction() {
	await clearSession();
	redirect('/admin/login');
}
