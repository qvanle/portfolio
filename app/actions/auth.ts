'use server';

import { redirect } from 'next/navigation';
import { clearSession, getKeycloakLogoutUrl, getSession } from '../lib/auth';

export async function logoutAction() {
	const session = await getSession();
	const idToken = session?.id_token;
	await clearSession();

	if (idToken) {
		redirect(getKeycloakLogoutUrl(idToken));
	}

	redirect('/admin/login');
}
