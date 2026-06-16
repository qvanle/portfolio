import Link from 'next/link';
import { AtSignIcon } from '../layouts/icons/at-sign-icon';
import { FacebookIcon } from '../layouts/icons/facebook-icon';
import { GithubIcon } from '../layouts/icons/github-icon';
import { LinkedinIcon } from '../layouts/icons/linkedin-icon';

interface SocialLinksProps {
	className?: string;
}

export default function SocialLinks({ className }: SocialLinksProps) {
	return (
		<div className={className}>
			<div className='flex flex-wrap items-center gap-2'>
				<Link
					href='https://github.com/qvanle'
					target='_blank'
					rel='noreferrer'
					aria-label='GitHub'
					data-skip-splash-cursor
				>
					<GithubIcon className='h-9 w-9' />
				</Link>
				<Link
					href='https://www.linkedin.com/in/le-quoc-van-754b53179/'
					target='_blank'
					rel='noreferrer'
					aria-label='LinkedIn'
					data-skip-splash-cursor
				>
					<LinkedinIcon className='h-9 w-9' />
				</Link>
				<Link
					href='https://www.facebook.com/qvanleye'
					target='_blank'
					rel='noreferrer'
					aria-label='Facebook'
					data-skip-splash-cursor
				>
					<FacebookIcon className='h-9 w-9' />
				</Link>
				<Link
					href='mailto:qvanle@rotexai.com'
					aria-label='Email'
					rel='noreferrer'
					data-skip-splash-cursor
				>
					<AtSignIcon className='h-9 w-9' />
				</Link>
			</div>
		</div>
	);
}
