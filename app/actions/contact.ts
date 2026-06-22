'use server';

interface ContactFormData {
	name: string;
	email: string;
	subject: string;
	message: string;
}

interface ContactResult {
	success: boolean;
	error?: string;
}

export async function submitContactForm(
	data: ContactFormData,
): Promise<ContactResult> {
	if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
		return { success: false, error: 'Please fill in all required fields.' };
	}

	const baseUrl = process.env.DIRECTUS_URL?.trim();

	if (!baseUrl) {
		return { success: false, error: 'Service unavailable.' };
	}

	const endpoint = `${baseUrl.replace(/\/$/, '')}/items/contact_submissions`;

	try {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				name: data.name.trim(),
				email: data.email.trim(),
				subject: data.subject?.trim() || '',
				message: data.message.trim(),
			}),
		});

		if (!response.ok) {
			return { success: false, error: 'Failed to send message.' };
		}

		return { success: true };
	} catch {
		return { success: false, error: 'Network error. Please try again.' };
	}
}
