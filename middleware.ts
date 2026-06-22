import { type NextRequest, NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname === '/admin/login' || pathname === '/admin/callback') {
		return NextResponse.next();
	}

	const session = request.cookies.get('admin_session');
	if (!session?.value) {
		return NextResponse.redirect(`${APP_URL}/admin/login`);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*'],
};
