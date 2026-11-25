/**
 * Applies the SQL files in db/migrations, in order, once each.
 *
 *   npm run db:migrate            apply anything new
 *   npm run db:migrate -- --status  show what is applied and what is pending
 *
 * Applied files are remembered in a `schema_migrations` table. A database that was loaded from the
 * original dump before this existed is detected (it has tables but no record) and 001_cleanup.sql is
 * marked as already applied, because it is not safe to run twice. Every later migration is written to be
 * safe to re-run. Reads DATABASE_URL from the environment, or from web/.env.local (or the file named in ENV_FILE,
 * e.g. ENV_FILE=.env.dev.local npm run db:migrate to run against the Vercel dev database).
 */
import { config } from 'dotenv';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import mysql from 'mysql2/promise';
import { sslFromEnv } from '../src/lib/db-ssl';

config({ path: process.env.ENV_FILE ?? '.env.local' });

const DIR = join(process.cwd(), 'db', 'migrations');
const BASELINE = '001_cleanup.sql';

async function main() {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set (expected in the environment or web/.env.local).');
	const statusOnly = process.argv.includes('--status');
	const files = readdirSync(DIR).filter((f) => /^\d{3}_.+\.sql$/.test(f)).sort();

	const db = await mysql.createConnection({ uri: process.env.DATABASE_URL, multipleStatements: true, ssl: sslFromEnv() });
	try {
		await db.query(
			'CREATE TABLE IF NOT EXISTS schema_migrations (name VARCHAR(100) NOT NULL PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB',
		);
		const [rows] = await db.query('SELECT name FROM schema_migrations');
		let applied = new Set((rows as { name: string }[]).map((r) => r.name));

		if (applied.size === 0 && files.includes(BASELINE)) {
			const [t] = await db.query("SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'admin'");
			if ((t as { n: number }[])[0].n > 0) {
				console.log(`Existing database detected: marking ${BASELINE} as already applied.`);
				if (!statusOnly) await db.query('INSERT INTO schema_migrations (name) VALUES (?)', [BASELINE]);
				applied = new Set([BASELINE]);
			}
		}

		const pending = files.filter((f) => !applied.has(f));
		if (statusOnly) {
			for (const f of files) console.log(`${applied.has(f) ? 'applied ' : 'PENDING '} ${f}`);
			return;
		}
		if (pending.length === 0) return console.log('Database is up to date.');
		for (const f of pending) {
			process.stdout.write(`Applying ${f} ... `);
			await db.query(readFileSync(join(DIR, f), 'utf8'));
			await db.query('INSERT INTO schema_migrations (name) VALUES (?)', [f]);
			console.log('done');
		}
		console.log(`Applied ${pending.length} migration${pending.length === 1 ? '' : 's'}.`);
	} finally {
		await db.end();
	}
}

main().catch((e) => {
	console.error('Migration failed:', e.message);
	process.exit(1);
});
