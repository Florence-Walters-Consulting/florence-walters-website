import 'server-only';
import { asc, desc, eq } from 'drizzle-orm';
import { db, schema } from '@/db';

const { workHighlights: w } = schema;

export type WorkValues = {
	code: string;
	kind: string;
	body: string;
	title: string;
	logo: string;
	certificate: string;
	category: string;
	summary: string;
	problem: string;
	result: string;
	duration: string;
	scope: { t: string; d: string }[];
	receive: string[];
	serviceSlug: string;
	status: 'published' | 'draft';
};

/** All highlights in public display order (drafts included). */
export const listWork = () => db.select().from(w).orderBy(asc(w.sortOrder), desc(w.id));

export async function getWork(id: number) {
	const [row] = await db.select().from(w).where(eq(w.id, id)).limit(1);
	return row;
}

export async function slugTaken(slug: string) {
	const rows = await db.select({ id: w.id }).from(w).where(eq(w.slug, slug)).limit(1);
	return rows.length > 0;
}

/** New highlights go to the top of the list. */
export async function insertWork(slug: string, v: WorkValues) {
	const [first] = await db.select({ s: w.sortOrder }).from(w).orderBy(asc(w.sortOrder)).limit(1);
	await db.insert(w).values({ ...v, slug, sortOrder: (first?.s ?? 1) - 1 });
}

export const updateWork = (id: number, v: WorkValues) => db.update(w).set(v).where(eq(w.id, id));
export const deleteWork = (id: number) => db.delete(w).where(eq(w.id, id));

/** Moves one step up or down in the display order. Re-numbers the list first so ties cannot confuse it. */
export async function moveWork(id: number, dir: 'up' | 'down') {
	const rows = await db.select({ id: w.id }).from(w).orderBy(asc(w.sortOrder), desc(w.id));
	const i = rows.findIndex((r) => r.id === id);
	const j = dir === 'up' ? i - 1 : i + 1;
	if (i === -1 || j < 0 || j >= rows.length) return false;
	[rows[i], rows[j]] = [rows[j], rows[i]];
	for (let n = 0; n < rows.length; n++) await db.update(w).set({ sortOrder: n + 1 }).where(eq(w.id, rows[n].id));
	return true;
}

export const setWorkStatus = (id: number, status: 'published' | 'draft') => db.update(w).set({ status }).where(eq(w.id, id));
export async function countWork() {
	const rows = await db.select({ id: w.id }).from(w);
	return rows.length;
}
