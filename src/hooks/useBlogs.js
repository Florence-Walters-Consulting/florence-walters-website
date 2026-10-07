import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useBlogs(page, search = '', category = '') {
	return useQuery({
		queryKey: ['blogs', page, search, category],
		queryFn: () => {
			const params = new URLSearchParams({ page: String(page) });
			if (search) params.set('search', search);
			if (category) params.set('category', category);
			return api(`/api/blog?${params.toString()}`);
		},
		placeholderData: (previousData) => previousData,
		staleTime: 1000 * 60 * 60,
	});
}
