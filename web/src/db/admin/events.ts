import 'server-only';
import { and, desc, eq, ne } from 'drizzle-orm';
import { db, schema } from '@/db';

const { events: e } = schema;

export type EventValues = {
	title: string;
	summary: string;
	body: string;
	bullets: string[];
	startsAt: string;
	endsAt: string;
	venue: string;
	registerUrl: string;
	hashtags: string;
	image: string;
	status: 'published' | 'draft';
};

/** Newest first (by start time), drafts included. */
export const listEvents = () => db.select().from(e).orderBy(desc(e.startsAt));

export async function getEvent(id: number) {
	const [row] = await db.select().from(e).where(eq(e.id, id)).limit(1);
	return row;
}

export async function eventSlugTaken(slug: string, exceptId?: number) {
	const rows = await db.select({ id: e.id }).from(e).where(exceptId === undefined ? eq(e.slug, slug) : and(eq(e.slug, slug), ne(e.id, exceptId))).limit(1);
	return rows.length > 0;
}

export const insertEvent = (slug: string, v: EventValues) => db.insert(e).values({ ...v, slug });
export const updateEvent = (id: number, v: EventValues) => db.update(e).set(v).where(eq(e.id, id));
export const deleteEvent = (id: number) => db.delete(e).where(eq(e.id, id));
export async function countEvents() {
	const rows = await db.select({ id: e.id }).from(e);
	return rows.length;
}
