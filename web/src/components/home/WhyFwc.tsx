import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { CountUp } from '@/components/ui/CountUp';
import { Icon3D } from '@/components/ui/Icon3D';
import { SectionHead } from '@/components/ui/SectionHead';
import { proofOverrides, reasons } from '@/data/home';
import { getPartners } from '@/db/queries/content';
import { getPublishedWork } from '@/db/queries/work';
import { ProofDeck } from './ProofDeck';

/**
 * Why FWC and proof, on the one navy feature band. Numbers are real or absent: they come from the work highlights and the
 * Regulators list unless overridden in data/home.ts, and a number with no real figure is left out rather than rounded up.
 */
export async function WhyFwc() {
	const [work, partners] = await Promise.all([getPublishedWork(), getPartners()]);
	// The deck shows real certificates only: CAC, SCUML and NOGIC first, then any others.
	const preferred = ['cac', 'scuml', 'nogic-jqs'];
	const withImage = work.filter((w) => w.certificateUrl);
	const deck = [...preferred.map((slug) => withImage.find((w) => w.slug === slug)).filter((w) => w !== undefined), ...withImage.filter((w) => !preferred.includes(w.slug))].slice(0, 5);
	const counters = [
		{ value: proofOverrides.secured ?? (work.length || null), label: 'registrations and licences secured' },
		{ value: proofOverrides.regulators ?? (partners.length || null), label: 'regulators filed with' },
		{ value: proofOverrides.businesses, label: 'businesses supported' },
	].filter((c): c is { value: number; label: string } => c.value !== null && c.value > 0);

	return (
		<section id="why-fwc" className="section-space overflow-hidden bg-ink-deep text-white">
			<Container className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
				<div>
					<SectionHead tone="dark" label="Why FWC" title="Most advisors stop at a recommendation. We finish the job." />
					{counters.length > 0 && (
						<dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
							{counters.map((c) => (
								<div key={c.label}>
									<dd className="text-5xl font-black tracking-tight text-white sm:text-6xl"><CountUp to={c.value} /></dd>
									<dt className="mt-2 text-sm text-white/65">{c.label}</dt>
								</div>
							))}
						</dl>
					)}
					<ul className="mt-10 grid gap-4 sm:grid-cols-2">
						{reasons.map((r) => (
							<li key={r.title} className="flex items-center gap-4 rounded-card-sm bg-white/[0.06] p-4 ring-1 ring-white/10">
								<Icon3D icon={r.icon} size={44} tone="white" />
								<span className="font-semibold">{r.title}</span>
							</li>
						))}
					</ul>
					<div className="mt-10"><Button href="/work" variant="light" size="lg">See our work</Button></div>
				</div>
				{deck.length > 0 && <ProofDeck items={deck} />}
			</Container>
		</section>
	);
}
