import { z } from 'zod';

/** PHP mb_strlen: length in Unicode code points. */
export const textLength = (value: string) => [...value].length;

/** Trimmed string; non-strings become "" (PHP: trim((string) ($data[$key] ?? ''))). */
export const trimmed = z.preprocess((v) => (v === null || v === undefined ? '' : typeof v === 'object' ? '' : String(v).trim()), z.string());

/** Required trimmed string with a max length (code points). Messages match the PHP API. */
export function field(
	max: number,
	{
		required = false,
		requiredMsg = 'Please complete all required fields.',
		tooLongMsg = 'One or more fields are too long.',
		lowercase = false,
	} = {},
) {
	return trimmed.transform((v) => (lowercase ? v.toLowerCase() : v)).superRefine((value, ctx) => {
		if (required && value === '') ctx.addIssue({ code: 'custom', message: requiredMsg });
		else if (textLength(value) > max) ctx.addIssue({ code: 'custom', message: tooLongMsg });
	});
}

export const emailField = z.string().email();

/** First issue message of a failed parse, so API errors read like the PHP ones. */
export function firstMessage(error: z.ZodError) {
	return error.issues[0]?.message ?? 'Invalid request.';
}
