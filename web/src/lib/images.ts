/** Public URL of an admin-uploaded image. DB rows store only the file name. */
export function imageUrl(folder: string, file: string): string {
	const base = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? '';
	return `${base}/site_img/${folder}/${file}`;
}
