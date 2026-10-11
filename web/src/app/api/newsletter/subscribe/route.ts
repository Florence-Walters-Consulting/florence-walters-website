import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { handle, HttpError, jsonSuccess } from '@/lib/api-response';
import { assertAllowedOrigin, clientIp } from '@/lib/request-guards';
import { enforceRateLimit } from '@/lib/rate-limit';

const ALREADY = 'You are already subscribed.';

// MySQL duplicate-key error (the unique index added by db/migrations/001_cleanup.sql).
const isDuplicate = (error: unknown) => {
	const e = error as { errno?: number; cause?: { errno?: number } };
	return e?.errno === 1062 || e?.cause?.errno === 1062;
};

// Port of api/newsletter/subscribe.php (form-encoded `email`).
export function POST(request: Request) {
	return handle(async () => {
		assertAllowedOrigin(request);

		// New: the legacy endpoint had no rate limit or captcha.
		const ip = clientIp(request);
		enforceRateLimit(`newsletter:ip:10m:${ip}`, 10, 600);
		enforceRateLimit(`newsletter:ip:day:${ip}`, 40, 86400);

		let raw = '';
		try {
			raw = String((await request.formData()).get('email') ?? '');
		} catch {
			throw new HttpError('Invalid request.');
		}
		const email = raw.trim().toLowerCase();
		if (!email || email.length > 100 || !z.string().email().safeParse(email).success) {
			throw new HttpError('Please enter a valid email address.');
		}

		const [existing] = await db
			.select({ id: schema.emailSubscribers.id })
			.from(schema.emailSubscribers)
			.where(eq(schema.emailSubscribers.email, email))
			.limit(1);
		if (existing) return jsonSuccess(null, ALREADY);

		try {
			await db.insert(schema.emailSubscribers).values({ email, date: sql`NOW()` });
		} catch (error) {
			if (isDuplicate(error)) return jsonSuccess(null, ALREADY);
			console.error('Newsletter insert failed:', error);
			throw new HttpError('We could not complete your subscription. Please try again.', 500);
		}
		return jsonSuccess(null, 'Thank you for subscribing.');
	});
}
