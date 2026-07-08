import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Not Found',
	robots: {
		index: false,
		follow: false,
	},
};

export default function NotFound() {
	return (
		<main className='flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center'>
			<h1 className='font-bold text-4xl'>404</h1>
			<p className='text-gray-500 dark:text-gray-400'>
				This page could not be found.
			</p>
			<Link
				href='/'
				className='text-primary-500 underline underline-offset-4 hover:text-primary-600'
			>
				Back to home
			</Link>
		</main>
	);
}
