import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CalendarDays, CalendarPlus, Check, Clock, MapPin } from 'lucide-react';
import { EventCountdown } from '@/components/events/EventCountdown';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { getAllEventSlugs, getEventBySlug } from '@/db/queries/events';
import { formatEventDay, formatEventTimes } from '@/lib/events';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	const rows = await getAllEventSlugs();
	// An empty list is not allowed here: with no events the placeholder simply renders the not-found page.
	return rows.length ? rows.map(({ slug }) => ({ slug })) : [{ slug: 'none' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const event = await getEventBySlug((await params).slug);
	if (!event) return {};
	return { title: event.title, description: event.summary, openGraph: { title: event.title, description: event.summary, images: event.imageUrl ? [event.imageUrl] : undefined } };
}

export default async function EventPage({ params }: Props) {
	const { slug } = await params;
	const event = await getEventBySlug(slug);
	if (!event) notFound();
	return (
		<>
			<PageHero
				slim
				eyebrow="Insights & events"
				lines={[event.title]}
				lead={event.summary}
				actions={
					<>
						{event.registerUrl && <Button href={event.registerUrl} size="lg">Register now</Button>}
						<Button href={`/events/${event.slug}/calendar.ics`} variant="outline" size="lg" arrow={false}><span className="inline-flex items-center gap-2"><CalendarPlus className="size-4" />Add to calendar</span></Button>
					</>
				}
				art={event.imageUrl ? <img src={event.imageUrl} alt={`Flyer for ${event.title}`} className="mx-auto aspect-[4/5] w-full max-w-xs -rotate-2 rounded-card object-cover shadow-lift ring-1 ring-line" /> : undefined}
			/>
			<section className="section-space">
				<Container className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
					<div>
						<div className="article-body" dangerouslySetInnerHTML={{ __html: event.body }} />
						{event.bullets.length > 0 && (
							<div className="mt-10 rounded-card bg-mist p-7">
								<h2 className="text-heading">What you will learn</h2>
								<ul className="mt-4 grid gap-3">
									{event.bullets.map((b) => <li key={b} className="flex items-start gap-3"><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-btn text-white"><Check className="size-3.5" strokeWidth={3} /></span>{b}</li>)}
								</ul>
							</div>
						)}
						{event.hashtags && <p className="mt-8 text-sm text-ink-mute">{event.hashtags}</p>}
					</div>
					<aside className="self-start rounded-card border border-line bg-white p-7 lg:sticky lg:top-32">
						<p className="text-xs font-bold tracking-[0.16em] text-accent-deep uppercase">
							<EventCountdown startsAt={event.startsAt} endsAt={event.endsAt} fallback={formatEventDay(event.startsAt)} />
						</p>
						<ul className="mt-5 grid gap-4">
							<li className="flex items-start gap-3"><CalendarDays className="mt-0.5 size-5 text-accent-deep" />{formatEventDay(event.startsAt)}</li>
							<li className="flex items-start gap-3"><Clock className="mt-0.5 size-5 text-accent-deep" />{formatEventTimes(event.startsAt, event.endsAt)}</li>
							<li className="flex items-start gap-3"><MapPin className="mt-0.5 size-5 text-accent-deep" />{event.venue}</li>
						</ul>
						{event.registerUrl && <div className="mt-7"><Button href={event.registerUrl} size="lg" className="w-full">Register now</Button></div>}
					</aside>
				</Container>
			</section>
		</>
	);
}
