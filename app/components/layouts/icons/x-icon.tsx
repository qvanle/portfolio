import classNames from 'classnames';
import type { SVGAttributes } from 'react';

interface XIconProps extends SVGAttributes<SVGSVGElement> {
	size?: number;
}

const XIcon = ({ className, size = 28, ...props }: XIconProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
		aria-hidden='true'
		focusable='false'
		className={classNames('select-none', className)}
		{...props}
	>
		<path d='M18 6 6 18' />
		<path d='m6 6 12 12' />
	</svg>
);

export default XIcon;
export { XIcon };
