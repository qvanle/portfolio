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

	const baseUrl = process.env.STRAPI_URL?.trim();

	if (!baseUrl) {
		return { success: false, error: 'Service unavailable.' };
	}

	const token = process.env.STRAPI_API_TOKEN?.trim();
	const endpoint = `${baseUrl.replace(/\/$/, '')}/api/contact-submissions`;

	try {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: JSON.stringify({
				data: {
					name: data.name.trim(),
					email: data.email.trim(),
					subject: data.subject?.trim() || '',
					message: data.message.trim(),
				},
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
