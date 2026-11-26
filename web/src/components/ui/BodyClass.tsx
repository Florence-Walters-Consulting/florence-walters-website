'use client';

import { useLayoutEffect } from 'react';

/**
 * Adds classes to <body> while this layout is mounted. Radix dialogs render in a portal under
 * <body>, outside the layout wrapper, so the next/font CSS variables must live on <body> for
 * portalled content (menus, dialogs) to get the site fonts. Removed on unmount, so legacy pages are unaffected.
 */
export function BodyClass({ className }: { className: string }) {
	useLayoutEffect(() => {
		const classes = className.split(' ').filter(Boolean);
		document.body.classList.add(...classes);
		return () => document.body.classList.remove(...classes);
	}, [className]);
	return null;
}
