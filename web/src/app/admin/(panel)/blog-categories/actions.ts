'use server';

import { z } from 'zod';
import { countPostsInCategory, deleteCategory, getCategory, insertCategory, updateCategory } from '@/db/admin/blog';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { optionalRowId, rowId, text } from '@/lib/admin/schemas';

const schema = z.object({ id: optionalRowId, category_name: text('Category name', 100) });
const done = () => refresh('/admin/blog-categories', 'blog');

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async () => {
		const input = parseForm(schema, formData);
		if (input.id === undefined) {
			await insertCategory(input.category_name);
			done();
			return 'Category added.';
		}
		if (!(await getCategory(input.id))) throw new UserError('That category no longer exists.');
		await updateCategory(input.id, input.category_name);
		done();
		return 'Category updated.';
	});
}

export async function deleteCategoryAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		const categoryId = rowId.parse(id);
		const posts = await countPostsInCategory(categoryId);
		// The legacy admin allowed this and left the posts without a category name.
		if (posts > 0) throw new UserError(`${posts} blog post${posts === 1 ? ' uses' : 's use'} this category. Move or delete them first.`);
		await deleteCategory(categoryId);
		done();
		return 'Category deleted.';
	});
}
