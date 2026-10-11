import { z } from 'zod';

/** Required text, trimmed, with a friendly message naming the field. */
export const text = (label: string, max: number) =>
	z.string().trim().min(1, `${label} is required.`).max(max, `${label} is too long (maximum ${max} characters).`);

/** Optional text: may be empty. */
export const optionalText = (label: string, max: number) =>
	z.string().trim().max(max, `${label} is too long (maximum ${max} characters).`).default('');

export const rowId = z.coerce.number().int().positive();

/** `id` field of an edit form; absent or empty on create. */
export const optionalRowId = z.preprocess((v) => (v === '' || v === undefined ? undefined : v), rowId.optional());

export const yesNo = z.enum(['Yes', 'No'], { message: 'Please choose Yes or No.' });

/** True if the HTML has visible text or an image (an empty editor submits ''). */
export const hasContent = (html: string) => /<img\b/i.test(html) || html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length > 0;
