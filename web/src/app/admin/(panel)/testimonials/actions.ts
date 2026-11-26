'use server';

import { z } from 'zod';
import { deleteTestimonial, getTestimonial, insertTestimonial, updateTestimonial } from '@/db/admin/simple';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { hasContent, optionalRowId, rowId, text, yesNo } from '@/lib/admin/schemas';
import { sanitizeRich } from '@/lib/admin/sanitize';
import { isUpload, removeImage, removeUnusedEmbedded, saveImage } from '@/lib/admin/uploads';

const schema = z.object({
	id: optionalRowId,
	name: text('Name', 100),
	occupation: text('Occupation', 100),
	body: z.string().max(100_000, 'The comment is too long.'),
	display: yesNo.default('Yes'),
});
const done = () => refresh('/admin/testimonials', 'testimonials');

export async function saveTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async () => {
		const input = parseForm(schema, formData);
		const body = sanitizeRich(input.body);
		if (!hasContent(body)) throw new UserError('Comment is required.');
		const file = formData.get('image');
		const values = { name: input.name, occupation: input.occupation, body, display: input.display };

		if (input.id === undefined) {
			// The picture is optional for testimonials.
			const picture = isUpload(file) ? await saveImage(file, 'testimonials', { kind: 'original' }) : '';
			try {
				await insertTestimonial({ ...values, picture });
			} catch (error) {
				await removeImage('testimonials', picture);
				throw error;
			}
			done();
			return 'Testimonial added.';
		}
		const existing = await getTestimonial(input.id);
		if (!existing) throw new UserError('That testimonial no longer exists.');
		const newPicture = isUpload(file) ? await saveImage(file, 'testimonials', { kind: 'original' }) : undefined;
		try {
			await updateTestimonial(input.id, { ...values, picture: newPicture ?? existing.picture });
		} catch (error) {
			await removeImage('testimonials', newPicture);
			throw error;
		}
		if (newPicture) await removeImage('testimonials', existing.picture);
		await removeUnusedEmbedded(existing.body, body);
		done();
		return 'Testimonial updated.';
	});
}

export async function deleteTestimonialAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		const existing = await getTestimonial(rowId.parse(id));
		if (!existing) throw new UserError('That testimonial no longer exists.');
		await deleteTestimonial(existing.id);
		await removeImage('testimonials', existing.picture);
		await removeUnusedEmbedded(existing.body);
		done();
		return 'Testimonial deleted.';
	});
}
