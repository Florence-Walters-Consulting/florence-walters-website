'use client';

import { useEffect, useRef, useState } from 'react';
import { ClipboardList, MessageSquareQuote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon3D } from '@/components/ui/Icon3D';
import { SectionHead } from '@/components/ui/SectionHead';
import { cn } from '@/lib/cn';
import { steps } from '@/data/home';

/**
 * Five steps in one horizontal row, each an icon and a few words. Tapping a step opens its sentence inside the card.
 * When the row first scrolls into view the steps light up in order. Under it, two ways to begin.
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

				<div ref={root} role="tablist" aria-label="Steps" className="-mx-5 mt-12 flex snap-x items-start gap-3 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
					{steps.map((s, i) => {
						const open = i === active;
						return (
							<button
								key={s.n}
								type="button"
								role="tab"
								aria-selected={open}
								aria-expanded={open}
								onClick={() => setActive(i)}
								className={cn('float-on-hover group min-w-[10rem] shrink-0 snap-start rounded-card-sm border bg-white p-5 text-left transition-all duration-400 sm:min-w-0', open ? 'border-accent shadow-[var(--shadow-soft)]' : 'border-line hover:border-accent/40', i < lit ? 'opacity-100' : 'opacity-40 motion-reduce:opacity-100')}>
								<span className="text-xs font-bold tracking-[0.16em] text-accent-deep">{s.n}</span>
								<span className="mt-3 block"><Icon3D icon={s.icon} size={52} tone={open ? 'blue' : 'white'} /></span>
								<span className="mt-5 block text-[1.0625rem] leading-snug font-bold">{s.keyword}</span>
								{open && <span className="hero-in mt-3 block text-[0.9375rem] leading-relaxed font-normal text-ink-soft">{s.open}</span>}
							</button>
						);
					})}
				</div>

				<div className="mt-14 grid gap-4 md:grid-cols-2">
					<div className="flex flex-col rounded-card border border-line bg-white p-7 sm:p-9">
						<Icon3D icon={ClipboardList} size={56} />
						<h3 className="mt-7 text-2xl leading-snug font-bold">Not sure where to start?</h3>
						<p className="mt-2 text-ink-soft">Tell us about your business in a few minutes and we will show you what to do first. Free.</p>
						<div className="mt-7"><Button href="/business-assessment" size="lg">Start with the free assessment</Button></div>
					</div>
					<div className="flex flex-col rounded-card border border-line bg-white p-7 sm:p-9">
						<Icon3D icon={MessageSquareQuote} size={56} tone="navy" />
						<h3 className="mt-7 text-2xl leading-snug font-bold">Know the decision you need help with?</h3>
						<p className="mt-2 text-ink-soft">Book a session on structure, strategy, tax planning or marketing. The fee is confirmed before you book, and you leave with a short written recommendation.</p>
						<div className="mt-7"><Button href="/paid-consultation" variant="outline" size="lg">Book a consultation</Button></div>
					</div>
				</div>
			</Container>
		</section>
	);
}
