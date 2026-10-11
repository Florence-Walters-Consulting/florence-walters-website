/**
 * Sets (or creates) an admin login with a bcrypt-hashed password.
 *
 *   npm run admin:set-password -- <username>
 *   npm run admin:set-password -- <username> --create --name "Full Name" --email you@example.com
 *
 * The password is typed at a hidden prompt (so it never lands in shell history). For automation
 * it can instead be passed in the ADMIN_PASSWORD environment variable.
 * The legacy plaintext passwords are not accepted by the new admin: run this once to set a new one.
 */
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

config({ path: '.env.local' });

function readHidden(prompt: string): Promise<string> {
	return new Promise((resolve) => {
		process.stdout.write(prompt);
		const stdin = process.stdin;
		let value = '';
		stdin.setRawMode?.(true);
		stdin.resume();
		stdin.setEncoding('utf8');
		const onData = (chunk: string) => {
			for (const char of chunk) {
				if (char === '\r' || char === '\n') {
					stdin.setRawMode?.(false);
					stdin.pause();
					stdin.off('data', onData);
					process.stdout.write('\n');
					return resolve(value);
				}
				if (char === '\u0003') process.exit(130); // Ctrl+C
				if (char === '\u007f') value = value.slice(0, -1);
				else value += char;
			}
		};
		stdin.on('data', onData);
	});
}

function flag(name: string): string | undefined {
	const i = process.argv.indexOf(`--${name}`);
	return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
	const username = process.argv[2];
	if (!username || username.startsWith('--')) {
		console.error('Usage: npm run admin:set-password -- <username> [--create --name "Name" --email addr]');
		process.exit(1);
	}
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set (expected in web/.env.local).');

	let password = process.env.ADMIN_PASSWORD ?? '';
	if (!password) {
		password = await readHidden('New password (min 10 characters): ');
		const again = await readHidden('Repeat password: ');
		if (password !== again) throw new Error('Passwords do not match.');
	}
	if (password.length < 10) throw new Error('Password must be at least 10 characters.');

	const hash = await bcrypt.hash(password, 12);
	const db = await mysql.createConnection(process.env.DATABASE_URL);
	try {
		const [rows] = await db.execute('SELECT id FROM admin WHERE username = ? LIMIT 1', [username]);
		if ((rows as unknown[]).length > 0) {
			await db.execute('UPDATE admin SET password = ? WHERE username = ?', [hash, username]);
			console.log(`Password updated for "${username}".`);
		} else if (process.argv.includes('--create')) {
			const name = flag('name') ?? username;
			const email = flag('email') ?? '';
			await db.execute('INSERT INTO admin (name, email, username, password, admin_type) VALUES (?, ?, ?, ?, ?)', [name, email, username, hash, 'admin']);
			console.log(`Admin "${username}" created.`);
		} else {
			throw new Error(`No admin named "${username}". Add --create to create one.`);
		}
	} finally {
		await db.end();
	}
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
