import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function usePartners() {
	return useQuery({
		queryKey: ['partners'],
		queryFn: () => api('/api/partners'),
		staleTime: 1000 * 60 * 60, // 1 hour
	});
}
