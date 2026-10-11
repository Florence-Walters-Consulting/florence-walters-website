'use server';

import { z } from 'zod';
import { deleteTeamMember, getTeamMember, insertTeamMember, updateTeamMember } from '@/db/admin/simple';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { optionalRowId, rowId, text } from '@/lib/admin/schemas';
import { isUpload, removeImage, saveImage } from '@/lib/admin/uploads';

const schema = z.object({
	id: optionalRowId,
	name: text('Name', 100),
	position: text('Position', 100),
	// Shown as a LinkedIn button when present. Only web addresses are accepted.
	link: z.string().trim().max(500, 'The link is too long.').refine((v) => v === '' || /^https?:\/\/\S+$/i.test(v), 'The link must start with http:// or https://.').default(''),
});
const done = () => refresh('/admin/team', 'team');

export async function saveTeamMember(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async () => {
		const input = parseForm(schema, formData);
		const file = formData.get('image');
		if (input.id === undefined) {
			if (!isUpload(file)) throw new UserError('Please choose an image.');
			const picture = await saveImage(file, 'team', { kind: 'original' });
			try {
				await insertTeamMember({ name: input.name, position: input.position, link: input.link, picture });
			} catch (error) {
				await removeImage('team', picture);
				throw error;
			}
			done();
			return 'Team member added.';
		}
		const existing = await getTeamMember(input.id);
		if (!existing) throw new UserError('That team member no longer exists.');
		const newPicture = isUpload(file) ? await saveImage(file, 'team', { kind: 'original' }) : undefined;
		try {
			await updateTeamMember(input.id, { name: input.name, position: input.position, link: input.link, picture: newPicture ?? existing.picture });
		} catch (error) {
			await removeImage('team', newPicture);
			throw error;
		}
		if (newPicture) await removeImage('team', existing.picture);
		done();
		return 'Team member updated.';
	});
}

export async function deleteTeamMemberAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		const existing = await getTeamMember(rowId.parse(id));
		if (!existing) throw new UserError('That team member no longer exists.');
		await deleteTeamMember(existing.id);
		await removeImage('team', existing.picture);
		done();
		return 'Team member deleted.';
	});
}
