import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useGeneralImages() {
	return useQuery({
		queryKey: ['general-images'],
		queryFn: () => api('/api/general-images'),
		staleTime: Infinity,
	});
}
