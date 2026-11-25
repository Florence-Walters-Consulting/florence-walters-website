import type { Metadata } from 'next';
import Image from 'next/image';
import { Award, Compass, Headset, SlidersHorizontal } from 'lucide-react';
import { AssessmentCta } from '@/components/home/AssessmentCta';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon3D } from '@/components/ui/Icon3D';
import { PageHero } from '@/components/ui/PageHero';
import { ReadMore } from '@/components/ui/ReadMore';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import { SiteLink } from '@/components/ui/SiteLink';
import { homeServices } from '@/data/home';
import { media } from '@/data/media';

export const metadata: Metadata = {
	title: 'About',
	description: 'Florence Walters Consulting gives African businesses the quality of advisory support that was once available only to the largest corporations.',
};

const principles = [
	['01', 'Understand first', 'We learn your business, your sector and your goals before we recommend anything.'],
	['02', 'Advise with clarity', 'Complex rules turned into plain language and clear next steps. No jargon.'],
	['03', 'Stay in the room', "We don't hand over a report and disappear. We stay through delivery."],
];

const trust = [
	{ icon: Compass, title: 'Clear, simple guidance', text: 'Complex requirements in simple steps, so you always know what to do next.' },
	{ icon: Award, title: 'Experienced, practical support', text: 'Real hands-on help, based on experience.' },
	{ icon: SlidersHorizontal, title: 'Tailored to your business', text: 'Solutions that fit your needs and goals.' },
	{ icon: Headset, title: 'Reliable and responsive', text: "Easy to reach and quick to respond when you need us." },
];

export default function About() {
	return (
		<>
			<PageHero
				eyebrow="About"
				lines={['Built for', 'African businesses.']}
				lead="We give African businesses the quality of advisory support that was once available only to the largest corporations."
				image={media.about}
				actions={
					<>
						<Button href="/business-assessment" size="lg">Take the free assessment</Button>
						<Button href="/services" variant="outline" size="lg" arrow={false}>Our services</Button>
					</>
				}
			/>

			<section className="section-space">
				<Container className="grid items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-20">
					<Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
						<div className="relative aspect-[4/5] overflow-hidden rounded-card bg-mist shadow-lift">
							<Image src={media.aboutStory} alt="Two African business professionals celebrating success" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
						</div>
					</Reveal>
					<div>
						<SectionHead label="Why we started" title="Good ideas fail without the right guidance at the right time." />
						<div className="mt-6 grid max-w-2xl gap-4 text-lg text-ink-soft">
							<ReadMore className="text-lg text-ink-soft">
								Florence Walters spent over a decade working within Nigeria&apos;s regulatory and financial ecosystem before founding FWC. She saw compliance problems that could have been avoided, business structures that created unnecessary tax burdens, and growth opportunities missed for lack of planning. So she built FWC to simplify the process, with clear guidance and practical support every step of the way.
							</ReadMore>
						</div>
					</div>
				</Container>
			</section>

			<section className="section-space bg-mist">
				<Container>
					<SectionHead label="What we do" title="Five services, each ending in something real in your hands." />
					<ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
						{homeServices.map((s) => (
							<li key={s.slug}>
								<SiteLink href={`/services/${s.slug}`} className="group float-on-hover flex h-full flex-col rounded-card-sm border border-line bg-white p-5 transition-colors hover:border-accent/40">
									<Icon3D icon={s.icon} badge={s.badge} size={56} />
									<span className="mt-5 block font-bold">{s.name}</span>
								</SiteLink>
							</li>
						))}
					</ul>
					<div className="mt-9"><Button href="/services">All services</Button></div>
				</Container>
			</section>

			<section className="section-space">
				<Container>
					<SectionHead label="How we work" title="Three principles behind every engagement." />
					<ol className="mt-10 grid gap-4 md:grid-cols-3">
						{principles.map(([n, t, d], i) => (
							<Reveal as="li" key={n} delay={i * 0.06} className="rounded-card border border-line bg-white p-7">
								<span className="text-4xl font-black text-accent-deep">{n}</span>
								<h3 className="mt-6 text-2xl font-bold">{t}</h3>
								<p className="mt-3 text-ink-soft">{d}</p>
							</Reveal>
						))}
					</ol>
				</Container>
			</section>

			<section className="section-space bg-mist pt-[clamp(3.5rem,7vw,6rem)]">
				<Container>
					<SectionHead label="Why work with us" title="Practical, clear and reachable." />
					<ul className="mt-10 grid gap-4 sm:grid-cols-2">
						{trust.map((t, i) => (
							<Reveal as="li" key={t.title} delay={i * 0.05} className="flex gap-5 rounded-card-sm bg-white p-6 ring-1 ring-line">
								<Icon3D icon={t.icon} size={52} />
								<div>
									<h3 className="text-xl font-bold">{t.title}</h3>
									<p className="mt-1.5 text-ink-soft">{t.text}</p>
								</div>
							</Reveal>
						))}
					</ul>
				</Container>
			</section>

			<AssessmentCta title="Ready to get your business on track?" text="Take the free assessment and we'll show you the next step." />
		</>
	);
}
