import { cn } from '@/lib/cn';

/** A progress ring with the count in the middle ("3 / 7"). The arc animates when the value changes. */
export function Ring({ value, total, size = 120, tone = 'dark', className }: { value: number; total: number; size?: number; tone?: 'dark' | 'light'; className?: string }) {
	const r = 44;
	const c = 2 * Math.PI * r;
	const pct = total ? value / total : 0;
	const dark = tone === 'dark';
	return (
		<span className={cn('relative inline-grid place-items-center', className)} style={{ width: size, height: size }} role="img" aria-label={`${value} of ${total}`}>
			<svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
				<circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className={dark ? 'stroke-white/15' : 'stroke-accent/15'} />
				<circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} className={cn('transition-[stroke-dashoffset] duration-700 ease-out-expo', dark ? 'stroke-accent-soft' : 'stroke-accent-btn')} />
			</svg>
			<span className={cn('relative text-3xl font-black tabular-nums', dark ? 'text-white' : 'text-ink')} style={{ fontSize: size * 0.28 }}>
				{value}<span className={dark ? 'text-white/45' : 'text-ink-mute'}>/{total}</span>
			</span>
		</span>
	);
}
