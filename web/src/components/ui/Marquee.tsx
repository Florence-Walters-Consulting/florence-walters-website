'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Seamless looping strip. Pauses on hover, for reduced motion, and while any element matching
 * `yieldTo` is mostly on screen: the site only ever moves one thing at a time, so the strip waits
 * while the hero video is playing.
 */
export function Marquee({
	children,
	duration = 45,
	reverse,
	yieldTo,
	className,
}: {
	children: React.ReactNode;
	duration?: number;
	reverse?: boolean;
	/** CSS selectors of elements this strip should wait for. */
	yieldTo?: string[];
	className?: string;
}) {
	const root = useRef<HTMLDivElement>(null);
	const [paused, setPaused] = useState(false);

	useEffect(() => {
		if (!yieldTo?.length) return;
		const visible = new Set<Element>();
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) visible.add(e.target);
					else visible.delete(e.target);
				}
				setPaused(visible.size > 0);
			},
			{ threshold: 0.35 },
		);
		for (const selector of yieldTo) document.querySelectorAll(selector).forEach((el) => io.observe(el));
		return () => io.disconnect();
	}, [yieldTo]);

	return (
		<div ref={root} data-paused={paused} className={cn('marquee overflow-hidden', className)}>
			<div
				className="marquee-track"
				style={{ '--marquee-duration': `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' } as React.CSSProperties}>
				<div className="flex shrink-0 items-center gap-4 pr-4">{children}</div>
				<div className="flex shrink-0 items-center gap-4 pr-4" aria-hidden>
					{children}
				</div>
			</div>
		</div>
	);
}
