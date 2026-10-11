import { cacheLife, cacheTag } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { imageUrl } from '@/lib/images';

/** Map of image slot name (e.g. "Home 1") to its URL. Port of api/general-images. */
export async function getGeneralImages(): Promise<Record<string, string>> {
	'use cache';
	cacheLife('hours');
	cacheTag('general-images');

	const rows = await db
		.select({ picture: schema.generalImages.picture, size: schema.generalImages.size })
		.from(schema.generalImages)
		.where(eq(schema.generalImages.display, 'Yes'));

	return Object.fromEntries(rows.map((r) => [r.picture, imageUrl('general', r.size)]));
}
