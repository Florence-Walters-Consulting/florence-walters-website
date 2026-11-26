'use client';

import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, FileCheck2, ShieldCheck } from 'lucide-react';
import { Icon3D } from './Icon3D';

const cube = (size: string) => ['translateZ', 'rotateY(180deg) translateZ', 'rotateY(90deg) translateZ', 'rotateY(-90deg) translateZ', 'rotateX(90deg) translateZ', 'rotateX(-90deg) translateZ'].map((t) => `${t}(${size})`);

/**
 * A few soft floating shapes at the edges of a coloured band. They are faint and keep to the top and bottom edges, so they never
 * sit under the text or the button. `compact` (small card) keeps a narrow strip at the far right with two shapes.
 * Pauses while off screen and is static for reduced motion. Put it first inside a `relative isolate overflow-hidden` band.
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
	if (compact) {
		return (
			<div ref={ref} data-paused={paused} aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 overflow-hidden opacity-50 perspective-1000 sm:block">
				<div className="shape-spin absolute top-[8%] right-[18%] size-10" style={dur('20s')}>
					{cube('1.25rem').map((t) => <span key={t} className="absolute inset-0 border border-white/55 bg-white/10" style={{ transform: t }} />)}
				</div>
				<span className="shape-drift absolute right-[22%] bottom-[8%]" style={dur('10s')}><Icon3D icon={BadgeCheck} size={36} tone="navy" /></span>
			</div>
		);
	}
	return (
		<div ref={ref} data-paused={paused} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-45 perspective-1000">
			<div className="shape-spin absolute top-[8%] right-[42%] hidden size-12 sm:block" style={dur('22s')}>
				{cube('1.5rem').map((t) => <span key={t} className="absolute inset-0 border border-white/60 bg-white/10" style={{ transform: t }} />)}
			</div>
			<span className="shape-drift absolute top-[10%] right-[16%] hidden md:block" style={dur('9s')}><Icon3D icon={ShieldCheck} size={40} tone="white" /></span>
			<span className="shape-drift absolute right-[30%] bottom-[8%] hidden md:block" style={dur('10s')}><Icon3D icon={FileCheck2} size={38} tone="white" /></span>
			<span className="shape-drift absolute right-[6%] bottom-[10%] hidden md:block" style={dur('8s')}><Icon3D icon={BadgeCheck} size={38} tone="navy" /></span>
		</div>
	);
}
