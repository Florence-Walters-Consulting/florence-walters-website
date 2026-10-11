import 'server-only';
import { env } from './env';
import { HttpError } from './api-response';

type SiteVerify = { success?: boolean; hostname?: string; challenge_ts?: string; 'error-codes'?: string[] };

/**
 * Verifies a reCAPTCHA v2 token with Google. Port of verifyContactCaptcha() from the PHP API
 * (same messages and status codes). The legacy paid-consultation and business-assessment
 * endpoints read an undefined $secret_key and could never succeed; all forms now share this.
 */
export async function verifyRecaptcha(token: string, ip: string) {
	const secret = env.RECAPTCHA_SECRET_KEY;
	if (!secret) {
		console.error('reCAPTCHA: RECAPTCHA_SECRET_KEY is not configured.');
		throw new HttpError('The form is temporarily unavailable.', 503);
	}

	const body = new URLSearchParams({ secret, response: token });
	if (ip !== 'unknown') body.set('remoteip', ip);

	let result: SiteVerify;
	try {
		const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body,
			signal: AbortSignal.timeout(7000),
			cache: 'no-store',
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		result = (await response.json()) as SiteVerify;
	} catch (error) {
		console.error('reCAPTCHA request failed:', error);
		throw new HttpError('Captcha verification is temporarily unavailable.', 503);
	}

	if (!result.success) {
		console.error('reCAPTCHA token rejected:', (result['error-codes'] ?? ['unknown']).join(','));
		throw new HttpError('Captcha verification failed. Please complete it again.', 422);
	}

	const allowedHosts = (env.RECAPTCHA_ALLOWED_HOSTNAMES ?? '')
		.split(',')
		.map((h) => h.trim().toLowerCase())
		.filter(Boolean);
	if (allowedHosts.length > 0) {
		const hostname = (result.hostname ?? '').toLowerCase();
		if (!hostname || !allowedHosts.includes(hostname)) {
			console.error('reCAPTCHA hostname mismatch:', hostname);
			throw new HttpError('Captcha verification failed. Please complete it again.', 422);
		}
	}

	const challenge = Date.parse(result.challenge_ts ?? '');
	if (Number.isNaN(challenge) || challenge < Date.now() - 120_000 || challenge > Date.now() + 30_000) {
		console.error('reCAPTCHA stale or invalid challenge timestamp.');
		throw new HttpError('Captcha expired. Please complete it again.', 422);
	}
}
