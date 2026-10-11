import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { readSession, type AdminSession } from './session';

/** Thrown by requireAdminAction when a Server Action is called without a valid admin session. */
export class UnauthorizedError extends Error {
	constructor() {
		super('Your session has expired. Please sign in again.');
	}
}

/** Valid cookie AND the admin row still exists (so a removed admin loses access immediately). */
const currentAdmin = cache(async (): Promise<AdminSession | null> => {
	const session = await readSession();
	if (!session) return null;
	const [row] = await db
		.select({ id: schema.admin.id, username: schema.admin.username, name: schema.admin.name })
		.from(schema.admin)
		.where(eq(schema.admin.id, session.id))
		.limit(1);
	return row && row.username === session.username ? row : null;
});

/** For pages and layouts: redirects to the login page when not signed in. */
export async function requireAdmin(): Promise<AdminSession> {
	const admin = await currentAdmin();
	if (!admin) redirect('/admin/login');
	return admin;
}

/** For Server Actions and route handlers: throws instead of redirecting. */
export async function requireAdminAction(): Promise<AdminSession> {
	const admin = await currentAdmin();
	if (!admin) throw new UnauthorizedError();
	return admin;
}

export async function getAdminOrNull() {
	return currentAdmin();
}
