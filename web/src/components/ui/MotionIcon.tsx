'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export type MotionName = 'setup' | 'compliance' | 'contracts' | 'growth' | 'marketing';
type Kind = 'icon' | 'hero';

const hasMp4: Record<string, boolean> = { 'icon-setup': true, 'icon-compliance': true, 'icon-contracts': true, 'icon-growth': true, 'icon-marketing': true, 'hero-setup': true, 'hero-compliance': true };

/**
 * One of Busola's animated graphics (transparent WebM, MP4 for Safari). It shows its still frame until it plays, and it
 * stays a still for visitors who prefer reduced motion or have data saver on. `play="visible"` plays while on screen;
 * `play="hover"` plays only while the card around it (the nearest [data-motion-host]) is hovered or focused, so a row of
 * them never moves together.
 */
export function MotionIcon({ name, kind = 'icon', play = 'visible', size, className, label }: { name: MotionName; kind?: Kind; play?: 'visible' | 'hover'; size?: number; className?: string; label?: string }) {
	const key = `${kind}-${name}`;
	const ref = useRef<HTMLVideoElement>(null);
	const still = useReducedMotion(true);
	const [ready, setReady] = useState(false);
	const poster = `/media/motion/${key}.webp`;

	useEffect(() => {
		const video = ref.current;
		if (!video || still) return;
		const run = (on: boolean) => {
			if (on && !document.hidden) void video.play().catch(() => {});
			else video.pause();
		};
		if (play === 'hover') {
			const host = video.closest('[data-motion-host]') ?? video.parentElement;
			if (!host) return;
			const on = () => run(true);
			const off = () => run(false);
			host.addEventListener('mouseenter', on);
			host.addEventListener('mouseleave', off);
			host.addEventListener('focusin', on);
			host.addEventListener('focusout', off);
			return () => {
				host.removeEventListener('mouseenter', on);
				host.removeEventListener('mouseleave', off);
				host.removeEventListener('focusin', on);
				host.removeEventListener('focusout', off);
			};
		}
		const io = new IntersectionObserver(([e]) => run(e.isIntersecting), { threshold: 0.35 });
		io.observe(video);
		const vis = () => run(!document.hidden && video.getBoundingClientRect().top < window.innerHeight);
		document.addEventListener('visibilitychange', vis);
		return () => {
			io.disconnect();
			document.removeEventListener('visibilitychange', vis);
		};
	}, [play, still]);

	const style = size ? { width: size, height: size } : undefined;
	const aria = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
	if (still) return <img src={poster} alt="" width={size} height={size} className={cn('block h-auto w-full object-contain', className)} style={style} {...aria} />;
	return (
		<span className={cn('relative block', className)} style={style} {...aria}>
			<img src={poster} alt="" className={cn('absolute inset-0 size-full object-contain transition-opacity duration-500', ready ? 'opacity-0' : 'opacity-100')} />
			<video ref={ref} className="relative size-full object-contain" muted loop playsInline preload={play === 'hover' ? 'none' : 'metadata'} tabIndex={-1} onPlaying={() => setReady(true)}>
				<source src={`/media/motion/${key}.webm`} type="video/webm" />
				{hasMp4[key] && <source src={`/media/motion/${key}.mp4`} type="video/mp4" />}
			</video>
		</span>
	);
}
