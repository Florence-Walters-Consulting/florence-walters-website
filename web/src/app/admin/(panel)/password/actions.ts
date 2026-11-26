'use server';

import { z } from 'zod';
import { getAdminPasswordHash, setAdminPasswordHash } from '@/db/admin/admins';
import { parseForm, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { isRateLimited, recordHit } from '@/lib/rate-limit';

const schema = z.object({
	current: z.string().min(1, 'Please enter your current password.').max(200),
	next: z.string().min(10, 'The new password must be at least 10 characters.').max(200, 'The new password is too long.'),
	confirm: z.string(),
});

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async (admin) => {
		const input = parseForm(schema, formData);
		if (input.next !== input.confirm) throw new UserError('The new passwords do not match.');
		if (input.next === input.current) throw new UserError('The new password must be different from the current one.');

		// A stolen session must not be able to guess the current password without limit (failures only).
		const bucket = `password:fail:${admin.id}`;
		if (isRateLimited(bucket, 5, 600)) throw new UserError('Too many attempts. Please wait a few minutes and try again.');

		if (!(await verifyPassword(input.current, await getAdminPasswordHash(admin.id)))) {
			recordHit(bucket);
			throw new UserError('Your current password is incorrect.');
		}
		await setAdminPasswordHash(admin.id, await hashPassword(input.next));
		return 'Password updated.';
	});
}
