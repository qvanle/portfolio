import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { logoutAction } from '../actions/auth';
import { getSession } from '../lib/auth';

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await getSession();
	if (!session) redirect('/admin/login');

	return (
		<div className='min-h-screen bg-white dark:bg-black'>
			<nav className='border-b border-black/10 dark:border-white/10'>
				<div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-3'>
					<div className='flex items-center gap-6'>
						<a
							href='/admin'
							className='text-lg font-semibold text-black dark:text-white'
						>
							Admin
						</a>
						<div className='flex gap-4'>
							<a
								href='/admin'
								className='text-sm text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white'
							>
								Posts
							</a>
							<a
								href='/admin/posts/new'
								className='text-sm text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white'
							>
								New Post
							</a>
						</div>
					</div>
					<form action={logoutAction}>
						<button
							type='submit'
							className='text-sm text-black/60 transition-colors hover:text-red-600 dark:text-white/60 dark:hover:text-red-400'
						>
							Sign out
						</button>
					</form>
				</div>
			</nav>
			<main className='mx-auto max-w-6xl px-6 py-8'>{children}</main>
		</div>
	);
}
