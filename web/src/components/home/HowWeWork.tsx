'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon3D } from '@/components/ui/Icon3D';
import { SectionHead } from '@/components/ui/SectionHead';
import { SiteLink } from '@/components/ui/SiteLink';
import { cn } from '@/lib/cn';
import { steps } from '@/data/home';

/**
 * Five steps in one horizontal row, each just an icon and a few words. Tapping one opens its sentence underneath.
 * When the row first scrolls into view the steps light up in order, one after another.
 */
export function HowWeWork() {
	const [active, setActive] = useState(0);
	const [lit, setLit] = useState(0);
	const root = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = root.current;
		if (!el) return;
		// Reduced motion: every step is shown lit from the start (see the motion-reduce class below).
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const timers: number[] = [];
		const io = new IntersectionObserver(([e]) => {
			if (!e.isIntersecting) return;
			io.disconnect();
			steps.forEach((_, i) => timers.push(window.setTimeout(() => setLit(i + 1), 300 + i * 350)));
		}, { threshold: 0.5 });
		io.observe(el);
		return () => {
			io.disconnect();
			timers.forEach(window.clearTimeout);
		};
	}, []);

	return (
		<section id="how-we-work" className="section-space bg-mist">
			<Container>
				<SectionHead label="How we work" title="From first click to signed agreement, in five steps." />

				<div ref={root} className="mt-12">
					<div role="tablist" aria-label="Steps" className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
						{steps.map((s, i) => {
							const on = i < lit;
							const open = i === active;
							return (
								<button
									key={s.n}
									type="button"
									role="tab"
									id={`step-tab-${i}`}
									aria-selected={open}
									aria-controls="step-panel"
									onClick={() => setActive(i)}
									className={cn('float-on-hover group relative min-w-[8.5rem] shrink-0 snap-start rounded-card-sm border bg-white p-5 text-left transition-all duration-400 sm:min-w-0', open ? 'border-accent shadow-[var(--shadow-soft)]' : 'border-line hover:border-accent/40', on ? 'opacity-100' : 'opacity-40 motion-reduce:opacity-100')}>
									<span className="text-xs font-bold tracking-[0.16em] text-accent-deep">{s.n}</span>
									<span className="mt-3 block"><Icon3D icon={s.icon} size={52} tone={open ? 'blue' : 'white'} /></span>
									<span className="mt-5 block text-[1.0625rem] leading-snug font-bold">{s.keyword}</span>
								</button>
							);
						})}
					</div>
					<div id="step-panel" role="tabpanel" aria-labelledby={`step-tab-${active}`} className="mt-4 rounded-card-sm bg-white p-6 text-lg text-ink-soft ring-1 ring-line sm:p-8">
						<p key={active} className="hero-in max-w-3xl">
							<strong className="font-bold text-ink">{steps[active].keyword}.</strong> {steps[active].open}
						</p>
					</div>
				</div>

				<div className="mt-10 grid gap-4 md:grid-cols-2">
					<div className="rounded-card-sm bg-white p-6 ring-1 ring-line">
						<p className="text-xs font-bold tracking-[0.16em] text-accent-deep uppercase">Way in A · Free assessment</p>
						<p className="mt-2 text-ink-soft">For people who know something is wrong but not exactly what.</p>
					</div>
					<div className="rounded-card-sm bg-white p-6 ring-1 ring-line">
						<p className="text-xs font-bold tracking-[0.16em] text-accent-deep uppercase">Way in B · Book a consultation</p>
						<p className="mt-2 text-ink-soft">For people who can name the decision they need help with. <SiteLink href="/paid-consultation" className="prose-link font-semibold text-accent-deep">Book a consultation →</SiteLink></p>
					</div>
				</div>
				<div className="mt-9"><Button href="/business-assessment" size="lg">Start with the free assessment</Button></div>
			</Container>
		</section>
	);
}
