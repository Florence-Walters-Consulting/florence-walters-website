import 'server-only';
import { eq } from 'drizzle-orm';
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
