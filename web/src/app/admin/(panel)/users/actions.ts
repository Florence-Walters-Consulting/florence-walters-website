'use server';

import { z } from 'zod';
import { countAdmins, deleteAdmin, getAdminById, insertAdmin, setAdminPasswordHash, updateAdmin, usernameTaken } from '@/db/admin/admins';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { optionalRowId, rowId, text } from '@/lib/admin/schemas';
import { hashPassword } from '@/lib/auth/password';
import { toRole } from '@/lib/auth/roles';

const ONLY = ['admin' as const];
const role = z.enum(['admin', 'editor'], { message: 'Please choose a role.' });
const password = z.string().min(10, 'The password must be at least 10 characters.').max(200, 'The password is too long.');
const username = z.string().trim().toLowerCase().regex(/^[a-z0-9._-]{3,50}$/, 'Usernames use 3 to 50 letters, numbers, dots, dashes or underscores.');

const schema = z.object({
	id: optionalRowId,
	name: text('Name', 50),
	email: z.string().trim().toLowerCase().email('Please enter a valid email address.').max(254),
	username: username.optional(),
	role,
	password: z.string().default(''),
});
const done = () => refresh('/admin/users');

export async function saveUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async (me) => {
		const input = parseForm(schema, formData);
		const values = { name: input.name, email: input.email, adminType: input.role };

		if (input.id === undefined) {
			if (!input.username) throw new UserError('Please choose a username.');
			if (await usernameTaken(input.username)) throw new UserError('That username is already taken.');
			const pw = password.safeParse(input.password);
			if (!pw.success) throw new UserError(pw.error.issues[0].message);
			await insertAdmin({ ...values, username: input.username, password: await hashPassword(pw.data) });
			done();
			return 'User added. Share the password with them securely.';
		}

		const existing = await getAdminById(input.id);
		if (!existing) throw new UserError('That user no longer exists.');
		// Never leave the site without someone who can manage users.
		if (toRole(existing.adminType) === 'admin' && input.role === 'editor') {
			if (existing.id === me.id) throw new UserError('You cannot change your own role to Editor. Ask another admin to do it.');
			if ((await countAdmins()) <= 1) throw new UserError('There must always be at least one admin.');
		}
		await updateAdmin(input.id, values);
		if (input.password) {
			const pw = password.safeParse(input.password);
			if (!pw.success) throw new UserError(pw.error.issues[0].message);
			await setAdminPasswordHash(input.id, await hashPassword(pw.data));
		}
		done();
		return input.password ? 'User updated and password reset.' : 'User updated.';
	}, ONLY);
}

export async function deleteUserAction(id: number): Promise<ActionState> {
	return runAdminAction(async (me) => {
		const existing = await getAdminById(rowId.parse(id));
		if (!existing) throw new UserError('That user no longer exists.');
		if (existing.id === me.id) throw new UserError('You cannot delete your own account.');
		if (toRole(existing.adminType) === 'admin' && (await countAdmins()) <= 1) throw new UserError('There must always be at least one admin.');
		await deleteAdmin(existing.id);
		done();
		return 'User deleted.';
	}, ONLY);
}
