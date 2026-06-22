import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname === '/admin/login' || pathname === '/admin/callback') {
		return NextResponse.next();
	}

	const session = request.cookies.get('admin_session');
	if (!session?.value) {
		return NextResponse.redirect(new URL('/admin/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*'],
};
