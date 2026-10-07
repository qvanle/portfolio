'use client';

import { type FormEvent, useState } from 'react';
import { getSiteCopy } from '../../data/site-copy';
import { submitContactForm } from '../../lib/contact';
import { useLanguage } from '../i18n/language-provider';

const inputClassName =
	'w-full rounded-md border border-black/20 bg-white/50 px-4 py-3 text-sm text-black placeholder:text-black/40 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35';

const labelClassName =
	'mb-1.5 block text-sm font-medium text-black/60 dark:text-white/50';

export default function ContactForm() {
	const { language } = useLanguage();
	const copy = getSiteCopy(language);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');
	const [status, setStatus] = useState<
		'idle' | 'sending' | 'success' | 'error'
	>('idle');

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setStatus('sending');

		const result = await submitContactForm({ name, email, subject, message });

		if (result.success) {
			setStatus('success');
			setName('');
			setEmail('');
			setSubject('');
			setMessage('');
		} else {
			setStatus('error');
		}
	};

	return (
		<div className='rounded-xl border border-black/8 bg-black/[0.02] p-6 dark:border-white/8 dark:bg-white/[0.02]'>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div className='grid gap-4 sm:grid-cols-2'>
					<div>
						<label htmlFor='contact-name' className={labelClassName}>
							{copy.home.contact.namePlaceholder}
						</label>
						<input
							id='contact-name'
							type='text'
							required
							placeholder={copy.home.contact.namePlaceholder}
							value={name}
							onChange={(e) => setName(e.target.value)}
							className={inputClassName}
							data-skip-splash-cursor
						/>
					</div>
					<div>
						<label htmlFor='contact-email' className={labelClassName}>
							{copy.home.contact.emailPlaceholder}
						</label>
						<input
							id='contact-email'
							type='email'
							required
							placeholder={copy.home.contact.emailPlaceholder}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={inputClassName}
							data-skip-splash-cursor
						/>
					</div>
				</div>
				<div>
					<label htmlFor='contact-subject' className={labelClassName}>
						{copy.home.contact.subjectPlaceholder}
					</label>
					<input
						id='contact-subject'
						type='text'
						placeholder={copy.home.contact.subjectPlaceholder}
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
						className={inputClassName}
						data-skip-splash-cursor
					/>
				</div>
				<div>
					<label htmlFor='contact-message' className={labelClassName}>
						{copy.home.contact.messagePlaceholder}
					</label>
					<textarea
						id='contact-message'
						required
						rows={5}
						placeholder={copy.home.contact.messagePlaceholder}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className={`${inputClassName} resize-none`}
						data-skip-splash-cursor
					/>
				</div>
				<div className='flex items-center gap-4'>
					<button
						type='submit'
						disabled={status === 'sending'}
						className='inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 dark:focus-visible:ring-offset-black'
						data-skip-splash-cursor
					>
						{status === 'sending'
							? copy.home.contact.sending
							: copy.home.contact.submitLabel}
					</button>
					{status === 'success' && (
						<p className='text-sm text-green-600 dark:text-green-400'>
							{copy.home.contact.successMessage}
						</p>
					)}
					{status === 'error' && (
						<p className='text-sm text-red-600 dark:text-red-400'>
							{copy.home.contact.errorMessage}
						</p>
					)}
				</div>
			</form>
		</div>
	);
}
