import 'server-only';
import bcrypt from 'bcryptjs';

const COST = 12;
// A real bcrypt hash of a random value. Compared against when the username does not exist, so
// "unknown user" and "wrong password" take the same time.
const DUMMY_HASH = '$2b$12$Ugb5d7xJifVj7ztryHj/JepLJdvXsZgpqej4uXtbwtv.JZmmTfEBi';

export const hashPassword = (plain: string) => bcrypt.hash(plain, COST);

/**
 * Checks a password against a stored value. Only bcrypt hashes can ever match: the legacy
 * plaintext passwords are deliberately NOT accepted (set a new one with `npm run admin:set-password`).
 */
export async function verifyPassword(plain: string, stored: string | undefined): Promise<boolean> {
	const isHash = typeof stored === 'string' && /^\$2[aby]\$/.test(stored);
	const ok = await bcrypt.compare(plain, isHash ? stored : DUMMY_HASH);
	return isHash && ok;
}
