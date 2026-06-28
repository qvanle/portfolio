import { redirect } from 'next/navigation';
import { loginAction } from '../../actions/auth';
import { getSession } from '../../lib/auth';

interface LoginPageProps {
	searchParams?: Promise<{
		error?: string;
	}>;
}

const errors: Record<string, string> = {
	invalid: 'Invalid email or password.',
	missing: 'Enter your email and password.',
	network: 'Unable to reach the CMS. Try again.',
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
	const session = await getSession();
	if (session) redirect('/admin');

	const params = await searchParams;
	const error = params?.error ? errors[params.error] : undefined;

	return (
		<main className='flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-16 text-black dark:bg-black dark:text-white'>
			<form
				action={loginAction}
				className='w-full max-w-sm rounded-lg border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5'
			>
				<div className='mb-6'>
					<h1 className='text-2xl font-semibold'>CMS Login</h1>
					<p className='mt-2 text-sm text-black/60 dark:text-white/50'>
						Sign in with your Directus account.
					</p>
				</div>

				{error ? (
					<p className='mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300'>
						{error}
					</p>
				) : null}

				<label
					htmlFor='email'
					className='mb-1.5 block text-sm font-medium text-black/60 dark:text-white/50'
				>
					Email
				</label>
				<input
					id='email'
					name='email'
					type='email'
					autoComplete='username'
					required
					className='mb-4 w-full rounded-md border border-black/20 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 dark:border-white/20 dark:bg-black dark:text-white dark:placeholder:text-white/35'
				/>

				<label
					htmlFor='password'
					className='mb-1.5 block text-sm font-medium text-black/60 dark:text-white/50'
				>
					Password
				</label>
				<input
					id='password'
					name='password'
					type='password'
					autoComplete='current-password'
					required
					className='mb-6 w-full rounded-md border border-black/20 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 dark:border-white/20 dark:bg-black dark:text-white dark:placeholder:text-white/35'
				/>

				<button
					type='submit'
					className='w-full rounded-full bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600'
				>
					Sign in
				</button>
			</form>
		</main>
	);
}
