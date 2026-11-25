'use client';

import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, FileCheck2, ShieldCheck } from 'lucide-react';
import { Icon3D } from './Icon3D';

const cube = (size: string) => ['translateZ', 'rotateY(180deg) translateZ', 'rotateY(90deg) translateZ', 'rotateY(-90deg) translateZ', 'rotateX(90deg) translateZ', 'rotateX(-90deg) translateZ'].map((t) => `${t}(${size})`);

/**
 * Slow floating 3D shapes in the right half of a coloured band (they never sit under the text): turning cubes, tiles and pills.
 * `compact` keeps just three shapes, for a small card. It pauses while off screen and is static for reduced motion.
 * Put it first inside a `relative isolate overflow-hidden` band.
 */
export function FloatingShapes({ compact }: { compact?: boolean }) {
	const ref = useRef<HTMLDivElement>(null);
	const [paused, setPaused] = useState(true);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting), { threshold: 0.1 });
		io.observe(el);
		return () => io.disconnect();
	}, []);

	const dur = (s: string) => ({ ['--dur' as string]: s });
	return (
		<div ref={ref} data-paused={paused} aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-full overflow-hidden perspective-1000 sm:w-1/2">
			<div className="shape-spin absolute top-[14%] right-[8%] size-14 opacity-60 sm:size-[4.5rem] sm:opacity-100" style={dur('20s')}>
				{cube('1.75rem').map((t) => <span key={t} className="absolute inset-0 border border-white/55 bg-white/10" style={{ transform: t }} />)}
			</div>
			{!compact && (
				<div className="shape-spin absolute bottom-[16%] left-[16%] hidden size-10 sm:block" style={{ ...dur('13s'), animationDirection: 'reverse' }}>
					{cube('1.25rem').map((t) => <span key={t} className="absolute inset-0 bg-white/20" style={{ transform: t }} />)}
				</div>
			)}
			<span className="shape-drift absolute right-[28%] bottom-[10%] hidden sm:block" style={dur('10s')}><Icon3D icon={BadgeCheck} size={compact ? 40 : 48} tone="navy" /></span>
			<span className="shape-drift absolute top-[22%] left-[10%] hidden rounded-full bg-white px-3.5 py-1.5 text-[0.8125rem] font-bold text-ink shadow-lg sm:block" style={dur('8s')}>CAC</span>
			{!compact && (
				<>
					<span className="shape-drift absolute top-[52%] left-[34%] hidden sm:block" style={dur('9s')}><Icon3D icon={ShieldCheck} size={52} tone="white" /></span>
					<span className="shape-drift absolute top-[8%] left-[38%] hidden md:block" style={dur('8s')}><Icon3D icon={FileCheck2} size={44} tone="white" /></span>
					<span className="shape-drift absolute top-[46%] right-[6%] hidden rounded-full bg-white px-3.5 py-1.5 text-[0.8125rem] font-bold text-ink shadow-lg sm:block" style={dur('7s')}>NRS</span>
					<span className="shape-drift absolute bottom-[6%] left-[48%] hidden rounded-full bg-white px-3.5 py-1.5 text-[0.8125rem] font-bold text-ink shadow-lg sm:block" style={dur('9.5s')}>TIN</span>
				</>
			)}
		</div>
	);
}
