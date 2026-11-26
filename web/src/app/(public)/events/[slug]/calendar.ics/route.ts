import { getEventBySlug } from '@/db/queries/events';
import { eventDate } from '@/lib/events';

const stamp = (s: string) => eventDate(s).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Add-to-calendar file (.ics) for one event. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const event = await getEventBySlug(slug);
	if (!event) return new Response('Not found', { status: 404 });
	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Florence Walters Consulting//Events//EN',
		'CALSCALE:GREGORIAN',
		'BEGIN:VEVENT',
		`UID:${event.slug}@florencewaltersconsulting.com`,
		`DTSTAMP:${stamp(event.startsAt)}`,
		`DTSTART:${stamp(event.startsAt)}`,
		`DTEND:${stamp(event.endsAt)}`,
		`SUMMARY:${esc(event.title)}`,
		`DESCRIPTION:${esc([event.summary, event.registerUrl && `Register: ${event.registerUrl}`].filter(Boolean).join('\n'))}`,
		`LOCATION:${esc(event.venue)}`,
		...(event.registerUrl ? [`URL:${event.registerUrl}`] : []),
		'END:VEVENT',
		'END:VCALENDAR',
	];
	return new Response(lines.join('\r\n'), { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="${event.slug}.ics"` } });
}
