'use client';

import LanguageSwitch from '../../i18n/language-switch';
import ThemeSwitch from '../theme-switch/theme-switch';

export default function TopRightControls() {
	return (
		<div className='fixed right-4 top-4 z-50 flex items-center gap-2'>
			<LanguageSwitch />
			<ThemeSwitch />
		</div>
	);
}
