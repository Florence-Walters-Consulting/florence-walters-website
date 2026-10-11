import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';

// Optimistic check only: bounces visitors without a valid session cookie to the login page.
// The real authorization happens again, against the database, in every admin page and action.
export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

	// Server Action calls pass through: every admin action checks the session itself (runAdminAction)
	// before touching anything, and answers an expired session with a clear message. Redirecting the
	// request here would instead drop the admin on a generic error screen.
	if (request.headers.has('next-action')) return NextResponse.next();

	// The login page is always reachable. (It redirects signed-in admins itself, using the
	// database check, so a cookie for a deleted admin cannot cause a redirect loop here.)
	if (pathname === '/admin/login') return NextResponse.next();
	if (!session) {
		// The editor's image upload is called with fetch(): answer it with JSON instead of a redirect.
		if (pathname === '/admin/upload-image') return Response.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
		return NextResponse.redirect(new URL('/admin/login', request.url));
	}
	return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
