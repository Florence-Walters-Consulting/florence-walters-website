import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Icon3D } from '@/components/ui/Icon3D';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { Scene3D } from '@/components/ui/Scene3D';
import { SiteLink } from '@/components/ui/SiteLink';
import { Button } from '@/components/ui/Button';
import { AssessmentCta } from '@/components/home/AssessmentCta';
import { homeServices } from '@/data/home';
import { servicePages } from '@/data/service-pages';
import { ShieldCheck, Stamp } from 'lucide-react';

export const metadata: Metadata = {
	title: 'Services',
	description: 'Five services, one team: business setup, regulatory licences, contracts and IP, advisory and growth, and marketing and brand.',
};

export default function ServicesIndex() {
	return (
		<>
			<PageHero
				eyebrow="Services"
				lines={['Five services.', 'One team.']}
				lead="Every stage of your business, from the first registration to the next raise."
				actions={<Button href="/business-assessment" size="lg">Take the free assessment</Button>}
				art={<Scene3D icon={Stamp} docs={['Certificate', 'Licence']} tiles={[ShieldCheck, Stamp]} />}
			/>
			<section className="section-space">
				<Container>
					<ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
						{homeServices.map((s, i) => (
							<Reveal as="li" key={s.slug} delay={i * 0.04}>
								<SiteLink href={`/services/${s.slug}`} className="group float-on-hover flex h-full flex-col rounded-card border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-soft)]">
									<Icon3D icon={s.icon} badge={s.badge} size={76} />
									<h2 className="mt-8 text-2xl leading-snug font-bold">{s.name}</h2>
									<p className="mt-3 text-ink-soft">{s.short}</p>
									<p className="mt-5 text-xs font-semibold tracking-[0.14em] text-ink-mute uppercase">You receive</p>
									<ul className="mt-2 grid gap-1 text-[0.9375rem]">
										{servicePages[s.slug].receive.slice(0, 3).map((r) => <li key={r} className="before:mr-2 before:text-accent-deep before:content-['•']">{r}</li>)}
									</ul>
									<span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-accent-deep">Learn more <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
								</SiteLink>
							</Reveal>
						))}
					</ul>
					<p className="mt-8 text-ink-soft">Already know what you need? <SiteLink href="/paid-consultation" className="prose-link font-semibold text-accent-deep">Book a paid consultation →</SiteLink></p>
				</Container>
			</section>
			<AssessmentCta />
		</>
	);
}
