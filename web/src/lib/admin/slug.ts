/** Port of makeSlug() from the legacy api/config.php (same rules, so existing slugs stay stable). */
export function makeSlug(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/[\s-]+/g, ' ')
		.replace(/ /g, '-')
		.replace(/^-+|-+$/g, '');
}

/** Appends -2, -3... until `isTaken` says the slug is free (legacy allowed silent duplicates). */
export async function uniqueSlug(base: string, isTaken: (slug: string) => Promise<boolean>): Promise<string> {
	let slug = base;
	for (let n = 2; await isTaken(slug); n++) slug = `${base}-${n}`;
	return slug;
}
