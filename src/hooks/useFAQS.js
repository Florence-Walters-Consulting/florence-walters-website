import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useFAQS() {
	return useQuery({
		queryKey: ['faqs'],
		queryFn: () => api('/api/faqs'),
		staleTime: 1000 * 60 * 60, // 1 hour
	});
}
