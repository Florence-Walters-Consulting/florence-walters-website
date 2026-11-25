'use client';

import { useEffect, useRef, useState } from 'react';

/** Counts from 0 to `to` once, the first time it scrolls into view. Shows the final number straight away for reduced motion. */
export function CountUp({ to, suffix = '', duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
	const ref = useRef<HTMLSpanElement>(null);
	const [value, setValue] = useState(0);
	const [started, setStarted] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			const frame = requestAnimationFrame(() => {
				setStarted(true);
				setValue(to);
			});
			return () => cancelAnimationFrame(frame);
		}
		const io = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) {
				setStarted(true);
				io.disconnect();
			}
		}, { threshold: 0.6 });
		io.observe(el);
		return () => io.disconnect();
	}, [to]);

	useEffect(() => {
		if (!started || value === to) return;
		const t0 = performance.now();
		let frame = 0;
		const tick = (now: number) => {
			const p = Math.min(1, (now - t0) / duration);
			setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
			if (p < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [started, to, duration]);

	return <span ref={ref} className="tabular-nums">{value}{suffix}</span>;
}
