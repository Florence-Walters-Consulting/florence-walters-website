import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useBlogsFeatured() {
	return useQuery({
		queryKey: ['blogsFeatured'],
		queryFn: () => api('/api/blogs-featured'),
		staleTime: 1000 * 60 * 60, // 1 hour
	});
}
