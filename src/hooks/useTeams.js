import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useTeams() {
	return useQuery({
		queryKey: ['team'],
		queryFn: () => api('/api/team'),
		staleTime: 1000 * 60 * 60, // 1 hour
	});
}
