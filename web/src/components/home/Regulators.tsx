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
					{row.map((r, i) => {
						// "National Pension Commission (PenCom)" shows PenCom large with the full name under it; a name with no brackets is shown whole.
						const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(r.name);
						const short = m ? m[2] : r.name;
						const full = m ? m[1] : '';
						return (
							<div key={`${r.id}-${i}`} title={r.name} className="flex h-24 w-72 shrink-0 items-center gap-3.5 overflow-hidden rounded-card-sm border border-line bg-white px-4 shadow-[0_1px_0_rgb(31_42_68/0.04)] sm:w-80">
								<span className="grid size-14 shrink-0 place-items-center rounded-lg bg-mist p-1.5">
									<img src={imageUrl('partners', r.picture)} alt="" loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
								</span>
								<span className="min-w-0 flex-1">
									<span className="block truncate text-base leading-tight font-bold text-ink">{short}</span>
									{full && <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-ink-soft [overflow-wrap:anywhere]">{full}</span>}
								</span>
							</div>
						);
					})}
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
