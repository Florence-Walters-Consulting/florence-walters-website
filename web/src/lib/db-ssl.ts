/**
 * TLS settings for the MySQL connection (shared by the app and the command-line scripts, so no server-only import).
 *   DATABASE_SSL=true        turn TLS on (cloud databases require it)
 *   DATABASE_SSL_CA=<PEM>    the provider's CA certificate, only if its certificate is not from a public authority
 *                            (Aiven, for example). "\n" in the value is turned into real line breaks.
 * Leave both unset for a local database.
 */
export function sslFromEnv(env: Record<string, string | undefined> = process.env) {
	if (env.DATABASE_SSL !== 'true') return undefined;
	const ca = env.DATABASE_SSL_CA?.replace(/\\n/g, '\n').trim();
	return { rejectUnauthorized: true, ...(ca ? { ca } : {}) };
}

/** Connections per server instance. Serverless hosting runs many instances, so keep this small there. */
export function poolSizeFromEnv(env: Record<string, string | undefined> = process.env) {
	const n = parseInt(env.DB_POOL_SIZE ?? '', 10);
	return Number.isInteger(n) && n > 0 && n <= 20 ? n : 5;
}
