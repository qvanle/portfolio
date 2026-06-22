'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState, useTransition } from 'react';
import { deletePost, listPosts } from '../../actions/admin-posts';
import type { AdminPostMeta } from '../../data/admin-posts';

const statusColors: Record<string, string> = {
	published:
		'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
	draft:
		'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
	archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400',
};

interface PostsTableProps {
	initialPosts: AdminPostMeta[];
	initialTotal: number;
}

export default function PostsTable({
	initialPosts,
	initialTotal,
}: PostsTableProps) {
	const router = useRouter();
	const [posts, setPosts] = useState(initialPosts);
	const [total, setTotal] = useState(initialTotal);
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [isPending, startTransition] = useTransition();

	const totalPages = Math.max(1, Math.ceil(total / 20));

	function fetchPage(p: number, s?: string) {
		startTransition(async () => {
			const result = await listPosts(p, s);
			if (result.success && result.data) {
				setPosts(result.data.posts);
				setTotal(result.data.total);
				setPage(p);
			}
		});
	}

	function handleSearch(e: FormEvent) {
		e.preventDefault();
		fetchPage(1, search);
	}

	function handleDelete(id: string, title: string) {
		if (!confirm(`Delete "${title}"?`)) return;
		startTransition(async () => {
			const result = await deletePost(id);
			if (result.success) {
				fetchPage(page, search);
			}
		});
	}

	function getTitle(post: AdminPostMeta): string {
		return post.translations?.[0]?.title ?? '(untitled)';
	}

	return (
		<div>
			<div className='mb-6 flex items-center justify-between gap-4'>
				<form onSubmit={handleSearch} className='flex gap-2'>
					<input
						type='text'
						placeholder='Search posts...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className='rounded-md border border-black/20 bg-white/50 px-3 py-1.5 text-sm text-black placeholder:text-black/40 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35'
					/>
					<button
						type='submit'
						className='rounded-md bg-black/5 px-3 py-1.5 text-sm text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'
					>
						Search
					</button>
				</form>
				<a
					href='/admin/posts/new'
					className='rounded-md bg-primary-500 px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-primary-400'
				>
					New Post
				</a>
			</div>

			<div className='overflow-x-auto rounded-lg border border-black/10 dark:border-white/10'>
				<table className='w-full text-sm'>
					<thead>
						<tr className='border-b border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02]'>
							<th className='px-4 py-3 text-left font-medium text-black/60 dark:text-white/60'>
								Title
							</th>
							<th className='px-4 py-3 text-left font-medium text-black/60 dark:text-white/60'>
								Status
							</th>
							<th className='px-4 py-3 text-left font-medium text-black/60 dark:text-white/60'>
								Category
							</th>
							<th className='px-4 py-3 text-center font-medium text-black/60 dark:text-white/60'>
								Featured
							</th>
							<th className='px-4 py-3 text-left font-medium text-black/60 dark:text-white/60'>
								Updated
							</th>
							<th className='px-4 py-3 text-right font-medium text-black/60 dark:text-white/60'>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{posts.map((post) => (
							<tr
								key={post.id}
								className='border-b border-black/5 last:border-0 dark:border-white/5'
							>
								<td className='px-4 py-3 font-medium text-black dark:text-white'>
									{getTitle(post)}
								</td>
								<td className='px-4 py-3'>
									<span
										className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[post.status] ?? ''}`}
									>
										{post.status}
									</span>
								</td>
								<td className='px-4 py-3 text-black/60 dark:text-white/60'>
									{post.category || '—'}
								</td>
								<td className='px-4 py-3 text-center'>
									{post.featured ? '★' : '—'}
								</td>
								<td className='px-4 py-3 text-black/60 dark:text-white/60'>
									{post.date_updated
										? new Date(post.date_updated).toLocaleDateString()
										: '—'}
								</td>
								<td className='px-4 py-3 text-right'>
									<div className='flex justify-end gap-2'>
										<button
											type='button'
											onClick={() =>
												router.push(`/admin/posts/${post.id}/edit`)
											}
											className='text-primary-500 transition-colors hover:text-primary-400'
										>
											Edit
										</button>
										<button
											type='button'
											onClick={() => handleDelete(post.id, getTitle(post))}
											className='text-red-500 transition-colors hover:text-red-400'
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))}
						{posts.length === 0 && (
							<tr>
								<td
									colSpan={6}
									className='px-4 py-8 text-center text-black/40 dark:text-white/40'
								>
									No posts found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className='mt-4 flex items-center justify-between'>
					<span className='text-sm text-black/60 dark:text-white/60'>
						{total} post{total === 1 ? '' : 's'} — page {page} of {totalPages}
					</span>
					<div className='flex gap-2'>
						<button
							type='button'
							disabled={page <= 1 || isPending}
							onClick={() => fetchPage(page - 1, search)}
							className='rounded-md bg-black/5 px-3 py-1 text-sm transition-colors hover:bg-black/10 disabled:opacity-40 dark:bg-white/5 dark:hover:bg-white/10'
						>
							Previous
						</button>
						<button
							type='button'
							disabled={page >= totalPages || isPending}
							onClick={() => fetchPage(page + 1, search)}
							className='rounded-md bg-black/5 px-3 py-1 text-sm transition-colors hover:bg-black/10 disabled:opacity-40 dark:bg-white/5 dark:hover:bg-white/10'
						>
							Next
						</button>
					</div>
				</div>
			)}

			{isPending && (
				<div className='mt-4 text-center text-sm text-black/40 dark:text-white/40'>
					Loading...
				</div>
			)}
		</div>
	);
}
