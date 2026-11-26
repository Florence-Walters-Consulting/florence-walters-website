import 'server-only';
import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { env } from '@/lib/env';

export const SESSION_COOKIE = 'fwc_admin';
const SESSION_HOURS = 12;

export type AdminSession = { id: number; username: string; name: string };

function key() {
	if (!env.SESSION_SECRET) throw new Error('SESSION_SECRET must be set (at least 32 characters) to use the admin.');
	return new TextEncoder().encode(env.SESSION_SECRET);
}

/** Signs a session token. Contains no secrets: just who the admin is and when it expires. */
export function signSession(session: AdminSession) {
	return new SignJWT({ username: session.username, name: session.name })
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject(String(session.id))
		.setIssuedAt()
		.setExpirationTime(`${SESSION_HOURS}h`)
		.sign(key());
}

/** Verifies the signature and expiry only (no database). Returns null for anything invalid. */
export async function verifySessionToken(token: string | undefined): Promise<AdminSession | null> {
	if (!token) return null;
	try {
		const { payload } = await jwtVerify(token, key(), { algorithms: ['HS256'] });
		const id = Number(payload.sub);
		if (!Number.isInteger(id) || typeof payload.username !== 'string') return null;
		return { id, username: payload.username, name: typeof payload.name === 'string' ? payload.name : '' };
	} catch {
		return null;
	}
}

export async function createSession(session: AdminSession) {
	(await cookies()).set(SESSION_COOKIE, await signSession(session), {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		// Strict: the cookie is never sent on cross-site requests. Scoped to the admin paths only.
		sameSite: 'strict',
		path: '/admin',
		maxAge: SESSION_HOURS * 3600,
	});
}

export async function destroySession() {
	(await cookies()).set(SESSION_COOKIE, '', { httpOnly: true, path: '/admin', maxAge: 0 });
}

export async function readSession() {
	return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}
