'use server';

import { z } from 'zod';
import { getGeneralImage, setGeneralImageFile } from '@/db/admin/simple';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { rowId } from '@/lib/admin/schemas';
import { isUpload, removeImage, saveImage } from '@/lib/admin/uploads';

const schema = z.object({ id: rowId });

// The slots (Home 1, About 1, headers...) are fixed by the site's design; only the file changes.
export async function replaceGeneralImage(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async () => {
		const { id } = parseForm(schema, formData);
		const existing = await getGeneralImage(id);
		if (!existing) throw new UserError('That image slot no longer exists.');
		const file = formData.get('image');
		if (!isUpload(file)) throw new UserError('Please choose the new image.');
		const name = await saveImage(file, 'general', { kind: 'original' });
		try {
			await setGeneralImageFile(id, name);
		} catch (error) {
			await removeImage('general', name);
			throw error;
		}
		await removeImage('general', existing.size);
		refresh('/admin/other-images', 'general-images');
		return 'Image replaced.';
	});
}
