'use server';

import { z } from 'zod';
import { deleteSlide, getSlide, insertSlide, updateSlide } from '@/db/admin/simple';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { optionalRowId, rowId } from '@/lib/admin/schemas';
import { sanitizeInline } from '@/lib/admin/sanitize';
import { isUpload, removeImage, saveImage } from '@/lib/admin/uploads';

// Heading and paragraph may contain simple inline HTML such as <b>…</b> (the public hero renders it).
const schema = z.object({
	id: optionalRowId,
	heading: z.string().trim().min(1, 'Heading is required.').max(600, 'Heading is too long.'),
	paragraph: z.string().trim().min(1, 'Paragraph is required.').max(5000, 'Paragraph is too long.'),
});
const done = () => refresh('/admin/home-slider', 'slides');

export async function saveSlide(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async () => {
		const input = parseForm(schema, formData);
		const heading = sanitizeInline(input.heading);
		const paragraph = sanitizeInline(input.paragraph);
		if (heading.length > 150) throw new UserError('Heading is too long (maximum 150 characters including formatting).');
		const file = formData.get('image');

		if (input.id === undefined) {
			if (!isUpload(file)) throw new UserError('Please choose an image.');
			const picture = await saveImage(file, 'home_background', { kind: 'original' });
			try {
				await insertSlide({ heading, paragraph, picture });
			} catch (error) {
				await removeImage('home_background', picture);
				throw error;
			}
			done();
			return 'Slide added.';
		}
		const existing = await getSlide(input.id);
		if (!existing) throw new UserError('That slide no longer exists.');
		const newPicture = isUpload(file) ? await saveImage(file, 'home_background', { kind: 'original' }) : undefined;
		try {
			await updateSlide(input.id, { heading, paragraph, picture: newPicture ?? existing.picture });
		} catch (error) {
			await removeImage('home_background', newPicture);
			throw error;
		}
		if (newPicture) await removeImage('home_background', existing.picture);
		done();
		return 'Slide updated.';
	});
}

export async function deleteSlideAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		const existing = await getSlide(rowId.parse(id));
		if (!existing) throw new UserError('That slide no longer exists.');
		await deleteSlide(existing.id);
		await removeImage('home_background', existing.picture);
		done();
		return 'Slide deleted.';
	});
}
