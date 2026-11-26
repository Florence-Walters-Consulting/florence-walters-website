import { ArrowRight, Mic } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import { SiteLink } from '@/components/ui/SiteLink';
import { UpcomingEvents } from '@/components/events/UpcomingEvents';
import { homeFaqs } from '@/data/home';
import { getFeaturedBlogs } from '@/db/queries/blog';
import { getFaqs } from '@/db/queries/content';
import { getUpcomingEvents } from '@/db/queries/events';
import { formatDate } from '@/lib/format';
import { imageUrl } from '@/lib/images';

/** Webinar banner, the two or three latest articles, and the FAQ. */
export async function InsightsEvents() {
	const [blogs, cms, events] = await Promise.all([getFeaturedBlogs(), getFaqs(), getUpcomingEvents()]);
	// The FAQ is managed in the admin; the five questions from the content pack are the fallback.
	const faqs = cms.length
		? cms.slice(0, 6).map((f) => ({ id: String(f.id), title: f.question, content: <div className="space-y-3" dangerouslySetInnerHTML={{ __html: f.body }} /> }))
		: homeFaqs.map((f, i) => ({ id: String(i), title: f.q, content: <p>{f.a}</p> }));

	return (
		<>
			<section id="insights" className="section-space">
				<Container>
					<Reveal>
						{events.length > 0 ? (
							<UpcomingEvents events={events} />
						) : (
							<div className="flex flex-col gap-6 rounded-card bg-[linear-gradient(120deg,#6b68f7,#4a46d6)] p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
								<div className="flex items-center gap-5">
									<span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/20"><Mic className="size-6" /></span>
									<div>
										<p className="text-xs font-bold tracking-[0.16em] text-white/75 uppercase">Webinars</p>
										<p className="mt-1 text-xl leading-snug font-bold sm:text-2xl">Practical sessions for business owners. Hear about the next one first.</p>
									</div>
								</div>
								<Button href="#newsletter" variant="light" className="shrink-0 bg-white text-ink hover:bg-mist [&>span:last-child]:bg-ink [&>span:last-child]:text-white">Get notified</Button>
							</div>
						)}
					</Reveal>

					{blogs.length > 0 && (
						<>
							<SectionHead className="mt-16" label="Insights" title="Fresh thinking for growing businesses." />
							<ul className="mt-10 grid gap-5 md:grid-cols-3">
								{blogs.slice(0, 3).map((b, i) => (
									<Reveal as="li" key={b.id} delay={i * 0.05}>
										<SiteLink href={`/blog/${b.slug}`} className="group block h-full overflow-hidden rounded-card border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
											<img src={imageUrl('blog', b.picture)} alt="" loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
											<div className="p-6">
												<p className="flex flex-wrap items-center gap-3 text-sm text-ink-mute">
													<span className="rounded bg-mist px-2.5 py-1 text-xs font-semibold tracking-wider text-accent-deep uppercase">{b.category_name || b.category}</span>
													{formatDate(b.date)}
												</p>
												<h3 className="mt-3 text-lg leading-snug font-bold transition-colors group-hover:text-accent-deep">{b.heading}</h3>
												<span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-deep">Read more <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
											</div>
										</SiteLink>
									</Reveal>
								))}
							</ul>
							<div className="mt-8"><Button href="/blog" variant="outline">All insights</Button></div>
						</>
					)}
				</Container>
			</section>

			<section id="faq" className="section-space bg-mist pt-[clamp(3.5rem,7vw,6rem)]">
				<Container className="max-w-4xl">
					<p className="label-dot mb-6 text-sm font-semibold tracking-[0.14em] text-accent-deep uppercase">FAQ</p>
					<Accordion defaultOpen={faqs[0]?.id} items={faqs} />
				</Container>
			</section>
		</>
	);
}
