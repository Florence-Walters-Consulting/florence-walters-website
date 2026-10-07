import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useServices() {
	return useQuery({
		queryKey: ['services'],
		queryFn: () => api('/api/services'),
		staleTime: 1000 * 60 * 60,
	});
}
