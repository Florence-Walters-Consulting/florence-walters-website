import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * Banner for standalone pages: a light lilac background, a short headline, one line and the actions, with a 3D
 * scene (`art`) or one photo on the right. Dark text on light, so it always reads, and it never fades or turns white on scroll.
 */
export function PageHero({
	eyebrow,
	lines,
	lead,
	actions,
	art,
	image,
	strip,
	slim,
	className,
}: {
	eyebrow: string;
	lines: string[];
	lead?: string;
	actions?: React.ReactNode;
	art?: React.ReactNode;
	image?: string;
	strip?: React.ReactNode;
	/** Tighter banner, for form pages. */
	slim?: boolean;
	/** Kept so older call sites still compile; the light banner ignores them. */
	compact?: boolean;
	focus?: string;
	watermark?: string;
	className?: string;
}) {
	const visual = art ?? (image ? (
		<div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-lift">
			<Image src={image} alt="" fill priority sizes="(min-width: 1024px) 40vw, 90vw" quality={72} className="object-cover" />
		</div>
	) : null);
	return (
		<section className={cn('relative isolate overflow-hidden bg-mist', className)}>
			<div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(48rem_32rem_at_85%_10%,rgb(107_104_247/0.20),transparent),radial-gradient(34rem_24rem_at_0%_100%,rgb(107_104_247/0.10),transparent)]" />
			<div className={cn('page-container grid items-center gap-10 lg:gap-16', visual && 'lg:grid-cols-[1.1fr_0.9fr]', slim ? 'py-12 lg:py-16' : 'py-14 lg:py-24')}>
				<div className="max-w-2xl">
					<p className="hero-in label-dot text-sm font-semibold tracking-[0.16em] text-accent-deep uppercase">{eyebrow}</p>
					<h1 className="hero-in mt-4 text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.04] font-black tracking-[-0.03em] text-ink" style={{ animationDelay: '80ms' }}>
						{lines.map((l, i) => (
							<span key={l} className={cn('block', i === lines.length - 1 && lines.length > 1 && 'text-accent-deep')}>{l}</span>
						))}
					</h1>
					{lead && <p className="hero-in mt-5 max-w-xl text-lead text-ink-soft" style={{ animationDelay: '160ms' }}>{lead}</p>}
					{actions && <div className="hero-in mt-7 flex flex-wrap items-center gap-3" style={{ animationDelay: '240ms' }}>{actions}</div>}
				</div>
				{visual && <div className="hero-in" style={{ animationDelay: '200ms' }}>{visual}</div>}
			</div>
			{strip && <div className="hero-in page-container pb-12 lg:pb-16" style={{ animationDelay: '300ms' }}>{strip}</div>}
		</section>
	);
}
