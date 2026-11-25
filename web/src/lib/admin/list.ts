/** Shared paging for admin lists. The page number lives in the URL (?page=2) so it survives refresh and sharing. */
export const PAGE_SIZE = 10;

export const pageFrom = (raw: string | undefined) => Math.max(1, parseInt(raw ?? '1', 10) || 1);

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE) {
	const pages = Math.max(1, Math.ceil(items.length / size));
	const current = Math.min(page, pages);
	return { rows: items.slice((current - 1) * size, current * size), total: items.length, pages, page: current, size };
}

/** Case-insensitive "contains" across several text fields. */
export const matches = (q: string, ...fields: (string | null | undefined)[]) => {
	const needle = q.trim().toLowerCase();
	return !needle || fields.some((f) => (f ?? '').toLowerCase().includes(needle));
};
