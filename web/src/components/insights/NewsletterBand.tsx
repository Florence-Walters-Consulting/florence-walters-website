import { Container } from '@/components/ui/Container';
import { NewsletterForm } from '@/components/site/NewsletterForm';

/** Subscribe card used under the insights pages. */
export function NewsletterBand() {
	return (
		<section className="pb-[clamp(4.5rem,9vw,8.5rem)]">
			<Container>
				<div className="relative isolate grid gap-10 overflow-hidden rounded-card bg-ink-deep p-8 text-white sm:p-14 lg:grid-cols-2 lg:items-center lg:gap-20">
					<span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_26rem_at_90%_0%,rgb(75_72_214/0.45),transparent)]" />
					<div>
						<p className="label-dot text-xs tracking-[0.18em] text-white/70 uppercase">The FWC briefing</p>
						<h2 className="mt-4 text-title">Stay informed<span className="stop">.</span></h2>
						<p className="mt-4 max-w-md text-lead text-white/75">Regulatory updates and business highlights, delivered to your inbox monthly.</p>
					</div>
					<NewsletterForm />
				</div>
			</Container>
		</section>
	);
}
