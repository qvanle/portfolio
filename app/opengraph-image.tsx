import { ImageResponse } from 'next/og';
import { siteDescription, siteName } from './lib/site-config';

export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = siteName;

export default function OpengraphImage() {
	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 24,
				backgroundColor: '#ffffff',
				color: '#111111',
				padding: 80,
			}}
		>
			<div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -4 }}>
				{siteName}
			</div>
			<div
				style={{
					fontSize: 36,
					color: '#555555',
					textAlign: 'center',
					maxWidth: 900,
				}}
			>
				{siteDescription}
			</div>
		</div>,
		size,
	);
}
