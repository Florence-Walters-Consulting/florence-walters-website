import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * A generic document mock-up for "what you receive": a titled sheet with placeholder lines and a seal.
 * It never carries a client name. Several can be fanned out with `rotate` and `className`.
 */
export function DocMock({ title, kind = 'Document', lines = 4, rotate = 0, className }: { title: string; kind?: string; lines?: number; rotate?: number; className?: string }) {
	return (
		<span className={cn('block rounded-xl border border-line bg-white p-4 shadow-[0_18px_36px_-18px_rgb(31_42_68/0.35)]', className)} style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
			<span className="flex items-center justify-between gap-2">
				<span className="text-[0.625rem] font-semibold tracking-[0.14em] text-accent-deep uppercase">{kind}</span>
				<BadgeCheck className="size-4 text-accent-deep" />
			</span>
			<span className="mt-2 block text-sm leading-snug font-bold text-ink">{title}</span>
			<span className="mt-3 grid gap-1.5">
				{Array.from({ length: lines }, (_, i) => (
					<span key={i} className="block h-1.5 rounded-full bg-mist-deep" style={{ width: `${100 - ((i * 17) % 40)}%` }} />
				))}
			</span>
			<span className="mt-3 flex items-end justify-between">
				<span className="block h-px w-14 bg-ink/30" />
				<span className="grid size-8 place-items-center rounded-full border-2 border-accent/50 text-[0.5rem] font-bold tracking-wider text-accent-deep/70">FWC</span>
			</span>
		</span>
	);
}
