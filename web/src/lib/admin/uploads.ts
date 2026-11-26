import 'server-only';
import { randomBytes } from 'node:crypto';
import { imageSize } from 'image-size';
import { deleteFile, putFile, UPLOAD_FOLDERS, type UploadFolder } from '@/lib/storage';
import { UserError } from './errors';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_SIDE = 12_000;
const MAX_PIXELS = 60_000_000;

export type ImageMode =
	/** Keep the uploaded image as it is (checked and renamed only). */
	| { kind: 'original' }
	/**
	 * The browser has already cropped the image to exactly width x height (the admin form does this
	 * with a canvas). The server only checks that it really is that size.
	 */
	| { kind: 'exact'; width: number; height: number };

export const isUpload = (value: FormDataEntryValue | null): value is File => value instanceof File && value.size > 0;

/**
 * What the file REALLY is, from its first bytes (never from its name or declared type).
 * Only JPEG, PNG and WebP are accepted: no SVG (can carry scripts), no GIF, no PDFs.
 */
function detectFormat(b: Buffer): { ext: 'jpg' | 'png' | 'webp' } | null {
	if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: 'jpg' };
	if (b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: 'png' };
	if (b.length >= 12 && b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') return { ext: 'webp' };
	return null;
}

/**
 * Validates an uploaded image and stores it under a random name. Returns the stored file name.
 *
 * Image *processing* (cropping, converting) happens in the admin's browser, not here: the image
 * library this used before (sharp) cannot run on older virtual server processors, and doing the
 * work in the browser keeps the server light. The server therefore only has to prove the file is
 * an image of an allowed type with sane dimensions, using pure JavaScript.
 */
export async function saveImage(file: File, folder: UploadFolder, mode: ImageMode): Promise<string> {
	if (file.size > MAX_UPLOAD_BYTES) throw new UserError('The image is too large. The limit is 5 MB.');
	const input = Buffer.from(await file.arrayBuffer());

	const format = detectFormat(input);
	if (!format) throw new UserError('That file is not a valid image. Please upload a JPG, PNG or WebP image.');

	let size: { width: number; height: number };
	try {
		const { width, height } = imageSize(input);
		if (!width || !height) throw new Error('no dimensions');
		size = { width, height };
	} catch {
		throw new UserError('That file is not a valid image. Please upload a JPG, PNG or WebP image.');
	}
	if (size.width > MAX_SIDE || size.height > MAX_SIDE || size.width * size.height > MAX_PIXELS) {
		throw new UserError('That image is too large in pixels. Please use one under 12,000 pixels on each side.');
	}
	if (mode.kind === 'exact' && (size.width !== mode.width || size.height !== mode.height)) {
		throw new UserError(`The image must be exactly ${mode.width} × ${mode.height} pixels. Please choose it again (the page resizes it for you).`);
	}

	const name = `${randomBytes(5).toString('hex')}.${format.ext}`;
	await putFile(folder, name, input);
	return name;
}

/** Deletes a stored image by file name; empty names are ignored. */
export async function removeImage(folder: UploadFolder, name: string | null | undefined) {
	if (name) await deleteFile(folder, name);
}

/** Images that rich-text content points at inside our own upload folders. */
export function embeddedImages(html: string | null | undefined): { folder: UploadFolder; name: string }[] {
	const found: { folder: UploadFolder; name: string }[] = [];
	for (const match of (html ?? '').matchAll(/<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi)) {
		const m = /\/site_img\/([A-Za-z0-9_]+)\/([A-Za-z0-9][A-Za-z0-9._-]*)(?:[?#].*)?$/.exec(match[1]);
		if (m && (UPLOAD_FOLDERS as readonly string[]).includes(m[1])) found.push({ folder: m[1] as UploadFolder, name: m[2] });
	}
	return found;
}

/** Deletes embedded images that are in `before` but no longer in `after` (pass '' to delete all). */
export async function removeUnusedEmbedded(before: string | null | undefined, after = '') {
	const keep = new Set(embeddedImages(after).map((i) => `${i.folder}/${i.name}`));
	for (const image of embeddedImages(before)) {
		if (!keep.has(`${image.folder}/${image.name}`)) await deleteFile(image.folder, image.name);
	}
}
