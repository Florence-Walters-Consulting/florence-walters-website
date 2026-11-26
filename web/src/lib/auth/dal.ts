import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { readSession, type AdminSession } from './session';
import { toRole, type Role } from './roles';

/** A signed-in admin as loaded from the database (so role changes apply immediately). */
export type AdminUser = AdminSession & { role: Role; email: string };

/** Thrown by requireAdminAction when a Server Action is called without a valid admin session. */
export class UnauthorizedError extends Error {
	constructor() {
		super('Your session has expired. Please sign in again.');
	}
}

/** Valid cookie AND the admin row still exists (so a removed admin loses access immediately). */
const currentAdmin = cache(async (): Promise<AdminUser | null> => {
	const session = await readSession();
	if (!session) return null;
	const [row] = await db
		.select({ id: schema.admin.id, username: schema.admin.username, name: schema.admin.name, email: schema.admin.email, adminType: schema.admin.adminType })
		.from(schema.admin)
		.where(eq(schema.admin.id, session.id))
		.limit(1);
	if (!row || row.username !== session.username) return null;
	return { id: row.id, username: row.username, name: row.name, email: row.email, role: toRole(row.adminType) };
});

/** For pages and layouts: redirects to the login page when not signed in. */
export async function requireAdmin(roles?: Role[]): Promise<AdminUser> {
	const admin = await currentAdmin();
	if (!admin) redirect('/admin/login');
	// Signed in but not allowed on this page: back to the dashboard.
	if (roles && !roles.includes(admin.role)) redirect('/admin');
	return admin;
}

/** For Server Actions and route handlers: throws instead of redirecting. */
export class ForbiddenError extends Error {
	constructor() {
		super('You do not have permission to do that.');
	}
}

export async function requireAdminAction(roles?: Role[]): Promise<AdminUser> {
	const admin = await currentAdmin();
	if (!admin) throw new UnauthorizedError();
	if (roles && !roles.includes(admin.role)) throw new ForbiddenError();
	return admin;
}

export async function getAdminOrNull() {
	return currentAdmin();
}
