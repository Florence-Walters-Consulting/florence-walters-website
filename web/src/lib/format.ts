/** "May 1, 2025". Stored dates are plain YYYY-MM-DD, so format in UTC to avoid a one-day shift. */
export const formatDate = (date: string) =>
	new Date(date).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC',
	});
