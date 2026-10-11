import 'server-only';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { env } from '@/lib/env';
import * as schema from './schema';

// One pool per server instance. Kept small: hosted MySQL free tiers limit connections.
const globalForDb = globalThis as unknown as { pool?: mysql.Pool };

const pool =
	globalForDb.pool ??
	mysql.createPool({ uri: env.DATABASE_URL, connectionLimit: 5, charset: 'utf8mb4' });

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

export const db = drizzle(pool, { schema, mode: 'default' });
export { schema };
