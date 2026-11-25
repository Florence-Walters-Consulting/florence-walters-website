'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * The brand film as a silent looping graphic: no controls, plays only while on screen, and is a still poster for visitors who
 * prefer reduced motion or have data saver on.
 */
export function BrandFilm({ src, poster, title }: { src: string; poster: string; title: string }) {
	const ref = useRef<HTMLVideoElement>(null);
	const still = useReducedMotion(true);

	useEffect(() => {
		const video = ref.current;
		if (!video || still) return;
		const io = new IntersectionObserver(([e]) => {
			if (e.isIntersecting && !document.hidden) void video.play().catch(() => {});
			else video.pause();
		}, { threshold: 0.4 });
		io.observe(video);
		return () => io.disconnect();
	}, [still]);

	return (
		<div className="relative aspect-video w-full overflow-hidden rounded-card bg-ink-deep shadow-lift ring-1 ring-line">
			{still ? (
				<img src={poster} alt={title} className="size-full object-cover" />
			) : (
				<video ref={ref} poster={poster} muted loop playsInline preload="metadata" className="size-full object-cover" aria-label={title}>
					<source src={src} type="video/mp4" />
				</video>
			)}
		</div>
	);
}
