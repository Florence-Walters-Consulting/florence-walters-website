import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useSlides() {
	return useQuery({
		queryKey: ['slideshow'],
		queryFn: () => api('/api/slideshow'),
		staleTime: 1000 * 60 * 60, // 1 hour
	});
}
