import 'server-only';
import { asc, count, desc, eq, like } from 'drizzle-orm';
import { db, schema } from '@/db';

// ---- FAQs
export const listFaqs = () => db.select().from(schema.faqs).orderBy(asc(schema.faqs.id));
export async function getFaq(id: number) {
	const [row] = await db.select().from(schema.faqs).where(eq(schema.faqs.id, id)).limit(1);
	return row;
}
export const insertFaq = (v: { question: string; body: string }) => db.insert(schema.faqs).values(v);
export const updateFaq = (id: number, v: { question: string; body: string }) => db.update(schema.faqs).set(v).where(eq(schema.faqs.id, id));
export const deleteFaq = (id: number) => db.delete(schema.faqs).where(eq(schema.faqs.id, id));

// ---- Testimonials
export type TestimonialValues = { name: string; occupation: string; body: string; picture: string; display: string };
export const listTestimonials = () => db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.id));
export async function getTestimonial(id: number) {
	const [row] = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, id)).limit(1);
	return row;
}
export const insertTestimonial = (v: TestimonialValues) => db.insert(schema.testimonials).values(v);
export const updateTestimonial = (id: number, v: TestimonialValues) => db.update(schema.testimonials).set(v).where(eq(schema.testimonials.id, id));
export const deleteTestimonial = (id: number) => db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));

// ---- Partners
export const listPartners = () => db.select().from(schema.partners).orderBy(asc(schema.partners.id));
export async function getPartner(id: number) {
	const [row] = await db.select().from(schema.partners).where(eq(schema.partners.id, id)).limit(1);
	return row;
}
export type PartnerValues = { name: string; display: 'Yes' | 'No' };
export const insertPartner = (picture: string, v: PartnerValues) => db.insert(schema.partners).values({ picture, ...v });
export const updatePartner = (id: number, v: PartnerValues & { picture: string }) => db.update(schema.partners).set(v).where(eq(schema.partners.id, id));
export const deletePartner = (id: number) => db.delete(schema.partners).where(eq(schema.partners.id, id));

// ---- Subscribers
export async function listSubscribers(q: string, page: number, size: number) {
	const where = q ? like(schema.emailSubscribers.email, `%${q}%`) : undefined;
	const [{ total }] = await db.select({ total: count() }).from(schema.emailSubscribers).where(where);
	const rows = await db.select().from(schema.emailSubscribers).where(where).orderBy(desc(schema.emailSubscribers.id)).limit(size).offset((page - 1) * size);
	return { rows, total };
}
export const deleteSubscriber = (id: number) => db.delete(schema.emailSubscribers).where(eq(schema.emailSubscribers.id, id));
