'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * True when the visitor prefers reduced motion (and, with `saveData`, when data saver is on). Counts as true on the server and
 * during hydration, so animation is only ever switched on after the page is live.
 */
export function useReducedMotion(saveData = false) {
	return useSyncExternalStore(
		(onChange) => {
			const media = window.matchMedia(QUERY);
			media.addEventListener('change', onChange);
			return () => media.removeEventListener('change', onChange);
		},
		() => window.matchMedia(QUERY).matches || (saveData && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)),
		() => true,
	);
}
