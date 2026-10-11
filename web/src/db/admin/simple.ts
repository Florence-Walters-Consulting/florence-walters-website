import 'server-only';
import { asc, desc, eq } from 'drizzle-orm';
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

// ---- Team
export type TeamValues = { name: string; position: string; link: string; picture: string };
export const listTeam = () => db.select().from(schema.team).orderBy(asc(schema.team.id));
export async function getTeamMember(id: number) {
	const [row] = await db.select().from(schema.team).where(eq(schema.team.id, id)).limit(1);
	return row;
}
export const insertTeamMember = (v: TeamValues) => db.insert(schema.team).values(v);
export const updateTeamMember = (id: number, v: TeamValues) => db.update(schema.team).set(v).where(eq(schema.team.id, id));
export const deleteTeamMember = (id: number) => db.delete(schema.team).where(eq(schema.team.id, id));

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
export const insertPartner = (picture: string) => db.insert(schema.partners).values({ picture });
export const updatePartner = (id: number, picture: string) => db.update(schema.partners).set({ picture }).where(eq(schema.partners.id, id));
export const deletePartner = (id: number) => db.delete(schema.partners).where(eq(schema.partners.id, id));

// ---- Home slider
export type SlideValues = { heading: string; paragraph: string; picture: string };
export const listSlides = () => db.select().from(schema.pictureSlider).orderBy(asc(schema.pictureSlider.id));
export async function getSlide(id: number) {
	const [row] = await db.select().from(schema.pictureSlider).where(eq(schema.pictureSlider.id, id)).limit(1);
	return row;
}
export const insertSlide = (v: SlideValues) => db.insert(schema.pictureSlider).values(v);
export const updateSlide = (id: number, v: SlideValues) => db.update(schema.pictureSlider).set(v).where(eq(schema.pictureSlider.id, id));
export const deleteSlide = (id: number) => db.delete(schema.pictureSlider).where(eq(schema.pictureSlider.id, id));

// ---- Other images (fixed slots; only the file can be replaced)
export const listGeneralImages = () =>
	db
		.select()
		.from(schema.generalImages)
		.where(eq(schema.generalImages.display, 'Yes'))
		.orderBy(asc(schema.generalImages.photoOrder));
export async function getGeneralImage(id: number) {
	const [row] = await db.select().from(schema.generalImages).where(eq(schema.generalImages.id, id)).limit(1);
	return row;
}
export const setGeneralImageFile = (id: number, file: string) => db.update(schema.generalImages).set({ size: file }).where(eq(schema.generalImages.id, id));

// ---- Subscribers
export const listSubscribers = () => db.select().from(schema.emailSubscribers).orderBy(desc(schema.emailSubscribers.id));
export const deleteSubscriber = (id: number) => db.delete(schema.emailSubscribers).where(eq(schema.emailSubscribers.id, id));
