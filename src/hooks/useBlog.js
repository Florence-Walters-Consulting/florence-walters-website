import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useBlog(slug) {
	return useQuery({
		queryKey: ['blog', slug],
		queryFn: () => api(`/api/blog-single?slug=${encodeURIComponent(slug)}`),
		enabled: Boolean(slug),
		staleTime: 1000 * 60 * 60,
	});
}
