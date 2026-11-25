'use client';

import { useEffect, useState } from 'react';
import { eventDate, formatEventDayShort } from '@/lib/events';

function label(startsAt: string, endsAt: string) {
	const now = Date.now();
	const start = eventDate(startsAt).getTime();
	const end = eventDate(endsAt).getTime();
	if (now >= end) return 'Ended';
	if (now >= start) return 'Happening now';
	const t = new Date(now).toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' });
	const d = eventDate(startsAt).toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' });
	const days = Math.round((new Date(d).getTime() - new Date(t).getTime()) / 86_400_000);
	const at = eventDate(startsAt).toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos', hour: 'numeric', minute: '2-digit' });
	if (days <= 0) {
		const hours = Math.max(1, Math.round((start - now) / 3_600_000));
		return hours <= 3 ? `Starts in about ${hours} hour${hours === 1 ? '' : 's'}` : `Today at ${at} WAT`;
	}
	if (days === 1) return `Tomorrow at ${at} WAT`;
	if (days < 7) return `In ${days} days`;
	return formatEventDayShort(startsAt);
}

/** "Tomorrow at 4:00 PM WAT" and friends. Worked out in the browser (the clock cannot be read while the page is built). */
export function EventCountdown({ startsAt, endsAt, fallback, className }: { startsAt: string; endsAt: string; fallback: string; className?: string }) {
	const [text, setText] = useState(fallback);
	useEffect(() => {
		const update = () => setText(label(startsAt, endsAt));
		update();
		const id = window.setInterval(update, 60_000);
		return () => window.clearInterval(id);
	}, [startsAt, endsAt]);
	return <span className={className}>{text}</span>;
}
