import 'server-only';
import { jwtVerify, SignJWT } from 'jose';
import { env } from '@/lib/env';

// Draft previews: a link that proves "an admin asked to see post N". The admin cookie is scoped to /admin,
// so the public blog route cannot see it; this signed, short-lived link carries the permission instead.
const key = () => {
	if (!env.SESSION_SECRET) throw new Error('SESSION_SECRET must be set to preview drafts.');
	return new TextEncoder().encode(`${env.SESSION_SECRET}:blog-preview`);
};

export const signPreviewToken = (postId: number) =>
	new SignJWT({ purpose: 'blog-preview' }).setProtectedHeader({ alg: 'HS256' }).setSubject(String(postId)).setIssuedAt().setExpirationTime('48h').sign(key());

/** Returns the post id, or null for anything invalid or expired. */
export async function verifyPreviewToken(token: string): Promise<number | null> {
	try {
		const { payload } = await jwtVerify(token, key(), { algorithms: ['HS256'] });
		const id = Number(payload.sub);
		return payload.purpose === 'blog-preview' && Number.isInteger(id) ? id : null;
	} catch {
		return null;
	}
}
