import type { Role } from '@/lib/auth/roles';

export type NavIcon = 'dashboard' | 'inbox' | 'posts' | 'work' | 'categories' | 'faqs' | 'testimonials' | 'partners' | 'subscribers' | 'users' | 'password';
export type NavItem = { href: string; label: string; icon: NavIcon; roles?: Role[] };
export type NavGroup = { title: string; items: NavItem[] };

/** `roles` omitted = everyone who can sign in. Server pages and actions enforce the same rules. */
export const adminNav: NavGroup[] = [
	{ title: 'Overview', items: [{ href: '/admin', label: 'Overview', icon: 'dashboard' }] },
	{ title: 'Leads', items: [{ href: '/admin/inbox', label: 'Inbox', icon: 'inbox', roles: ['admin'] }] },
	{
		title: 'Content',
		items: [
			{ href: '/admin/work', label: 'Work highlights', icon: 'work' },
			{ href: '/admin/blog', label: 'Blog posts', icon: 'posts' },
			{ href: '/admin/blog-categories', label: 'Blog categories', icon: 'categories' },
			{ href: '/admin/faqs', label: 'FAQs', icon: 'faqs' },
			{ href: '/admin/testimonials', label: 'Testimonials', icon: 'testimonials' },
			{ href: '/admin/partners', label: 'Regulators', icon: 'partners' },
		],
	},
	{ title: 'Audience', items: [{ href: '/admin/subscribers', label: 'Email subscribers', icon: 'subscribers', roles: ['admin'] }] },
	{
		title: 'Settings',
		items: [
			{ href: '/admin/users', label: 'Users', icon: 'users', roles: ['admin'] },
			{ href: '/admin/password', label: 'My password', icon: 'password' },
		],
	},
];

export const navFor = (role: Role): NavGroup[] =>
	adminNav
		.map((g) => ({ ...g, items: g.items.filter((i) => !i.roles || i.roles.includes(role)) }))
		.filter((g) => g.items.length > 0);
