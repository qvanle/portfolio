'use server';

import { revalidatePath } from 'next/cache';
import type {
	AdminPostMeta,
	AdminTranslation,
	PostFormData,
} from '../data/admin-posts';
import { directusFetch } from '../lib/auth';

interface ActionResult<T = undefined> {
	success: boolean;
	error?: string;
	data?: T;
}

interface ListResult {
	posts: AdminPostMeta[];
	total: number;
}

const PAGE_SIZE = 20;

export async function listPosts(
	page = 1,
	search?: string,
): Promise<ActionResult<ListResult>> {
	const offset = (page - 1) * PAGE_SIZE;

	const params = new URLSearchParams({
		'fields[]': ['*', 'translations.*'].join(','),
		sort: '-date_updated',
		limit: String(PAGE_SIZE),
		offset: String(offset),
		meta: 'filter_count',
	});

	if (search?.trim()) {
		params.set('search', search.trim());
	}

	try {
		const res = await directusFetch(`/items/posts_meta?${params}`, {
			cache: 'no-store',
		});

		if (!res.ok) {
			return { success: false, error: `Failed to fetch posts: ${res.status}` };
		}

		const json = await res.json();
		return {
			success: true,
			data: {
				posts: json.data ?? [],
				total: json.meta?.filter_count ?? 0,
			},
		};
	} catch {
		return { success: false, error: 'Network error fetching posts.' };
	}
}

export async function getPost(
	id: string,
): Promise<ActionResult<AdminPostMeta>> {
	try {
		const params = new URLSearchParams({
			'fields[]': ['*', 'translations.*'].join(','),
		});

		const res = await directusFetch(`/items/posts_meta/${id}?${params}`, {
			cache: 'no-store',
		});

		if (!res.ok) {
			return { success: false, error: `Post not found: ${res.status}` };
		}

		const json = await res.json();
		return { success: true, data: json.data };
	} catch {
		return { success: false, error: 'Network error fetching post.' };
	}
}

export async function createPost(
	data: PostFormData,
): Promise<ActionResult<AdminPostMeta>> {
	try {
		const res = await directusFetch('/items/posts_meta', {
			method: 'POST',
			body: JSON.stringify({
				status: data.status,
				slug: data.slug,
				featured: data.featured,
				category: data.category,
				image: data.image,
				date_published: data.date_published,
				translations: data.translations,
			}),
		});

		if (!res.ok) {
			const text = await res.text();
			return { success: false, error: `Create failed: ${text}` };
		}

		const json = await res.json();
		revalidatePath('/admin');
		revalidatePath('/insights');
		revalidatePath('/');
		return { success: true, data: json.data };
	} catch {
		return { success: false, error: 'Network error creating post.' };
	}
}

export async function updatePost(
	id: string,
	data: Partial<PostFormData> & { translations?: AdminTranslation[] },
): Promise<ActionResult<AdminPostMeta>> {
	try {
		const res = await directusFetch(`/items/posts_meta/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const text = await res.text();
			return { success: false, error: `Update failed: ${text}` };
		}

		const json = await res.json();
		revalidatePath('/admin');
		revalidatePath('/insights');
		revalidatePath('/');
		return { success: true, data: json.data };
	} catch {
		return { success: false, error: 'Network error updating post.' };
	}
}

export async function deletePost(id: string): Promise<ActionResult> {
	try {
		const res = await directusFetch(`/items/posts_meta/${id}`, {
			method: 'DELETE',
		});

		if (!res.ok) {
			return { success: false, error: `Delete failed: ${res.status}` };
		}

		revalidatePath('/admin');
		revalidatePath('/insights');
		revalidatePath('/');
		return { success: true };
	} catch {
		return { success: false, error: 'Network error deleting post.' };
	}
}

export async function uploadImage(
	formData: FormData,
): Promise<ActionResult<{ id: string }>> {
	try {
		const res = await directusFetch('/files', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}`,
			},
			body: formData,
		});

		if (!res.ok) {
			return { success: false, error: `Upload failed: ${res.status}` };
		}

		const json = await res.json();
		return { success: true, data: { id: json.data.id } };
	} catch {
		return { success: false, error: 'Network error uploading image.' };
	}
}
