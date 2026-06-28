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
const POST_META_FIELDS = [
	'id',
	'status',
	'slug',
	'featured',
	'category',
	'image',
	'date_published',
	'date_created',
	'date_updated',
].join(',');

interface DirectusError {
	message?: string;
	extensions?: {
		code?: string;
		field?: string;
	};
}

async function directusErrorMessage(
	res: Response,
	fallback: string,
): Promise<string> {
	try {
		const payload = (await res.json()) as { errors?: DirectusError[] };
		const error = payload.errors?.[0];
		const field = error?.extensions?.field;
		const code = error?.extensions?.code;

		if (code === 'RECORD_NOT_UNIQUE' && field === 'slug') {
			return 'Slug already exists. Choose a different slug.';
		}

		if (code === 'RECORD_NOT_UNIQUE' && field) {
			return `${field} must be unique.`;
		}

		if (code === 'FORBIDDEN' || code === 'INVALID_CREDENTIALS') {
			return 'CMS permission denied. Check the Directus user role permissions.';
		}

		if (error?.message === 'An unexpected error occurred.') {
			return `${fallback} Check Directus permissions for this collection.`;
		}

		return error?.message ?? fallback;
	} catch {
		return `${fallback} (${res.status})`;
	}
}

function actionErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof Error) {
		if (error.message === 'Unauthorized') {
			return 'Your CMS session expired. Sign out and sign in again.';
		}

		if (process.env.NODE_ENV !== 'production') {
			return `${fallback}: ${error.message}`;
		}
	}

	return fallback;
}

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
		const params = new URLSearchParams({ fields: POST_META_FIELDS });
		const res = await directusFetch(`/items/posts_meta?${params}`, {
			method: 'POST',
			body: JSON.stringify({
				status: data.status,
				slug: data.slug,
				featured: data.featured,
				category: data.category,
				image: data.image,
				date_published: data.date_published,
			}),
		});

		if (!res.ok) {
			return {
				success: false,
				error: await directusErrorMessage(res, 'Create failed.'),
			};
		}

		const json = await res.json();
		const post = json.data as AdminPostMeta;

		if (data.translations.length > 0) {
			for (const translation of data.translations) {
				const translationRes = await directusFetch('/items/posts', {
					method: 'POST',
					body: JSON.stringify({
						...translation,
						posts_meta_id: post.id,
					}),
				});

				if (!translationRes.ok) {
					await directusFetch(`/items/posts_meta/${post.id}`, {
						method: 'DELETE',
					});

					return {
						success: false,
						error: await directusErrorMessage(
							translationRes,
							'Create translations failed.',
						),
					};
				}
			}
		}

		revalidatePath('/admin');
		revalidatePath('/insights');
		revalidatePath('/');
		return {
			success: true,
			data: {
				...post,
				translations: data.translations as AdminTranslation[],
			},
		};
	} catch (error) {
		console.error('Create post failed', error);
		return {
			success: false,
			error: actionErrorMessage(error, 'Network error creating post.'),
		};
	}
}

export async function updatePost(
	id: string,
	data: Partial<PostFormData> & { translations?: AdminTranslation[] },
): Promise<ActionResult<AdminPostMeta>> {
	try {
		const params = new URLSearchParams({ fields: POST_META_FIELDS });
		const { translations: _translations, ...postMetaData } = data;
		const res = await directusFetch(`/items/posts_meta/${id}?${params}`, {
			method: 'PATCH',
			body: JSON.stringify(postMetaData),
		});

		if (!res.ok) {
			return {
				success: false,
				error: await directusErrorMessage(res, 'Update failed.'),
			};
		}

		const json = await res.json();
		revalidatePath('/admin');
		revalidatePath('/insights');
		revalidatePath('/');
		return { success: true, data: json.data };
	} catch (error) {
		console.error('Update post failed', error);
		return {
			success: false,
			error: actionErrorMessage(error, 'Network error updating post.'),
		};
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
