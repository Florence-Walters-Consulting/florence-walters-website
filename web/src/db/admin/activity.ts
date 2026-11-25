import 'server-only';
import { count, desc, gte, ne } from 'drizzle-orm';
import { db, schema } from '@/db';

const { adminActivity } = schema;

export type ActivityKind = 'create' | 'update' | 'delete' | 'auth' | 'other';

/** The wording of an action's success message tells us what kind of change it was. */
export function kindOf(message: string): ActivityKind {
	const m = message.toLowerCase();
	if (/\b(added|created|published|uploaded)\b/.test(m)) return 'create';
	if (/\b(deleted|removed)\b/.test(m)) return 'delete';
	if (/\b(updated|saved|changed|reset|moved)\b/.test(m)) return 'update';
	return 'other';
}

/** Records a change. Never throws: a logging problem must not make a real save look like it failed. */
export async function logActivity(admin: { id: number; name: string }, message: string, kind: ActivityKind = kindOf(message)) {
	try {
		await db.insert(adminActivity).values({ adminId: admin.id, adminName: admin.name.slice(0, 50), kind, message: message.slice(0, 255) });
	} catch (error) {
		console.error('Could not record admin activity:', error);
	}
}

/** Latest changes, newest first. Sign-ins are only included when `includeAuth` is true (admins). */
export const getRecentActivity = (limit: number, includeAuth: boolean) =>
	db
		.select({ id: adminActivity.id, adminName: adminActivity.adminName, kind: adminActivity.kind, message: adminActivity.message, createdAt: adminActivity.createdAt })
		.from(adminActivity)
		.where(includeAuth ? undefined : ne(adminActivity.kind, 'auth'))
		.orderBy(desc(adminActivity.id))
		.limit(limit);

export async function countChangesSince(since: Date) {
	const [row] = await db.select({ total: count() }).from(adminActivity).where(gte(adminActivity.createdAt, since));
	return row.total;
}
