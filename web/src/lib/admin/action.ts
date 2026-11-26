import 'server-only';
import { revalidatePath, updateTag } from 'next/cache';
import type { z } from 'zod';
import { ForbiddenError, requireAdminAction, UnauthorizedError, type AdminUser } from '@/lib/auth/dal';
import type { Role } from '@/lib/auth/roles';
import { logActivity } from '@/db/admin/activity';
import { UserError } from './errors';

/** What every admin Server Action returns. `null` is the initial state before any submit. */
export type ActionState = { ok: true; message: string } | { ok: false; error: string } | null;

/**
 * Wraps the body of an admin Server Action: checks the admin session first (server-side, on
 * every call), turns known errors into messages and hides unexpected ones.
 */
export async function runAdminAction(fn: (admin: AdminUser) => Promise<string>, roles?: Role[]): Promise<ActionState> {
	try {
		const admin = await requireAdminAction(roles);
		const message = await fn(admin);
		await logActivity(admin, message);
		return { ok: true, message };
	} catch (error) {
		if (error instanceof UnauthorizedError || error instanceof ForbiddenError || error instanceof UserError) return { ok: false, error: error.message };
		console.error('Admin action failed:', error);
		return { ok: false, error: 'Something went wrong. Please try again.' };
	}
}

/** Reads a FormData into a plain object (files excluded) and validates it with Zod. */
export function parseForm<S extends z.ZodType>(schema: S, formData: FormData): z.infer<S> {
	const raw: Record<string, string> = {};
	for (const [key, value] of formData.entries()) if (typeof value === 'string') raw[key] = value;
	const parsed = schema.safeParse(raw);
	if (!parsed.success) throw new UserError(parsed.error.issues[0]?.message ?? 'Please check the form.');
	return parsed.data;
}

/** Makes the public site (cached tags) and the admin page show the change straight away. */
export function refresh(adminPath: string, ...publicTags: string[]) {
	for (const tag of publicTags) updateTag(tag);
	revalidatePath(adminPath);
}
