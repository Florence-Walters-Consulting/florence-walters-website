'use server';

import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { deleteService, getService, insertService, serviceSlugTaken, updateService } from '@/db/admin/services';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { hasContent, optionalRowId, optionalText, rowId, text } from '@/lib/admin/schemas';
import { sanitizeRich } from '@/lib/admin/sanitize';
import { makeSlug, uniqueSlug } from '@/lib/admin/slug';
import { isUpload, removeImage, removeUnusedEmbedded, saveImage } from '@/lib/admin/uploads';

const schema = z.object({
	id: optionalRowId,
	heading: text('Heading', 300),
	preamble: text('Preamble', 2000),
	body: z.string().max(500_000, 'The body is too long.'),
	tag1: optionalText('Tag 1', 100),
	tag2: optionalText('Tag 2', 100),
	tag3: optionalText('Tag 3', 100),
	tag4: optionalText('Tag 4', 100),
});

const done = () => refresh('/admin/services', 'services');

export async function saveService(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async () => {
		const input = parseForm(schema, formData);
		const body = sanitizeRich(input.body);
		if (!hasContent(body)) throw new UserError('Body is required.');
		const base = makeSlug(input.heading);
		if (!base) throw new UserError('The heading needs at least one letter or number.');
		const slug = await uniqueSlug(base, (s) => serviceSlugTaken(s, input.id));
		const file = formData.get('image');
		const common = { heading: input.heading, slug, preamble: input.preamble, body, tag1: input.tag1, tag2: input.tag2, tag3: input.tag3, tag4: input.tag4 };

		if (input.id === undefined) {
			if (!isUpload(file)) throw new UserError('Please choose an image.');
			const picture = await saveImage(file, 'services', { kind: 'original' });
			try {
				await insertService({ ...common, uniqueId: randomBytes(5).toString('hex'), picture });
			} catch (error) {
				await removeImage('services', picture);
				throw error;
			}
			done();
			return 'Service added.';
		}

		const existing = await getService(input.id);
		if (!existing) throw new UserError('That service no longer exists.');
		const newPicture = isUpload(file) ? await saveImage(file, 'services', { kind: 'original' }) : undefined;
		try {
			await updateService(input.id, { ...common, picture: newPicture ?? existing.picture });
		} catch (error) {
			await removeImage('services', newPicture);
			throw error;
		}
		if (newPicture) await removeImage('services', existing.picture);
		await removeUnusedEmbedded(existing.body, body);
		done();
		return 'Service updated.';
	});
}

export async function deleteServiceAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		const existing = await getService(rowId.parse(id));
		if (!existing) throw new UserError('That service no longer exists.');
		await deleteService(existing.id);
		await removeImage('services', existing.picture);
		await removeUnusedEmbedded(existing.body);
		done();
		return 'Service deleted.';
	});
}
