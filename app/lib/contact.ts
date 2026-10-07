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

	// The site is static, so the form posts straight from the browser to a
	// form-handling service (Formspree-compatible JSON endpoint).
	const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT?.trim();

	if (!endpoint) {
		return { success: false, error: 'Service unavailable.' };
	}

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
