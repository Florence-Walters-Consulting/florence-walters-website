'use server';

import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { blogSlugTaken, deletePost, getCategory, getPost, insertPost, updatePost } from '@/db/admin/blog';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { hasContent, optionalRowId, rowId, text, yesNo } from '@/lib/admin/schemas';
import { sanitizeRich } from '@/lib/admin/sanitize';
import { makeSlug, uniqueSlug } from '@/lib/admin/slug';
import { isUpload, removeImage, removeUnusedEmbedded, saveImage } from '@/lib/admin/uploads';

const schema = z.object({
	id: optionalRowId,
	heading: text('Heading', 300),
	category: rowId.catch(0),
	preamble: text('Preamble', 2000),
	body: z.string().max(500_000, 'The body is too long.'),
	featured: yesNo,
	comments_allowed: yesNo,
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a valid date.'),
});

const PATHS = ['/admin/blog'] as const;
const done = () => refresh(PATHS[0], 'blog');

export async function savePost(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async () => {
		const input = parseForm(schema, formData);
		if (!input.category || !(await getCategory(input.category))) throw new UserError('Please choose a category.');
		const body = sanitizeRich(input.body);
		if (!hasContent(body)) throw new UserError('Body is required.');
		const base = makeSlug(input.heading);
		if (!base) throw new UserError('The heading needs at least one letter or number.');
		const slug = await uniqueSlug(base, (s) => blogSlugTaken(s, input.id));
		const file = formData.get('image');

		const common = {
			heading: input.heading,
			slug,
			category: input.category,
			preamble: input.preamble,
			body,
			featured: input.featured,
			date: input.date,
			// Same value the legacy admin stored in `keywords`.
			keywords: `${input.heading} ${input.preamble} ${body}`,
			commentsAllowed: input.comments_allowed,
		};

		if (input.id === undefined) {
			if (!isUpload(file)) throw new UserError('Please choose an image.');
			const picture = await saveImage(file, 'blog', { kind: 'exact', width: 800, height: 600 });
			try {
				await insertPost({ ...common, blogId: randomBytes(5).toString('hex'), picture });
			} catch (error) {
				await removeImage('blog', picture);
				throw error;
			}
			done();
			return 'Post added.';
		}

		const existing = await getPost(input.id);
		if (!existing) throw new UserError('That post no longer exists.');
		const newPicture = isUpload(file) ? await saveImage(file, 'blog', { kind: 'exact', width: 800, height: 600 }) : undefined;
		try {
			await updatePost(input.id, { ...common, picture: newPicture ?? existing.picture });
		} catch (error) {
			await removeImage('blog', newPicture);
			throw error;
		}
		// Only after the row points at the new files are the old ones removed.
		if (newPicture) await removeImage('blog', existing.picture);
		await removeUnusedEmbedded(existing.body, body);
		done();
		return 'Post updated.';
	});
}

export async function deletePostAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		const existing = await getPost(rowId.parse(id));
		if (!existing) throw new UserError('That post no longer exists.');
		await deletePost(existing.id);
		await removeImage('blog', existing.picture);
		await removeUnusedEmbedded(existing.body);
		done();
		return 'Post deleted.';
	});
}
