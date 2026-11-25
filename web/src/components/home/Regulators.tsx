import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Marquee } from '@/components/ui/Marquee';
import { SectionHead } from '@/components/ui/SectionHead';
import { SiteLink } from '@/components/ui/SiteLink';
import { regulatorsHeading } from '@/data/home';
import { getPartners } from '@/db/queries/content';
import { imageUrl } from '@/lib/images';

/** One slow row of regulator name cards (managed in the admin under Regulators). It waits while the hero is on screen. */
export async function Regulators() {
	const logos = await getPartners();
	// A short list is repeated so the loop never shows a gap on wide screens.
	const row = logos.length ? Array.from({ length: Math.ceil(12 / logos.length) }, () => logos).flat() : [];
	return (
		<section className="bg-mist py-14 sm:py-16" aria-label="Regulators we file with">
			<Container>
				<SectionHead title={regulatorsHeading} />
			</Container>
			{row.length > 0 && (
				<Marquee className="mt-9" duration={Math.max(60, row.length * 6)} yieldTo={['#hero']}>
					{row.map((r, i) => (
						<div key={`${r.id}-${i}`} className="flex h-20 w-56 shrink-0 items-center gap-3 rounded-card-sm border border-line bg-white px-4 shadow-[0_1px_0_rgb(31_42_68/0.04)]">
							<img src={imageUrl('partners', r.picture)} alt="" loading="lazy" decoding="async" className="h-11 w-14 shrink-0 object-contain" />
							<span className="text-sm leading-tight font-semibold text-ink">{r.name}</span>
						</div>
					))}
				</Marquee>
			)}
			<Container className="mt-8">
				<SiteLink href="/services/regulatory-licensing-compliance" className="group inline-flex items-center gap-2 font-semibold text-accent-deep">
					See which licences your business needs <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
				</SiteLink>
			</Container>
		</section>
	);
}
