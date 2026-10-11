/** URL for the blog list with the given filters. Omits empty/default values. */
export function blogHref({ page = 1, search = '', category = 0 }: { page?: number; search?: string; category?: number }) {
	const params = new URLSearchParams();
	if (page > 1) params.set('page', String(page));
	if (search) params.set('search', search);
	if (category > 0) params.set('category', String(category));
	const query = params.toString();
	return query ? `/blog?${query}` : '/blog';
}
