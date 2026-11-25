'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Swipeable carousel. It moves on its own every 6 s, pauses while hovered or touched, and always shows
 * arrows and dots under the slides (on phones too). Reduced-motion visitors get no auto-advance.
 */
export function Carousel({
	slides,
	label,
	slideClassName = 'w-full',
	autoplayMs = 6000,
	loop = true,
	tone = 'light',
	className,
}: {
	slides: React.ReactNode[];
	label: string;
	/** Width of each slide (Tailwind classes), e.g. `w-[85%] sm:w-1/2 lg:w-1/3`. */
	slideClassName?: string;
	autoplayMs?: number;
	loop?: boolean;
	tone?: 'light' | 'dark';
	className?: string;
}) {
	const plugins = useMemo(
		() => (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? [] : [Autoplay({ delay: autoplayMs, stopOnInteraction: false, stopOnMouseEnter: true })]),
		[autoplayMs],
	);
	const [viewport, embla] = useEmblaCarousel({ align: 'start', loop, containScroll: loop ? false : 'trimSnaps' }, plugins);
	const [index, setIndex] = useState(0);
	const [count, setCount] = useState(slides.length);

	const sync = useCallback(() => {
		if (!embla) return;
		setIndex(embla.selectedScrollSnap());
		setCount(embla.scrollSnapList().length);
	}, [embla]);

	useEffect(() => {
		if (!embla) return;
		const frame = requestAnimationFrame(sync);
		embla.on('select', sync).on('reInit', sync);
		return () => {
			cancelAnimationFrame(frame);
			embla.off('select', sync).off('reInit', sync);
		};
	}, [embla, sync]);

	const step = (dir: 1 | -1) => {
		if (!embla) return;
		(dir === 1 ? embla.scrollNext : embla.scrollPrev)();
		embla.plugins().autoplay?.reset?.();
	};
	const dark = tone === 'dark';
	const btn = dark ? 'border-white/35 text-white hover:bg-white hover:text-ink' : 'border-ink/25 text-ink hover:bg-accent-btn hover:text-white hover:border-accent-btn';

	return (
		<div className={className} role="region" aria-roledescription="carousel" aria-label={label}>
			<div ref={viewport} className="overflow-hidden">
				<ul className="-ml-4 flex touch-pan-y">
					{slides.map((slide, i) => (
						<li key={i} className={cn('min-w-0 shrink-0 pl-4', slideClassName)} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
							{slide}
						</li>
					))}
				</ul>
			</div>
			{count > 1 && (
				<div className="mt-6 flex items-center justify-center gap-4">
					<button type="button" onClick={() => step(-1)} aria-label="Previous" className={cn('grid size-11 place-items-center rounded-full border transition-colors', btn)}>
						<ArrowLeft className="size-4" />
					</button>
					<div className="flex items-center gap-2" role="tablist" aria-label={`${label} slides`}>
						{Array.from({ length: count }, (_, i) => (
							<button key={i} type="button" role="tab" aria-selected={i === index} aria-label={`Go to slide ${i + 1}`} onClick={() => embla?.scrollTo(i)} className={cn('h-2 rounded-full transition-all duration-300', i === index ? (dark ? 'w-6 bg-white' : 'w-6 bg-accent-btn') : dark ? 'w-2 bg-white/35' : 'w-2 bg-ink/20')} />
						))}
					</div>
					<button type="button" onClick={() => step(1)} aria-label="Next" className={cn('grid size-11 place-items-center rounded-full border transition-colors', btn)}>
						<ArrowRight className="size-4" />
					</button>
				</div>
			)}
		</div>
	);
}
