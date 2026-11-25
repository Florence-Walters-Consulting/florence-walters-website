/**
 * Copies the project's site_img/ folder (blog pictures, regulator logos, work highlights...) into a public
 * Vercel Blob store, once, so a Vercel deployment can show the same images. Existing files are skipped, so it
 * is safe to run again.
 *
 *   BLOB_READ_WRITE_TOKEN=... npm run storage:upload
 *
 * It prints the value to use for NEXT_PUBLIC_IMAGE_BASE_URL at the end.
 */
import { config } from 'dotenv';
import { list, put } from '@vercel/blob';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

config({ path: process.env.ENV_FILE ?? '.env.local' });

const ROOT = join(process.cwd(), '..', 'site_img');
const SKIP = new Set(['.DS_Store']);

function* walk(dir: string, rel = ''): Generator<string> {
	for (const name of readdirSync(dir)) {
		if (SKIP.has(name)) continue;
		const full = join(dir, name);
		if (statSync(full).isDirectory()) yield* walk(full, `${rel}${name}/`);
		else yield `${rel}${name}`;
	}
}

async function main() {
	if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is not set (Vercel > Storage > your Blob store > .env.local tab).');
	const have = new Set<string>();
	let cursor: string | undefined;
	do {
		const page = await list({ prefix: 'site_img/', cursor, limit: 1000 });
		page.blobs.forEach((b) => have.add(b.pathname));
		cursor = page.cursor;
	} while (cursor);

	let sent = 0;
	let skipped = 0;
	let origin = '';
	for (const rel of walk(ROOT)) {
		const pathname = `site_img/${rel}`;
		if (have.has(pathname)) {
			skipped++;
			continue;
		}
		const blob = await put(pathname, readFileSync(join(ROOT, rel)), { access: 'public', addRandomSuffix: false, allowOverwrite: false });
		origin = new URL(blob.url).origin;
		sent++;
		if (sent % 10 === 0) console.log(`  ${sent} uploaded...`);
	}
	console.log(`Done: ${sent} uploaded, ${skipped} already there.`);
	if (origin) console.log(`NEXT_PUBLIC_IMAGE_BASE_URL=${origin}`);
	else console.log('Find NEXT_PUBLIC_IMAGE_BASE_URL in Vercel > Storage > your store (the public URL, without a trailing slash or path).');
}

main().catch((e) => {
	console.error('Upload failed:', e.message);
	process.exit(1);
});
