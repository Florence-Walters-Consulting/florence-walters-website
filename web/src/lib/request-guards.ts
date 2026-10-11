import 'server-only';
import { isIP } from 'node:net';
import { env } from './env';
import { HttpError } from './api-response';

/** Client IP from the proxy header (Vercel and most reverse proxies set it), else "unknown". */
export function clientIpFromHeaders(headers: Headers): string {
	const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
	const real = headers.get('x-real-ip')?.trim() ?? '';
	const candidate = isIP(forwarded) ? forwarded : isIP(real) ? real : '';
	return candidate || 'unknown';
}

export const clientIp = (request: Request) => clientIpFromHeaders(request.headers);

/**
 * Rejects cross-site POSTs. A request with no Origin header (non-browser client) is allowed
 * through; browsers always send one on POST.
 */
export function assertAllowedOrigin(request: Request) {
	const origin = request.headers.get('origin');
	if (!origin) return;
	const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
	const extra = (env.FORM_ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean);
	let originHost = '';
	try {
		originHost = new URL(origin).host;
	} catch {
		/* invalid origin falls through to rejection */
	}
	if (originHost && originHost === host) return;
	if (extra.includes(origin)) return;
	throw new HttpError('Invalid request origin.', 403);
}

/** Reads a JSON object body with a size cap (bytes). */
export async function readJsonBody(request: Request, maxBytes: number, { strictType = false } = {}) {
	if (strictType) {
		const type = (request.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
		if (type !== 'application/json') throw new HttpError('Content-Type must be application/json.', 415);
	}
	const raw = await request.text();
	if (Buffer.byteLength(raw) > maxBytes) {
		throw new HttpError(strictType ? 'Request payload is too large.' : 'Invalid request.', strictType ? 413 : 400);
	}
	let data: unknown;
	try {
		data = JSON.parse(raw);
	} catch {
		throw new HttpError(strictType ? 'Invalid JSON request.' : 'Invalid request.', 400);
	}
	if (typeof data !== 'object' || data === null || Array.isArray(data)) {
		throw new HttpError('Invalid request.', 400);
	}
	return data as Record<string, unknown>;
}
