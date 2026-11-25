import { Button } from '@/components/ui/Button';
import { MotionIcon } from '@/components/ui/MotionIcon';
import { TiltStage } from '@/components/ui/TiltStage';
import type { ServicePage } from '@/data/service-pages';

/**
 * The top of a service page: headline (its closing phrase shimmers), one line, two buttons, and Busola's hero animation for
 * this service on the right (transparent, so it sits on the lilac band; a still frame for reduced motion or data saver).
 */
export function ServiceHero({ page }: { page: ServicePage }) {
	const before = page.headline.slice(0, page.headline.length - page.accent.length).trim();
	return (
		<section className="relative isolate overflow-hidden bg-mist">
			<div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(48rem_32rem_at_85%_10%,rgb(107_104_247/0.20),transparent),radial-gradient(34rem_24rem_at_0%_100%,rgb(107_104_247/0.10),transparent)]" />
			<div className="page-container grid items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-20">
				<div className="max-w-2xl">
					<p className="hero-in label-dot text-sm font-semibold tracking-[0.16em] text-accent-deep uppercase">{page.name}</p>
					<h1 className="hero-in mt-4 text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.04] font-black tracking-[-0.03em] text-ink" style={{ animationDelay: '80ms' }}>
						{before} <span className="shine-text">{page.accent}</span>
					</h1>
					<p className="hero-in mt-5 max-w-xl text-lead text-ink-soft" style={{ animationDelay: '160ms' }}>{page.line}</p>
					<div className="hero-in mt-7 flex flex-wrap items-center gap-3" style={{ animationDelay: '240ms' }}>
						<Button href={page.action.href} size="lg">{page.action.label}</Button>
						<Button href={`/business-assessment?service=${page.slug}&full=1`} variant="outline" size="lg" arrow={false}>Take the free assessment</Button>
					</div>
				</div>
				<div className="hero-in" style={{ animationDelay: '200ms' }}>
					<TiltStage><MotionIcon kind="hero" name={page.motion} play="visible" className="mx-auto w-full max-w-xl" label={`${page.name} animation`} /></TiltStage>
				</div>
			</div>
		</section>
	);
}
