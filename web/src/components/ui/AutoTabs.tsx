'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export type AutoTab = { id: string; title: string; badge?: string; text: string };

/**
 * Busola's "How it works" engine: a list of tabs on the left (the open one shows its sentence and a bar that fills over
 * `intervalMs`), and an animated stage on the right. It advances by itself while on screen; choosing a tab stops the
 * auto-advance for good (the visitor is in control). Reduced-motion visitors never get auto-advance.
 */
export function AutoTabs({
	tabs,
	stage,
	intervalMs = 6000,
	bigNumber = true,
	stageTone = 'dark',
	label,
	className,
	footer,
}: {
	tabs: AutoTab[];
	/** Renders the stage for the open tab. Give the root element `key={index}` so its entrance animations replay. */
	stage: (index: number) => React.ReactNode;
	intervalMs?: number;
	bigNumber?: boolean;
	stageTone?: 'dark' | 'light';
	label: string;
	className?: string;
	footer?: React.ReactNode;
}) {
	const [index, setIndex] = useState(0);
	const [manual, setManual] = useState(false);
	const [onScreen, setOnScreen] = useState(false);
	const reduced = useReducedMotion();
	const root = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = root.current;
		if (!el) return;
		const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.3 });
		io.observe(el);
		return () => io.disconnect();
	}, []);

	const auto = !manual && !reduced && onScreen;
	const dark = stageTone === 'dark';

	return (
		<div ref={root} className={cn('grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12', className)}>
			<div className="flex flex-col gap-3">
				<div role="tablist" aria-label={label} className="flex flex-col gap-2.5">
					{tabs.map((t, i) => {
						const open = i === index;
						return (
							<button
								key={t.id}
								type="button"
								role="tab"
								id={`tab-${t.id}`}
								aria-selected={open}
								onClick={() => {
									setIndex(i);
									setManual(true);
								}}
								className={cn('relative flex w-full items-start gap-4 overflow-hidden rounded-card-sm p-4 text-left transition-all duration-300 sm:p-5', open ? 'bg-white shadow-[0_24px_50px_-26px_rgb(31_42_68/0.4)]' : 'bg-transparent hover:bg-white/60')}>
								<span className={cn('grid size-11 shrink-0 place-items-center rounded-xl text-base font-black transition-colors duration-300', open ? 'bg-accent-btn text-white' : 'bg-mist-deep text-ink')}>{String(i + 1).padStart(2, '0')}</span>
								<span className="min-w-0">
									<span className="block text-lg leading-snug font-bold text-ink sm:text-xl">{t.title}</span>
									{t.badge && <span className="mt-1 block text-sm font-semibold text-accent-deep">{t.badge}</span>}
									{open && <span className="hero-in mt-2 block text-[0.9375rem] leading-relaxed text-ink-soft">{t.text}</span>}
								</span>
								{open && auto && (
									<span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-accent/15">
										<span key={`f-${index}`} className="tab-fill block h-full bg-accent-btn" style={{ ['--tab-duration' as string]: `${intervalMs}ms` }} onAnimationEnd={() => setIndex((x) => (x + 1) % tabs.length)} />
									</span>
								)}
							</button>
						);
					})}
				</div>
				{footer}
			</div>

			<div role="tabpanel" aria-labelledby={`tab-${tabs[index].id}`} className={cn('relative isolate flex min-h-[22rem] items-center justify-center overflow-hidden rounded-[2rem] p-6 sm:min-h-[28rem]', dark ? 'bg-ink-deep' : 'bg-white ring-1 ring-line')}>
				<span aria-hidden className={cn('absolute inset-0 -z-10 [background-size:22px_22px]', dark ? '[background-image:radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)]' : '[background-image:radial-gradient(rgb(31_42_68/0.07)_1px,transparent_1px)]')} />
				<span aria-hidden className="absolute top-1/2 left-1/2 -z-10 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(107_104_247/0.38)_0%,transparent_62%)]" />
				{bigNumber && <span aria-hidden className={cn('pointer-events-none absolute right-4 bottom-[-2rem] -z-10 text-[12rem] leading-none font-black tracking-tighter select-none', dark ? 'text-white/[0.04]' : 'text-accent/[0.06]')}>{String(index + 1).padStart(2, '0')}</span>}
				{stage(index)}
				<span aria-hidden className="absolute bottom-5 left-6 flex gap-2">
					{tabs.map((t, i) => <span key={t.id} className={cn('h-2 rounded-full transition-all duration-400', i === index ? (dark ? 'w-8 bg-accent-soft' : 'w-8 bg-accent') : dark ? 'w-2 bg-white/30' : 'w-2 bg-ink/20')} />)}
				</span>
			</div>
		</div>
	);
}
