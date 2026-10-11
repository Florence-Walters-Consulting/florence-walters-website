'use server';

import { z } from 'zod';
import { deletePartner, getPartner, insertPartner, updatePartner } from '@/db/admin/simple';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { optionalRowId, rowId } from '@/lib/admin/schemas';
import { isUpload, removeImage, saveImage } from '@/lib/admin/uploads';

const schema = z.object({ id: optionalRowId });
const done = () => refresh('/admin/partners', 'partners');

export async function savePartner(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async () => {
		const { id } = parseForm(schema, formData);
		const file = formData.get('image');
		if (id === undefined) {
			if (!isUpload(file)) throw new UserError('Please choose an image.');
			const picture = await saveImage(file, 'partners', { kind: 'original' });
			try {
				await insertPartner(picture);
			} catch (error) {
				await removeImage('partners', picture);
				throw error;
			}
			done();
			return 'Logo added.';
		}
		const existing = await getPartner(id);
		if (!existing) throw new UserError('That logo no longer exists.');
		if (!isUpload(file)) throw new UserError('Please choose the new image.');
		const picture = await saveImage(file, 'partners', { kind: 'original' });
		try {
			await updatePartner(id, picture);
		} catch (error) {
			await removeImage('partners', picture);
			throw error;
		}
		await removeImage('partners', existing.picture);
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
