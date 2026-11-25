import 'server-only';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { del, put } from '@vercel/blob';

/** The only folders uploads may be written to (they match the legacy site_img layout). */
export const UPLOAD_FOLDERS = [
	'blog',
	'testimonials',
	'partners',
	'summernote',
	'work',
] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

/** Where a file lives inside the Blob store (mirrors the /site_img/ layout). */
const blobPath = (folder: string, name: string) => `site_img/${folder}/${name}`;

const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

function assertSafe(folder: string, name: string) {
	if (!(UPLOAD_FOLDERS as readonly string[]).includes(folder)) throw new Error(`Invalid upload folder: ${folder}`);
	if (!SAFE_NAME.test(name) || name.includes('..')) throw new Error(`Invalid file name: ${name}`);
}

/**
 * Where uploaded files live. (The turbopackIgnore comments stop the bundler from tracing the whole
 * project for these dev-only disk paths.) Local development writes to the repo's site_img/ folder (served
 * through the public/site_img link). Hosted deployments cannot keep files on disk, so a remote
 * driver (object storage) is added when the hosting is set up; until then only "local" exists.
 */
function localRoot() {
	return path.resolve(/* turbopackIgnore: true */ process.env.LOCAL_UPLOAD_DIR ?? path.join(/* turbopackIgnore: true */ process.cwd(), '..', 'site_img'));
}

export async function putFile(folder: UploadFolder, name: string, data: Buffer): Promise<void> {
	assertSafe(folder, name);
	const driver = process.env.STORAGE_DRIVER ?? 'local';
	if (driver === 'vercel-blob') {
		// Hosting without a persistent disk (Vercel): files go to a public Blob store, under the same
		// path the site already uses (site_img/<folder>/<name>), so imageUrl() needs no change.
		await put(blobPath(folder, name), data, { access: 'public', addRandomSuffix: false, allowOverwrite: false });
		return;
	}
	if (driver !== 'local') throw new Error(`Storage driver "${driver}" is not implemented.`);
	const dir = path.join(/* turbopackIgnore: true */ localRoot(), folder);
	await mkdir(/* turbopackIgnore: true */ dir, { recursive: true });
	await writeFile(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ dir, name), data, { flag: 'wx' });
}

/** Deletes a file. Missing files are ignored (like the legacy @unlink). */
export async function deleteFile(folder: UploadFolder, name: string): Promise<void> {
	assertSafe(folder, name);
	if ((process.env.STORAGE_DRIVER ?? 'local') === 'vercel-blob') {
		const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? '').replace(/\/$/, '');
		if (base) await del(`${base}/${blobPath(folder, name)}`);
		return;
	}
	try {
		await unlink(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ localRoot(), folder, name));
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
	}
}
