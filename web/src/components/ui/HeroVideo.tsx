'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Looping background video built for performance: WebM only, no audio. Render a poster image
 * underneath; the video fades in once it can play. It plays only while `active`, on screen
 * and with the tab visible, and never for reduced-motion visitors (they keep the poster).
 */
export function HeroVideo({ src, active = true, className }: { src: string; active?: boolean; className?: string }) {
	const ref = useRef<HTMLVideoElement>(null);
	const [ready, setReady] = useState(false);
	const [onScreen, setOnScreen] = useState(true);

	useEffect(() => {
		const video = ref.current;
		if (!video) return;
		const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
		io.observe(video);
		return () => io.disconnect();
	}, []);

	useEffect(() => {
		const video = ref.current;
		if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const sync = () => {
			if (active && onScreen && !document.hidden) void video.play().catch(() => {});
			else video.pause();
		};
		sync();
		document.addEventListener('visibilitychange', sync);
		return () => document.removeEventListener('visibilitychange', sync);
	}, [active, onScreen]);

	return (
		<video
			ref={ref}
			className={cn('size-full object-cover transition-opacity duration-1000', ready ? 'opacity-100' : 'opacity-0', className)}
			muted
			loop
			playsInline
			preload="metadata"
			aria-hidden
			tabIndex={-1}
			onPlaying={() => setReady(true)}>
			<source src={src} type="video/webm" />
		</video>
	);
}
