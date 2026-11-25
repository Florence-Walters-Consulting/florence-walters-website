'use client';

import { useReadingProgress } from './useReadingProgress';

/** Thin accent line across the very top of the screen that fills as the article is read. */
export function ReadingProgress({ targetId }: { targetId: string }) {
	const p = useReadingProgress(targetId);
	return (
		<div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px] bg-transparent">
			<div className="h-full origin-left bg-gradient-to-r from-accent to-accent-bright" style={{ transform: `scaleX(${p})` }} />
		</div>
	);
}
