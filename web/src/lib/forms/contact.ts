import { z } from 'zod';
import { emailField, field, firstMessage, textLength } from './text';

const CONTROL_CHARS = /[\r\n\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u;
const LINKS = /(?:https?:\/\/|www\.)/giu;
const REPEATS = /(.)\1{14,}/u;

/** Limits and messages are copied from api/contact/index.php. */
const required = { required: true, requiredMsg: 'Please fill all required fields.' };

export const contactSchema = z
	.object({
		first_name: field(80, required),
		last_name: field(80, required),
		email: field(254, { ...required, lowercase: true }),
		phone: field(40, required),
		company: field(120),
		subject: field(160, required),
		message: field(5000, required),
		captchaToken: field(100000),
	})
	.superRefine((d, ctx) => {
		const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
		if (textLength(d.message) < 20) return fail('Please provide a little more detail in your message.');
		if (!emailField.safeParse(d.email).success) return fail('Please enter a valid email address.');
		if (CONTROL_CHARS.test([d.first_name, d.last_name, d.email, d.phone, d.company, d.subject].join('')))
			return fail('One or more fields contain invalid characters.');
		if ((d.message.match(LINKS) ?? []).length > 3) return fail('Please remove excessive links from your message.');
		if (REPEATS.test(d.message)) return fail('Please remove excessive repeated characters from your message.');
		if (d.captchaToken === '' || d.captchaToken.length > 4096) return fail('Captcha verification is required.');
	});

export { firstMessage };
export type ContactInput = z.infer<typeof contactSchema>;
