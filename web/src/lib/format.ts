/** "May 1, 2025". Stored dates are plain YYYY-MM-DD, so format in UTC to avoid a one-day shift. */
export const formatDate = (date: string) =>
	new Date(date).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC',
	});

/** "just now", "5 minutes ago", "3 hours ago", "yesterday", "4 days ago", then a date. */
export function timeAgo(date: Date, now = new Date()) {
	const s = Math.max(0, Math.round((now.getTime() - date.getTime()) / 1000));
	if (s < 45) return 'just now';
	const m = Math.round(s / 60);
	if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
	const h = Math.round(m / 60);
	if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
	const d = Math.round(h / 24);
	if (d === 1) return 'yesterday';
	if (d < 14) return `${d} days ago`;
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
