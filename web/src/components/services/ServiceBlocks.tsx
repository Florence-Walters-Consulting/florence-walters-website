import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { FloatingShapes } from '@/components/ui/FloatingShapes';
import { SiteLink } from '@/components/ui/SiteLink';
import type { ServicePage } from '@/data/service-pages';

/** The last block: one button on a band with floating shapes, plus three FAQs for this service. */
export function NextStep({ page, startHref }: { page: ServicePage; startHref: string }) {
	return (
		<section id="next-step" className="section-space pt-0">
			<Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
				<div className="relative isolate self-start overflow-hidden rounded-card bg-accent-btn p-8 text-white sm:p-10">
					<FloatingShapes compact />
					<div className="relative">
						<h2 className="text-title">Ready to start?</h2>
						<p className="mt-4 text-lead text-white/85">Free, about 5 minutes. We reply within 1 business day.</p>
						<div className="mt-8"><Button href={startHref} size="lg" className="bg-white text-ink hover:bg-mist [&>span:last-child]:bg-ink [&>span:last-child]:text-white">{page.action.href.startsWith('#') ? 'Take the free assessment' : page.action.label}</Button></div>
						<p className="mt-6 text-sm text-white/80">Prefer to talk first? <SiteLink href="/contact" className="underline underline-offset-4">Book a free 15-minute call</SiteLink></p>
					</div>
				</div>
				<div>
					<h2 className="text-heading">Questions about this service</h2>
					<Accordion className="mt-6" defaultOpen="0" items={page.faqs.map((f, i) => ({ id: String(i), title: f.q, content: <p>{f.a}</p> }))} />
				</div>
			</Container>
		</section>
	);
}
