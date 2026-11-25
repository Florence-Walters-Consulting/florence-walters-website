import { imageUrl } from './images';

// Events are stored in Lagos time (WAT, UTC+1, no daylight saving) as 'YYYY-MM-DD HH:mm:ss'.
const WAT = '+01:00';

/** The moment an event time string refers to. */
export const eventDate = (s: string) => new Date(`${s.replace(' ', 'T').slice(0, 19)}${WAT}`);

/** Current Lagos time as an event time string, for comparing with the database. */
export const nowWat = () => new Date().toLocaleString('sv-SE', { timeZone: 'Africa/Lagos' });

/** 'YYYY-MM-DD HH:mm:ss' <-> the value of a datetime-local input. */
export const toInput = (s: string) => s.slice(0, 16).replace(' ', 'T');
export const fromInput = (v: string) => `${v.replace('T', ' ')}:00`;

/** '' | media:<file> (public/media/events) | uploaded file name -> image URL. */
export function eventImageUrl(image: string): string | undefined {
	if (!image) return undefined;
	if (image.startsWith('media:')) return `/media/events/${image.slice(6)}`;
	return imageUrl('events', image);
}

const tz = { timeZone: 'Africa/Lagos' } as const;
export const formatEventDay = (s: string) => eventDate(s).toLocaleDateString('en-GB', { ...tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const formatEventDayShort = (s: string) => eventDate(s).toLocaleDateString('en-GB', { ...tz, weekday: 'short', day: 'numeric', month: 'short' });
const time = (s: string) => eventDate(s).toLocaleTimeString('en-US', { ...tz, hour: 'numeric', minute: '2-digit' });
export const formatEventTimes = (starts: string, ends: string) => `${time(starts)} to ${time(ends)} (WAT)`;

export type PublicEvent = {
	slug: string;
	title: string;
	summary: string;
	body: string;
	bullets: string[];
	startsAt: string;
	endsAt: string;
	venue: string;
	registerUrl: string;
	hashtags: string;
	imageUrl?: string;
};
