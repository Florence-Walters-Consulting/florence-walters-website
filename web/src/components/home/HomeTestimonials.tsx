import { getTestimonials } from '@/db/queries/content';
import { imageUrl } from '@/lib/images';
import { Testimonials } from './Testimonials';

/** Testimonials marked "shown" in the admin. The section hides itself when there are none. */
export async function HomeTestimonials() {
	const rows = await getTestimonials();
	if (rows.length === 0) return null;
	// Admin-authored text may contain HTML from the old editor: show it as plain text.
	const text = (s: string) => s.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
	return <Testimonials items={rows.map((r) => ({ id: r.id, name: r.name, occupation: r.occupation, body: text(r.body), photo: r.picture ? imageUrl('testimonials', r.picture) : '' }))} />;
}
