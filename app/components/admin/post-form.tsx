'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState, useTransition } from 'react';
import { uploadImage } from '../../actions/admin-posts';
import type { AdminPostMeta, AdminTranslation } from '../../data/admin-posts';

const inputClassName =
	'w-full rounded-md border border-black/20 bg-white/50 px-4 py-2.5 text-sm text-black placeholder:text-black/40 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35';

const labelClassName =
	'mb-1.5 block text-sm font-medium text-black/60 dark:text-white/50';

const DIRECTUS_URL =
	process.env.NEXT_PUBLIC_DIRECTUS_URL ??
	process.env.DIRECTUS_URL ??
	'https://cms.rotexai.com';

const CATEGORIES = ['automation', 'product', 'workflow', 'engineering', ''];

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();
}

function emptyTranslation(lang: 'en' | 'vi'): AdminTranslation {
	return { languages_code: lang, title: '', excerpt: '', body: '' };
}

interface PostFormProps {
	initialData?: AdminPostMeta;
	onSubmit: (data: {
		status: AdminPostMeta['status'];
		slug: string;
		featured: boolean;
		category: string;
		image: string | null;
		date_published: string | null;
		translations: AdminTranslation[];
	}) => Promise<{ success: boolean; error?: string }>;
}

export default function PostForm({ initialData, onSubmit }: PostFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const initEN =
		initialData?.translations?.find((t) => t.languages_code === 'en') ??
		emptyTranslation('en');
	const initVI =
		initialData?.translations?.find((t) => t.languages_code === 'vi') ??
		emptyTranslation('vi');

	const [status, setStatus] = useState<AdminPostMeta['status']>(
		initialData?.status ?? 'draft',
	);
	const [slug, setSlug] = useState(initialData?.slug ?? '');
	const [slugManual, setSlugManual] = useState(!!initialData?.slug);
	const [featured, setFeatured] = useState(initialData?.featured ?? false);
	const [category, setCategory] = useState(initialData?.category ?? '');
	const [imageId, setImageId] = useState<string | null>(
		initialData?.image ?? null,
	);
	const [datePublished, setDatePublished] = useState(
		initialData?.date_published?.slice(0, 16) ?? '',
	);

	const [enTranslation, setEnTranslation] = useState(initEN);
	const [viTranslation, setViTranslation] = useState(initVI);
	const [activeLang, setActiveLang] = useState<'en' | 'vi'>('en');

	const [error, setError] = useState('');
	const [uploading, setUploading] = useState(false);

	const activeTranslation = activeLang === 'en' ? enTranslation : viTranslation;
	const setActiveTranslation =
		activeLang === 'en' ? setEnTranslation : setViTranslation;

	function handleTitleChange(title: string) {
		setActiveTranslation((t) => ({ ...t, title }));
		if (!slugManual && activeLang === 'en') {
			setSlug(slugify(title));
		}
	}

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		const fd = new FormData();
		fd.append('file', file);
		const result = await uploadImage(fd);
		if (result.success && result.data) {
			setImageId(result.data.id);
		}
		setUploading(false);
	}

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError('');

		if (!enTranslation.title.trim()) {
			setError('English title is required.');
			return;
		}
		if (!slug.trim()) {
			setError('Slug is required.');
			return;
		}

		startTransition(async () => {
			const translations: AdminTranslation[] = [
				{ ...enTranslation, languages_code: 'en' },
			];
			if (viTranslation.title.trim()) {
				translations.push({ ...viTranslation, languages_code: 'vi' });
			}

			const result = await onSubmit({
				status,
				slug: slug.trim(),
				featured,
				category,
				image: imageId,
				date_published: datePublished || null,
				translations,
			});

			if (result.success) {
				router.push('/admin');
			} else {
				setError(result.error ?? 'Something went wrong.');
			}
		});
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			{/* Language tabs */}
			<div className='flex gap-1 border-b border-black/10 dark:border-white/10'>
				{(['en', 'vi'] as const).map((lang) => (
					<button
						key={lang}
						type='button'
						onClick={() => setActiveLang(lang)}
						className={`px-4 py-2 text-sm font-medium transition-colors ${
							activeLang === lang
								? 'border-b-2 border-primary-500 text-primary-500'
								: 'text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white'
						}`}
					>
						{lang === 'en' ? 'English' : 'Vietnamese'}
					</button>
				))}
			</div>

			{/* Translation fields */}
			<div className='space-y-4'>
				<div>
					<label htmlFor='title' className={labelClassName}>
						Title
					</label>
					<input
						id='title'
						type='text'
						value={activeTranslation.title}
						onChange={(e) => handleTitleChange(e.target.value)}
						placeholder='Post title'
						className={inputClassName}
					/>
				</div>
				<div>
					<label htmlFor='excerpt' className={labelClassName}>
						Excerpt
					</label>
					<textarea
						id='excerpt'
						rows={2}
						value={activeTranslation.excerpt}
						onChange={(e) =>
							setActiveTranslation((t) => ({ ...t, excerpt: e.target.value }))
						}
						placeholder='Short description'
						className={`${inputClassName} resize-none`}
					/>
				</div>
				<div>
					<label htmlFor='body' className={labelClassName}>
						Body
					</label>
					<textarea
						id='body'
						rows={16}
						value={activeTranslation.body}
						onChange={(e) =>
							setActiveTranslation((t) => ({ ...t, body: e.target.value }))
						}
						placeholder='Post content (HTML or Markdown)'
						className={`${inputClassName} resize-y font-mono text-xs`}
					/>
				</div>
			</div>

			{/* Metadata */}
			<div className='grid gap-4 sm:grid-cols-2'>
				<div>
					<label htmlFor='slug' className={labelClassName}>
						Slug
					</label>
					<input
						id='slug'
						type='text'
						value={slug}
						onChange={(e) => {
							setSlug(e.target.value);
							setSlugManual(true);
						}}
						placeholder='url-friendly-slug'
						className={inputClassName}
					/>
				</div>
				<div>
					<label htmlFor='status' className={labelClassName}>
						Status
					</label>
					<select
						id='status'
						value={status}
						onChange={(e) =>
							setStatus(e.target.value as AdminPostMeta['status'])
						}
						className={inputClassName}
					>
						<option value='draft'>Draft</option>
						<option value='published'>Published</option>
						<option value='archived'>Archived</option>
					</select>
				</div>
				<div>
					<label htmlFor='category' className={labelClassName}>
						Category
					</label>
					<select
						id='category'
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className={inputClassName}
					>
						<option value=''>None</option>
						{CATEGORIES.filter(Boolean).map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor='date_published' className={labelClassName}>
						Publish date
					</label>
					<input
						id='date_published'
						type='datetime-local'
						value={datePublished}
						onChange={(e) => setDatePublished(e.target.value)}
						className={inputClassName}
					/>
				</div>
			</div>

			{/* Featured + Image */}
			<div className='flex flex-wrap items-start gap-6'>
				<label className='flex items-center gap-2 text-sm text-black dark:text-white'>
					<input
						type='checkbox'
						checked={featured}
						onChange={(e) => setFeatured(e.target.checked)}
						className='h-4 w-4 rounded border-black/20 text-primary-500 focus:ring-primary-500 dark:border-white/20'
					/>
					Featured
				</label>
				<div className='flex-1'>
					<label htmlFor='image' className={labelClassName}>
						Image
					</label>
					<input
						id='image'
						type='file'
						accept='image/*'
						onChange={handleImageUpload}
						disabled={uploading}
						className='text-sm text-black/60 dark:text-white/60'
					/>
					{uploading && (
						<p className='mt-1 text-xs text-black/40 dark:text-white/40'>
							Uploading...
						</p>
					)}
					{imageId && (
						<img
							src={`${DIRECTUS_URL}/assets/${imageId}?width=200`}
							alt='Preview'
							className='mt-2 h-24 rounded-md object-cover'
						/>
					)}
				</div>
			</div>

			{/* Actions */}
			<div className='flex flex-col gap-4'>
				<div className='flex items-center gap-4'>
					<button
						type='submit'
						disabled={isPending}
						className='rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-primary-400 disabled:opacity-50'
					>
						{isPending
							? 'Saving...'
							: initialData
								? 'Update Post'
								: 'Create Post'}
					</button>
					<button
						type='button'
						onClick={() => router.push('/admin')}
						className='text-sm text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white'
					>
						Cancel
					</button>
				</div>
				{error && (
					<p className='rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300'>
						{error}
					</p>
				)}
			</div>
		</form>
	);
}
