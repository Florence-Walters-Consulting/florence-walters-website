'use server';

import { z } from 'zod';
import { deleteFaq, getFaq, insertFaq, updateFaq } from '@/db/admin/simple';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { hasContent, optionalRowId, rowId, text } from '@/lib/admin/schemas';
import { sanitizeRich } from '@/lib/admin/sanitize';
import { removeUnusedEmbedded } from '@/lib/admin/uploads';

const schema = z.object({ id: optionalRowId, question: text('Question', 1000), body: z.string().max(100_000, 'The answer is too long.') });
const done = () => refresh('/admin/faqs', 'faqs');

export async function saveFaq(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async () => {
		const input = parseForm(schema, formData);
		const body = sanitizeRich(input.body);
		if (!hasContent(body)) throw new UserError('Answer is required.');
		if (input.id === undefined) {
			await insertFaq({ question: input.question, body });
			done();
			return 'FAQ added.';
		}
		const existing = await getFaq(input.id);
		if (!existing) throw new UserError('That FAQ no longer exists.');
		await updateFaq(input.id, { question: input.question, body });
		await removeUnusedEmbedded(existing.body, body);
		done();
		return 'FAQ updated.';
	});
}

export async function deleteFaqAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		const existing = await getFaq(rowId.parse(id));
		if (!existing) throw new UserError('That FAQ no longer exists.');
		await deleteFaq(existing.id);
		await removeUnusedEmbedded(existing.body);
		done();
		return 'FAQ deleted.';
	});
}
