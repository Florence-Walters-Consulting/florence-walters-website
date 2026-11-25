'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroVideo } from '@/components/ui/HeroVideo';
import { SiteLink } from '@/components/ui/SiteLink';
import { cn } from '@/lib/cn';
import { heroLine, heroSlides, heroStages } from '@/data/home';
import { media } from '@/data/media';

const SLIDE_SECONDS = 6;

const backgrounds = {
	structure: media.heroStructure,
	strategy: media.heroStrategy,
	excellence: media.heroExcellence,
} as const;

/**
 * Three-slide hero (Structure, Strategy, Excellence) under one fixed line that is the page's h1.
 * The incoming slide fades in over the outgoing one, which stays fully visible underneath, so there is no
 * flash between slides. Arrows and dots are always shown, and slides swipe on phones. Every 6 s it
 * moves on by itself; hovering or touching pauses it. Reduced-motion visitors get the still image and no auto-advance.
 */
export function Hero() {
	const [index, setIndex] = useState(0);
	const [prev, setPrev] = useState<number | null>(null);
	const [held, setHeld] = useState(false);
	const startX = useRef<number | null>(null);
	const n = heroSlides.length;

	const go = (i: number) => {
		const to = (i + n) % n;
		if (to === index) return;
		setPrev(index);
		setIndex(to);
	};
	const slide = heroSlides[index];

	return (
		<section
			id="hero"
			className={cn('hero-root relative isolate min-h-[calc(100svh-6.75rem)] touch-pan-y overflow-hidden bg-ink-deep text-white', held && '[&_.hero-progress]:[animation-play-state:paused]')}
			aria-roledescription="carousel"
			aria-label="Florence Walters Consulting"
			onPointerDown={(e) => {
				startX.current = e.clientX;
				setHeld(true);
			}}
			onPointerUp={(e) => {
				if (startX.current !== null) {
					const dx = e.clientX - startX.current;
					if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
				}
				startX.current = null;
				setHeld(false);
			}}
			onPointerCancel={() => {
				startX.current = null;
				setHeld(false);
			}}>
			{/* Backgrounds: the incoming slide fades in above the outgoing one. */}
			{heroSlides.map((s, i) => {
				const m = backgrounds[s.id];
				const active = i === index;
				return (
					<div key={s.id} aria-hidden className={cn('absolute inset-0 transition-opacity duration-[900ms] ease-soft', active || i === prev ? 'opacity-100' : 'opacity-0')} style={{ zIndex: active ? -8 : i === prev ? -9 : -10 }}>
						<Image src={m.poster} alt="" fill priority={i === 0} sizes="100vw" quality={70} className="object-cover" />
						{'video' in m && <HeroVideo src={m.video} active={active} className="absolute inset-0" />}
					</div>
				);
			})}
			{/* Navy overlay, heaviest bottom left, so the white headline is always readable. */}
			<div aria-hidden className="absolute inset-0 -z-[7] bg-gradient-to-tr from-ink-deep/90 via-ink-deep/60 to-ink-deep/25" />
			<div aria-hidden className="absolute inset-x-0 bottom-0 -z-[7] h-3/4 bg-gradient-to-t from-ink-deep/85 to-transparent" />

			<div className="page-container relative flex min-h-[calc(100svh-6.75rem)] flex-col justify-end pt-16 pb-28 lg:pb-32">
				<h1 className="max-w-2xl border-l-2 border-accent pl-4 text-[1.0625rem] leading-snug font-medium text-white/90 sm:text-xl">{heroLine}</h1>

				<div key={slide.id} className="mt-8 max-w-4xl" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${n}`}>
					<p className="hero-in label-dot text-sm font-semibold tracking-[0.2em] text-accent-soft uppercase">{slide.label}</p>
					<h2 className="hero-in mt-4 text-display font-black text-white" style={{ animationDelay: '80ms' }}>{slide.headline}</h2>
					{slide.line && <p className="hero-in mt-5 max-w-xl text-lead text-white/80" style={{ animationDelay: '160ms' }}>{slide.line}</p>}
					{slide.id === 'strategy' && (
						<ul className="hero-in mt-6 flex flex-wrap gap-2.5" style={{ animationDelay: '160ms' }}>
							{heroStages.map((s) => (
								<li key={s.label}>
									<SiteLink href={s.href} className="inline-flex min-h-11 items-center rounded-full border border-white/40 bg-white/10 px-5 text-[0.9375rem] font-medium backdrop-blur-sm transition-colors hover:bg-white hover:text-ink">
										{s.label}
									</SiteLink>
								</li>
							))}
						</ul>
					)}
					<div className="hero-in mt-8" style={{ animationDelay: '240ms' }}>
						<Button href={slide.button.href} variant="light" size="lg">{slide.button.label}</Button>
					</div>
				</div>
			</div>

			{/* Controls: arrows and dots, always visible. The dot of the current slide fills as the 6 s run. */}
			<div className="absolute inset-x-0 bottom-0">
				<div className="page-container flex items-center gap-4 pb-7">
					<button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className="grid size-11 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur transition-colors hover:bg-white hover:text-ink">
						<ArrowLeft className="size-4" />
					</button>
					<div role="tablist" aria-label="Choose slide" className="flex items-center gap-2.5">
						{heroSlides.map((s, i) => (
							<button key={s.id} role="tab" aria-selected={i === index} aria-label={s.label} onClick={() => go(i)} className="group relative h-2 overflow-hidden rounded-full bg-white/30 transition-all duration-300" style={{ width: i === index ? '3.5rem' : '0.5rem' }}>
								{i === index && (
									<span key={`p-${index}`} className="hero-progress absolute inset-0 rounded-full bg-white" style={{ '--hero-duration': `${SLIDE_SECONDS}s` } as React.CSSProperties} onAnimationEnd={() => go(index + 1)} />
								)}
							</button>
						))}
					</div>
					<button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className="grid size-11 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur transition-colors hover:bg-white hover:text-ink">
						<ArrowRight className="size-4" />
					</button>
					<p className="ml-2 hidden text-sm text-white/70 sm:block" aria-hidden>{slide.label}</p>
				</div>
			</div>
		</section>
	);
}
