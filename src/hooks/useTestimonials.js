import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useTestimonials() {
	return useQuery({
		queryKey: ['testimonials'],
		queryFn: () => api('/api/testimonials'),
		staleTime: 1000 * 60 * 60, // 1 hour
	});
}
