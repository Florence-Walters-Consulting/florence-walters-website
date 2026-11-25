'use server';

import { z } from 'zod';
import { deletePartner, getPartner, insertPartner, updatePartner } from '@/db/admin/simple';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { optionalRowId, rowId, text } from '@/lib/admin/schemas';
import { isUpload, removeImage, saveImage } from '@/lib/admin/uploads';

const schema = z.object({
	id: optionalRowId,
	name: text('Name', 100),
	display: z.enum(['Yes', 'No'], { message: 'Please choose whether to show it.' }),
});
const done = () => refresh('/admin/partners', 'partners');

export async function savePartner(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async () => {
		const { id, ...values } = parseForm(schema, formData);
		const file = formData.get('image');
		if (id === undefined) {
			if (!isUpload(file)) throw new UserError('Please choose an image.');
			const picture = await saveImage(file, 'partners', { kind: 'original' });
			try {
				await insertPartner(picture, values);
			} catch (error) {
				await removeImage('partners', picture);
				throw error;
			}
			done();
			return 'Logo added.';
		}
		const existing = await getPartner(id);
		if (!existing) throw new UserError('That logo no longer exists.');
		const newPicture = isUpload(file) ? await saveImage(file, 'partners', { kind: 'original' }) : undefined;
		try {
			await updatePartner(id, { ...values, picture: newPicture ?? existing.picture });
		} catch (error) {
			await removeImage('partners', newPicture);
			throw error;
		}
		if (newPicture) await removeImage('partners', existing.picture);
		done();
		return 'Logo updated.';
	});
}

export async function deletePartnerAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		const existing = await getPartner(rowId.parse(id));
		if (!existing) throw new UserError('That logo no longer exists.');
		await deletePartner(existing.id);
		await removeImage('partners', existing.picture);
		done();
		return 'Logo deleted.';
	});
}
