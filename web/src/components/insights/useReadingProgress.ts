'use client';

import { useEffect, useState } from 'react';

/** 0..1 progress through the element with the given id, updated on scroll (throttled to animation frames). */
export function useReadingProgress(targetId: string) {
	const [progress, setProgress] = useState(0);
	useEffect(() => {
		let frame = 0;
		const update = () => {
			frame = 0;
			const el = document.getElementById(targetId);
			if (!el) return;
			const rect = el.getBoundingClientRect();
			const total = rect.height;
			// "Read" means the reader's eye line (40% down the screen) has passed that part of the text.
			const read = window.innerHeight * 0.4 - rect.top;
			setProgress(Math.min(1, Math.max(0, read / total)));
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (frame) cancelAnimationFrame(frame);
		};
	}, [targetId]);
	return progress;
}
