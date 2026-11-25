import { Button } from '@/components/ui/Button';
import { DocMock } from '@/components/ui/DocMock';
import { MotionIcon } from '@/components/ui/MotionIcon';
import { TiltStage } from '@/components/ui/TiltStage';
import type { ServicePage } from '@/data/service-pages';
import type { WorkItem } from '@/lib/work';
import { CertShowcase } from './CertShowcase';

/** Hero art for the services without a hero video: Busola's animated icon, with two document mock-ups fanned behind it. */
function IconScene({ page }: { page: ServicePage }) {
	return (
		<TiltStage>
			<div className="relative mx-auto aspect-[6/5] w-full max-w-lg" aria-hidden>
				<span className="absolute inset-[8%] rounded-full bg-accent/20 blur-3xl" />
				<DocMock title={page.art.docs[0]} kind="Document" rotate={-8} className="absolute top-[8%] left-[2%] w-[42%]" />
				<DocMock title={page.art.docs[1]} kind="Document" lines={5} rotate={7} className="absolute right-[2%] bottom-[6%] w-[44%]" />
				<MotionIcon name={page.motion} play="visible" className="absolute top-1/2 left-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2" />
			</div>
		</TiltStage>
	);
}

/**
 * The top of a service page: headline (its closing phrase shimmers), one line, two buttons, and live art on the right:
 * Busola's hero animation (Setup, Marketing), the real-certificate showcase (Licences) or the animated icon (the rest).
 */
export function ServiceHero({ page, certs }: { page: ServicePage; certs: Pick<WorkItem, 'slug' | 'code' | 'body' | 'certificateUrl'>[] }) {
	const before = page.headline.slice(0, page.headline.length - page.accent.length).trim();
	const feathered = page.motion === 'marketing' ? '[mask-image:radial-gradient(closest-side,#000_68%,transparent)]' : '';
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
					{page.heroKind === 'certs' ? (
						<CertShowcase items={certs} />
					) : page.heroKind === 'video' ? (
						<TiltStage><MotionIcon kind="hero" name={page.motion} play="visible" className={`mx-auto w-full max-w-xl ${feathered}`} label={`${page.name} animation`} /></TiltStage>
					) : (
						<IconScene page={page} />
					)}
				</div>
			</div>
		</section>
	);
}
