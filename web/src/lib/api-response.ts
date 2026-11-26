import 'server-only';

const headers = { 'Cache-Control': 'no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' };

/** Same JSON shape the PHP API returned: { success, data, message? }. */
export function jsonSuccess(data: unknown = null, message?: string, status = 200) {
	return Response.json({ success: true, data, ...(message !== undefined && { message }) }, { status, headers });
}

export function jsonError(message: string, status = 400, extraHeaders: Record<string, string> = {}) {
	return Response.json({ success: false, message }, { status, headers: { ...headers, ...extraHeaders } });
}

/** Thrown inside request handling to short-circuit with an error response. */
export class HttpError extends Error {
	constructor(
		message: string,
		public status = 400,
		public extraHeaders: Record<string, string> = {},
	) {
		super(message);
	}
}

/** Runs a handler, converting HttpError into the JSON error shape and hiding unexpected errors. */
export async function handle(fn: () => Promise<Response>): Promise<Response> {
	try {
		return await fn();
	} catch (error) {
		if (error instanceof HttpError) return jsonError(error.message, error.status, error.extraHeaders);
		console.error('Unhandled form error:', error);
		return jsonError('Something went wrong. Please try again later.', 500);
	}
}
