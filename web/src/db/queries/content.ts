import { cacheLife, cacheTag } from 'next/cache';
import { asc, eq } from 'drizzle-orm';
import { db, schema } from '@/db';

/** Port of api/faqs. */
export async function getFaqs() {
	'use cache';
	cacheLife('hours');
	cacheTag('faqs');
	return db
		.select({ id: schema.faqs.id, question: schema.faqs.question, body: schema.faqs.body })
		.from(schema.faqs)
		.orderBy(asc(schema.faqs.id));
}

/**
 * Port of api/partners. The PHP used ORDER BY RAND() on every request; the order is now
 * shuffled in the browser (see Partners.tsx) because this result is cached.
 */
export async function getPartners() {
	'use cache';
	cacheLife('hours');
	cacheTag('partners');
	return db
		.select({ id: schema.partners.id, picture: schema.partners.picture, name: schema.partners.name })
		.from(schema.partners)
		.where(eq(schema.partners.display, 'Yes'))
		.orderBy(asc(schema.partners.id));
}

/** Port of api/testimonials (visible rows only). Order is shuffled by the caller. */
export async function getTestimonials() {
	'use cache';
	cacheLife('hours');
	cacheTag('testimonials');
	return db
		.select({
			id: schema.testimonials.id,
			name: schema.testimonials.name,
			occupation: schema.testimonials.occupation,
			body: schema.testimonials.body,
			picture: schema.testimonials.picture,
		})
		.from(schema.testimonials)
		.where(eq(schema.testimonials.display, 'Yes'));
}
