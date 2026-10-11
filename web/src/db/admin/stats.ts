import 'server-only';
import { count, eq, type SQL } from 'drizzle-orm';
import type { MySqlTable } from 'drizzle-orm/mysql-core';
import { db, schema } from '@/db';

async function total(table: MySqlTable, where?: SQL) {
	const [row] = await db.select({ total: count() }).from(table).where(where);
	return row.total;
}

/** Row counts for the dashboard cards. */
export async function getDashboardCounts() {
	const [slider, images, services, categories, posts, faqs, testimonials, team, partners, subscribers] = await Promise.all([
		total(schema.pictureSlider),
		total(schema.generalImages, eq(schema.generalImages.display, 'Yes')),
		total(schema.services),
		total(schema.blogCategories),
		total(schema.blog),
		total(schema.faqs),
		total(schema.testimonials),
		total(schema.team),
		total(schema.partners),
		total(schema.emailSubscribers),
	]);
	return { slider, images, services, categories, posts, faqs, testimonials, team, partners, subscribers };
}
