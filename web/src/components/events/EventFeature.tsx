import { ArrowRight, CalendarDays, Check, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SiteLink } from '@/components/ui/SiteLink';
import { formatEventDay, formatEventTimes, type PublicEvent } from '@/lib/events';
import { EventCountdown } from './EventCountdown';

/** An upcoming event as a feature card: the flyer, when and where, what you will learn, and the register button. */
export function EventFeature({ event }: { event: PublicEvent }) {
	return (
		<article className="relative isolate overflow-hidden rounded-card bg-[linear-gradient(120deg,#6b68f7,#4a46d6)] p-6 text-white sm:p-9">
			<span aria-hidden className="absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-white/10 blur-2xl" />
			<div className="grid items-center gap-8 md:grid-cols-[13rem_1fr] lg:grid-cols-[16rem_1fr] lg:gap-12">
				{event.imageUrl && (
					<SiteLink href={`/events/${event.slug}`} className="group mx-auto block w-48 md:w-full" aria-label={`${event.title}: details`}>
						<img src={event.imageUrl} alt={`Flyer for ${event.title}`} loading="lazy" decoding="async" className="aspect-[4/5] w-full -rotate-2 rounded-2xl object-cover shadow-[0_30px_60px_-24px_rgb(0_0_0/0.6)] ring-1 ring-white/30 transition-transform duration-500 ease-out-expo group-hover:rotate-0 group-hover:scale-[1.03]" />
					</SiteLink>
				)}
				<div className={event.imageUrl ? '' : 'md:col-span-2'}>
					<p className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase">
						<span className="rounded-full bg-white/20 px-3 py-1.5">Upcoming event</span>
						<EventCountdown startsAt={event.startsAt} endsAt={event.endsAt} fallback={formatEventDay(event.startsAt)} className="rounded-full bg-white px-3 py-1.5 text-accent-deep" />
					</p>
					<h3 className="mt-4 text-3xl leading-tight font-black tracking-tight sm:text-4xl">{event.title}</h3>
					{event.summary && <p className="mt-3 max-w-xl text-lead text-white/85">{event.summary}</p>}
					{event.bullets.length > 0 && (
						<ul className="mt-5 grid gap-2">
							{event.bullets.slice(0, 4).map((b) => (
								<li key={b} className="flex items-start gap-3 text-[0.9375rem] text-white/90"><Check className="mt-1 size-4 shrink-0" strokeWidth={3} />{b}</li>
							))}
						</ul>
					)}
					<ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
						<li className="flex items-center gap-2"><CalendarDays className="size-4" />{formatEventDay(event.startsAt)}</li>
						<li className="flex items-center gap-2"><Clock className="size-4" />{formatEventTimes(event.startsAt, event.endsAt)}</li>
						<li className="flex items-center gap-2"><MapPin className="size-4" />{event.venue}</li>
					</ul>
					<div className="mt-7 flex flex-wrap items-center gap-3">
						{event.registerUrl && <Button href={event.registerUrl} size="lg" className="bg-white text-ink hover:bg-mist [&>span:last-child]:bg-ink [&>span:last-child]:text-white">Register now</Button>}
						<SiteLink href={`/events/${event.slug}`} className="inline-flex items-center gap-2 px-2 py-3 font-semibold underline decoration-white/40 underline-offset-4 hover:decoration-white">
							Details <ArrowRight className="size-4" />
						</SiteLink>
					</div>
				</div>
			</div>
		</article>
	);
}
