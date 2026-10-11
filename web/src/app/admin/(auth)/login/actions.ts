'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { findAdminByUsername } from '@/db/admin/admins';
import { createSession } from '@/lib/auth/session';
import { verifyPassword } from '@/lib/auth/password';
import { isRateLimited, recordHit } from '@/lib/rate-limit';
import { clientIpFromHeaders } from '@/lib/request-guards';

export type LoginState = { error: string } | null;

const schema = z.object({ username: z.string().trim().min(1).max(50), password: z.string().min(1).max(200) });

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
	const parsed = schema.safeParse({ username: formData.get('username'), password: formData.get('password') });
	if (!parsed.success) return { error: 'Please enter your username and password.' };
	const { username, password } = parsed.data;

	// Brute-force protection. Only FAILED attempts count, so normal sign-ins never use up the budget.
	// The main limit is per IP + username, so one person guessing cannot lock the real admin out;
	// the wider per-IP and per-username limits stop spraying and distributed guessing.
	const ip = clientIpFromHeaders(await headers());
	const limits = [
		{ key: `login:fail:ip+user:${ip}:${username.toLowerCase()}`, limit: 5, window: 600 },
		{ key: `login:fail:ip:${ip}`, limit: 20, window: 600 },
		{ key: `login:fail:user:${username.toLowerCase()}`, limit: 30, window: 3600 },
	];
	if (limits.some((l) => isRateLimited(l.key, l.limit, l.window))) {
		return { error: 'Too many attempts. Please wait a few minutes and try again.' };
	}

	const found = await findAdminByUsername(username);
	const valid = await verifyPassword(password, found?.password);
	if (!found || !valid) {
		limits.forEach((l) => recordHit(l.key));
		return { error: 'Wrong username or password' };
	}

	await createSession({ id: found.id, username: found.username, name: found.name });
	redirect('/admin');
}
