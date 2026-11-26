import { homeServices } from '@/data/home';

/** Services mega-menu content: the five services, from the same list the home page uses. */
export const serviceMenu = homeServices.map((s) => ({
	name: s.name,
	short: s.short,
	href: `/services/${s.slug}`,
	motion: s.motion,
}));

/** Main navigation. "Services" opens the mega-menu; the rest are plain links. */
export const mainNav = [
	{ label: 'How we work', href: '/#how-we-work' },
	{ label: 'Our work', href: '/work' },
	{ label: 'Insights & events', href: '/blog' },
	{ label: 'About', href: '/about' },
	{ label: 'Contact', href: '/contact' },
] as const;
