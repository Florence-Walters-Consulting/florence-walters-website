import 'server-only';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

/** The only folders uploads may be written to (they match the legacy site_img layout). */
export const UPLOAD_FOLDERS = [
	'blog',
	'services',
	'team',
	'testimonials',
	'partners',
	'home_background',
	'general',
	'summernote',
] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

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
	if ((process.env.STORAGE_DRIVER ?? 'local') !== 'local') {
		throw new Error(`Storage driver "${process.env.STORAGE_DRIVER}" is not implemented yet.`);
	}
	const dir = path.join(/* turbopackIgnore: true */ localRoot(), folder);
	await mkdir(/* turbopackIgnore: true */ dir, { recursive: true });
	await writeFile(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ dir, name), data, { flag: 'wx' });
}

/** Deletes a file. Missing files are ignored (like the legacy @unlink). */
export async function deleteFile(folder: UploadFolder, name: string): Promise<void> {
	assertSafe(folder, name);
	try {
		await unlink(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ localRoot(), folder, name));
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
	}
}
