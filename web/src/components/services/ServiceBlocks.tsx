import { Check } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { DocMock } from '@/components/ui/DocMock';
import { SectionHead } from '@/components/ui/SectionHead';
import { SiteLink } from '@/components/ui/SiteLink';
import { goals, type ServicePage } from '@/data/service-pages';

/** Block 2: three or four situations, in the words a client would use. */
export function ForYou({ items }: { items: string[] }) {
	return (
		<section className="section-space pb-0">
			<Container>
				<SectionHead label="Is this for you?" title="Does this sound like you?" />
				<ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{items.map((t) => (
						<li key={t} className="flex flex-col gap-4 rounded-card-sm border border-line bg-white p-6">
							<span className="grid size-9 place-items-center rounded-full bg-accent/15 text-accent-deep"><Check className="size-5" strokeWidth={2.5} /></span>
							<span className="text-lg leading-snug font-semibold text-ink">{t}</span>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}

/** Block 3: a short list. Each item opens one sentence when tapped. */
export function Included({ page }: { page: ServicePage }) {
	return (
		<section className="section-space pb-0">
			<Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
				<SectionHead label="What's included" title="What we do for you." line="Tap an item to read more.">
					{page.addOn && <p className="text-sm text-ink-soft">{page.addOn}</p>}
				</SectionHead>
				<Accordion items={page.included.map((it, i) => ({ id: String(i), title: it.t, content: <p>{it.d}</p> }))} />
			</Container>
		</section>
	);
}

/** Block 4: the real documents they walk away with, as 3D document mock-ups with no names on them. */
export function Receive({ page }: { page: ServicePage }) {
	return (
		<section className="section-space">
			<Container>
				<SectionHead label="What you receive" title="The documents you walk away with." />
				<ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
					{page.receive.map((r, i) => (
						<li key={r} className="float-on-hover">
							<span className="float-target block"><DocMock title={r} kind="Document" lines={3} rotate={i % 2 === 0 ? -2 : 2} /></span>
						</li>
					))}
				</ul>
				{page.notIncluded && <p className="mt-8 text-sm text-ink-soft">{page.notIncluded}</p>}
			</Container>
		</section>
	);
}

/** Block 5: a short checklist of what we need from the client. */
export function Need({ items }: { items: string[] }) {
	return (
		<section className="section-space bg-mist py-[clamp(3.5rem,7vw,6rem)]">
			<Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
				<SectionHead label="What we need from you" title="Keep these to hand." />
				<ul className="grid gap-3 sm:grid-cols-2">
					{items.map((t) => (
						<li key={t} className="flex items-start gap-3 rounded-card-sm bg-white p-5 ring-1 ring-line">
							<span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-accent-btn text-white"><Check className="size-4" strokeWidth={3} /></span>
							<span className="font-medium">{t}</span>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}

/** Block 6: one button, plus three FAQs for this service. */
export function NextStep({ page }: { page: ServicePage }) {
	return (
		<section id="next-step" className="section-space">
			<Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
				<div className="self-start rounded-card bg-accent-btn p-8 text-white sm:p-10">
					<h2 className="text-title">Ready to start?</h2>
					<p className="mt-4 text-lead text-white/85">Free, about 5 minutes. We reply within 1 business day.</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<Button href={page.action.href.startsWith('#') ? `/business-assessment?service=${page.slug}` : page.action.href} size="lg" className="bg-white text-ink hover:bg-mist [&>span:last-child]:bg-ink [&>span:last-child]:text-white">{page.action.href.startsWith('#') ? 'Take the free assessment' : page.action.label}</Button>
					</div>
					<p className="mt-6 text-sm text-white/80">Prefer to talk first? <SiteLink href="/contact" className="underline underline-offset-4">Book a free 15-minute call</SiteLink></p>
				</div>
				<div>
					<h2 className="text-heading">Questions about this service</h2>
					<Accordion className="mt-6" defaultOpen="0" items={page.faqs.map((f, i) => ({ id: String(i), title: f.q, content: <p>{f.a}</p> }))} />
				</div>
			</Container>
		</section>
	);
}

/** Advisory only: six goal tiles; each opens the short advisory form with that goal already chosen. */
export function GoalTiles({ slug }: { slug: string }) {
	return (
		<section id="goals" className="section-space bg-mist">
			<Container>
				<SectionHead label="Pick your goal" title="What are you trying to achieve?" />
				<ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{goals.map((g) => (
						<li key={g.key}>
							<SiteLink href={`/business-assessment?service=${slug}&goal=${g.key}`} className="group flex items-center justify-between gap-4 rounded-card-sm border border-line bg-white p-6 text-lg font-bold transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-[var(--shadow-soft)]">
								{g.label}
								<span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist text-accent-deep transition-colors group-hover:bg-accent-btn group-hover:text-white" aria-hidden>→</span>
							</SiteLink>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
