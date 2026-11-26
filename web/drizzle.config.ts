import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
	dialect: 'mysql',
	out: './src/db/introspected',
	dbCredentials: { url: process.env.DATABASE_URL! },
});
