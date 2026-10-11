import 'server-only';
import { HttpError } from './api-response';

/**
 * Sliding-window limiter, ported from the PHP contact_security.php (which stored timestamps in
 * temp files). State lives in this server instance's memory, so on serverless hosting each
 * instance counts separately: it slows bots down but is not a hard global limit. A shared store
 * (e.g. Upstash Redis) would make it exact; that is an optional paid-tier decision.
 */
const buckets = new Map<string, number[]>();
let lastSweep = 0;

function sweep(now: number) {
	if (now - lastSweep < 60_000) return;
	lastSweep = now;
	for (const [key, stamps] of buckets) {
		if (stamps.length === 0 || stamps[stamps.length - 1] < now - 86_400_000) buckets.delete(key);
	}
}

/** Records a hit if allowed. Returns [allowed, retryAfterSeconds]. */
export function rateLimit(bucket: string, limit: number, windowSeconds: number): [boolean, number] {
	const now = Date.now();
	sweep(now);
	const windowMs = windowSeconds * 1000;
	const stamps = (buckets.get(bucket) ?? []).filter((t) => t > now - windowMs);
	const allowed = stamps.length < limit;
	const retryAfter = allowed || stamps.length === 0 ? 0 : Math.max(1, Math.ceil((stamps[0] + windowMs - now) / 1000));
	if (allowed) stamps.push(now);
	buckets.set(bucket, stamps);
	return [allowed, retryAfter];
}

/** True if the bucket is already at its limit. Does not record anything. */
export function isRateLimited(bucket: string, limit: number, windowSeconds: number): boolean {
	const cutoff = Date.now() - windowSeconds * 1000;
	return (buckets.get(bucket) ?? []).filter((t) => t > cutoff).length >= limit;
}

/** Records one event in a bucket (used to count only failed attempts). */
export function recordHit(bucket: string) {
	const stamps = buckets.get(bucket) ?? [];
	stamps.push(Date.now());
	buckets.set(bucket, stamps);
}

export function enforceRateLimit(bucket: string, limit: number, windowSeconds: number) {
	const [allowed, retryAfter] = rateLimit(bucket, limit, windowSeconds);
	if (!allowed) {
		throw new HttpError('Too many requests. Please wait before trying again.', 429, {
			'Retry-After': String(retryAfter),
		});
	}
}
