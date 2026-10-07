import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useService(slug) {
	return useQuery({
		queryKey: ['service', slug],
		queryFn: () => api(`/api/service-single?slug=${encodeURIComponent(slug)}`),
		enabled: Boolean(slug),
		staleTime: 1000 * 60 * 60,
	});
}
