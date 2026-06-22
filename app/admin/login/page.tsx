import { redirect } from 'next/navigation';
import {
	generatePKCE,
	getKeycloakAuthUrl,
	getSession,
	setPKCECookies,
} from '../../lib/auth';

export default async function AdminLoginPage() {
	const session = await getSession();
	if (session) redirect('/admin');

	const { codeVerifier, codeChallenge } = await generatePKCE();
	const state = crypto.randomUUID();

	await setPKCECookies(codeVerifier, state);

	redirect(getKeycloakAuthUrl(codeChallenge, state));
}
