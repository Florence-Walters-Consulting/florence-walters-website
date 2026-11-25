import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { MotionIcon } from '@/components/ui/MotionIcon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import { SiteLink } from '@/components/ui/SiteLink';
import { homeServices } from '@/data/home';

/** The five services, shown once: a 3D icon, the name, one line and a link. Nothing else on the card. */
export function WhatWeDo() {
	return (
		<section id="services" className="section-space">
			<Container>
				<SectionHead label="What we do" title="Five services. One team. Every stage of your business." />
				<ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
					{homeServices.map((s, i) => (
						<Reveal as="li" key={s.slug} delay={i * 0.05}>
							<SiteLink href={`/services/${s.slug}`} data-motion-host className="group lift3d flex h-full flex-col rounded-card border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-soft)]">
								<MotionIcon name={s.motion} play="hover" size={104} className="-mt-2 -ml-2" />
								<h3 className="mt-5 text-xl leading-snug font-bold">{s.name}</h3>
								<p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{s.short}</p>
								<span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-accent-deep">
									Learn more <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
								</span>
							</SiteLink>
						</Reveal>
					))}
				</ul>
				<p className="mt-8 text-ink-soft">
					Already know what you need? <SiteLink href="/paid-consultation" className="prose-link font-semibold text-accent-deep">Book a paid consultation →</SiteLink>
				</p>
			</Container>
		</section>
	);
}
