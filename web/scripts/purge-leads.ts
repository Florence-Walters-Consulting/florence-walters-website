/**
 * Deletes inbox enquiries older than the retention period (LEAD_RETENTION_DAYS, 90), together with their
 * notes, and trims the admin activity log to one year. Run daily by cron on the server (see deploy.sh).
 *
 *   npm run leads:purge
 */
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { sslFromEnv } from '../src/lib/db-ssl';
import { LEAD_RETENTION_DAYS } from '../src/lib/leads';

config({ path: process.env.ENV_FILE ?? '.env.local' });

async function main() {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set.');
	const db = await mysql.createConnection({ uri: process.env.DATABASE_URL, ssl: sslFromEnv() });
	try {
		// lead_notes rows go with their lead (ON DELETE CASCADE).
		const [leads] = await db.execute('DELETE FROM leads WHERE created_at < (NOW() - INTERVAL ? DAY)', [LEAD_RETENTION_DAYS]);
		const [log] = await db.execute('DELETE FROM admin_activity WHERE created_at < (NOW() - INTERVAL 365 DAY)');
		console.log(`${new Date().toISOString()} purge ok: ${(leads as mysql.ResultSetHeader).affectedRows} enquiries older than ${LEAD_RETENTION_DAYS} days, ${(log as mysql.ResultSetHeader).affectedRows} old activity rows`);
	} finally {
		await db.end();
	}
}

main().catch((e) => {
	console.error('Purge failed:', e.message);
	process.exit(1);
});
