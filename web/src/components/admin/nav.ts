export type NavGroup = { title: string; items: { href: string; label: string }[] };

export const adminNav: NavGroup[] = [
	{ title: 'Overview', items: [{ href: '/admin', label: 'Dashboard' }] },
	{
		title: 'Website',
		items: [
			{ href: '/admin/home-slider', label: 'Home slider' },
			{ href: '/admin/other-images', label: 'Other images' },
			{ href: '/admin/services', label: 'Services' },
		],
	},
	{
		title: 'Blog',
		items: [
			{ href: '/admin/blog', label: 'Blog posts' },
			{ href: '/admin/blog-categories', label: 'Blog categories' },
		],
	},
	{
		title: 'Content',
		items: [
			{ href: '/admin/faqs', label: 'FAQs' },
			{ href: '/admin/testimonials', label: 'Testimonials' },
			{ href: '/admin/team', label: 'Team' },
			{ href: '/admin/partners', label: 'Regulators / partners' },
		],
	},
	{ title: 'Audience', items: [{ href: '/admin/subscribers', label: 'Email subscribers' }] },
	{ title: 'Account', items: [{ href: '/admin/password', label: 'Change password' }] },
];
