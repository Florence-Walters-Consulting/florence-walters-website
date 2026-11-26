import 'server-only';
import { asc, count, eq, ne } from 'drizzle-orm';
import { db, schema } from '@/db';

const { admin } = schema;

export async function findAdminByUsername(username: string) {
	const [row] = await db
		.select({ id: admin.id, name: admin.name, username: admin.username, password: admin.password })
		.from(admin)
		.where(eq(admin.username, username))
		.limit(1);
	return row;
}

export async function getAdminPasswordHash(id: number) {
	const [row] = await db.select({ password: admin.password }).from(admin).where(eq(admin.id, id)).limit(1);
	return row?.password;
}

export async function setAdminPasswordHash(id: number, hash: string) {
	await db.update(admin).set({ password: hash }).where(eq(admin.id, id));
}

// ---- User management (admin role only; enforced in the Server Actions)
export type UserValues = { name: string; email: string; username: string; adminType: 'admin' | 'editor' };

export const listAdmins = () =>
	db
		.select({ id: admin.id, name: admin.name, email: admin.email, username: admin.username, adminType: admin.adminType })
		.from(admin)
		.orderBy(asc(admin.id));

export async function getAdminById(id: number) {
	const [row] = await db.select({ id: admin.id, name: admin.name, email: admin.email, username: admin.username, adminType: admin.adminType }).from(admin).where(eq(admin.id, id)).limit(1);
	return row;
}

export async function usernameTaken(username: string, exceptId?: number) {
	const rows = await db.select({ id: admin.id }).from(admin).where(eq(admin.username, username));
	return rows.some((r) => r.id !== exceptId);
}

export const insertAdmin = (v: UserValues & { password: string }) => db.insert(admin).values(v);
export const updateAdmin = (id: number, v: Omit<UserValues, 'username'>) => db.update(admin).set(v).where(eq(admin.id, id));
export const deleteAdmin = (id: number) => db.delete(admin).where(eq(admin.id, id));

/** How many accounts can currently manage users (anything that is not an editor). */
export async function countAdmins() {
	const [row] = await db.select({ total: count() }).from(admin).where(ne(admin.adminType, 'editor'));
	return row.total;
}
