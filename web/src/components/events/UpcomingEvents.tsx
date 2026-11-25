import { Carousel } from '@/components/ui/Carousel';
import type { PublicEvent } from '@/lib/events';
import { EventFeature } from './EventFeature';

/** One event as a card; several as a swipeable carousel. Renders nothing when there are none. */
export function UpcomingEvents({ events }: { events: PublicEvent[] }) {
	if (events.length === 0) return null;
	if (events.length === 1) return <EventFeature event={events[0]} />;
	return <Carousel label="Upcoming events" loop={false} autoplayMs={9000} slideClassName="w-full" slides={events.map((e) => <EventFeature key={e.slug} event={e} />)} />;
}
