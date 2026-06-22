import { type NextRequest, NextResponse } from 'next/server';
import { getDirectusSSOUrl } from '../../lib/auth';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function GET(request: NextRequest) {
	const session = request.cookies.get('admin_session');
	if (session?.value) {
		return NextResponse.redirect(`${APP_URL}/admin`);
	}

	return NextResponse.redirect(getDirectusSSOUrl());
}
