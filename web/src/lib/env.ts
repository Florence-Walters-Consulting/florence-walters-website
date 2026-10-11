import 'server-only';
import { z } from 'zod';

const schema = z.object({
	DATABASE_URL: z.string().url(),
	SESSION_SECRET: z.string().min(32).optional(),
	RECAPTCHA_SECRET_KEY: z.string().optional(),
	// Comma-separated hostnames Google must report in the siteverify result. Skipped when unset.
	RECAPTCHA_ALLOWED_HOSTNAMES: z.string().optional(),
	// Comma-separated extra origins allowed to POST to the form endpoints (same-origin is always allowed).
	FORM_ALLOWED_ORIGINS: z.string().optional(),
	SMTP_HOST: z.string().optional(),
	SMTP_PORT: z.coerce.number().default(587),
	SMTP_USER: z.string().optional(),
	SMTP_PASSWORD: z.string().optional(),
	MAIL_FROM: z.string().optional(),
	MAIL_TO: z.string().optional(),
});

export const env = schema.parse(process.env);
