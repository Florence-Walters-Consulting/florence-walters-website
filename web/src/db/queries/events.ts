import { cacheLife, cacheTag } from 'next/cache';
import { and, asc, eq, gte } from 'drizzle-orm';
import { db, schema } from '@/db';
import { eventImageUrl, nowWat, type PublicEvent } from '@/lib/events';

const { events: e } = schema;

type Row = typeof e.$inferSelect;
const toPublic = (r: Row): PublicEvent => ({
	slug: r.slug,
	title: r.title,
	summary: r.summary,
	body: r.body,
	bullets: r.bullets,
	startsAt: r.startsAt,
	endsAt: r.endsAt,
	venue: r.venue,
	registerUrl: r.registerUrl,
	hashtags: r.hashtags,
	imageUrl: eventImageUrl(r.image),
});

/** Published events that have not ended yet, soonest first. Short cache so an event disappears soon after it ends. */
export async function getUpcomingEvents(): Promise<PublicEvent[]> {
	'use cache';
	cacheLife('minutes');
	cacheTag('events');
	const rows = await db.select().from(e).where(and(eq(e.status, 'published'), gte(e.endsAt, nowWat()))).orderBy(asc(e.startsAt));
	return rows.map(toPublic);
}

/** One published event (past or upcoming), for its own page. */
export async function getEventBySlug(slug: string): Promise<PublicEvent | undefined> {
	'use cache';
	cacheLife('minutes');
	cacheTag('events');
	const [row] = await db.select().from(e).where(and(eq(e.slug, slug), eq(e.status, 'published'))).limit(1);
	return row ? toPublic(row) : undefined;
}

export async function getAllEventSlugs() {
	'use cache';
	cacheLife('minutes');
	cacheTag('events');
	return db.select({ slug: e.slug }).from(e).where(eq(e.status, 'published'));
}
