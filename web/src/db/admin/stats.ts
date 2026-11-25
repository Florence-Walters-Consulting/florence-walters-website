import 'server-only';
import { count, desc, eq, ne, type SQL } from 'drizzle-orm';
import type { MySqlTable } from 'drizzle-orm/mysql-core';
import { db, schema } from '@/db';

async function total(table: MySqlTable, where?: SQL) {
	const [row] = await db.select({ total: count() }).from(table).where(where);
	return row.total;
}

/** Row counts for the dashboard tiles. */
export async function getDashboardCounts() {
	const [posts, categories, faqs, testimonials, partners, subscribers, work] = await Promise.all([
		total(schema.blog),
		total(schema.blogCategories),
		total(schema.faqs),
		total(schema.testimonials),
		total(schema.partners),
		total(schema.emailSubscribers),
		total(schema.workHighlights),
	]);
	return { posts, categories, faqs, testimonials, partners, subscribers, work };
}

/** Latest posts for the dashboard list. */
export const getRecentPosts = () =>
	db
		.select({ id: schema.blog.id, heading: schema.blog.heading, date: schema.blog.date, picture: schema.blog.picture, category: schema.blogCategories.categoryName, featured: schema.blog.featured, status: schema.blog.status })
		.from(schema.blog)
		.leftJoin(schema.blogCategories, eq(schema.blogCategories.id, schema.blog.category))
		.orderBy(desc(schema.blog.id))
		.limit(4);

/** Latest subscribers (admins only). */
export const getRecentSubscribers = () =>
	db.select({ id: schema.emailSubscribers.id, email: schema.emailSubscribers.email, date: schema.emailSubscribers.date }).from(schema.emailSubscribers).orderBy(desc(schema.emailSubscribers.id)).limit(5);

/** Small checks that point the admin at content worth a look. */
export async function getContentChecks() {
	const [hiddenTestimonials, drafts, [lastPost]] = await Promise.all([
		total(schema.testimonials, ne(schema.testimonials.display, 'Yes')),
		total(schema.blog, eq(schema.blog.status, 'draft')),
		db.select({ date: schema.blog.date }).from(schema.blog).where(eq(schema.blog.status, 'published')).orderBy(desc(schema.blog.date)).limit(1),
	]);
	return { hiddenTestimonials, drafts, lastPostDate: lastPost?.date ?? null };
}
