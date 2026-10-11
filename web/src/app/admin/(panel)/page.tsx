import type { Metadata } from 'next';
import Link from 'next/link';
import PageTitle from '@/components/admin/PageTitle';
import { ui } from '@/components/admin/ui';
import { getDashboardCounts } from '@/db/admin/stats';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function Dashboard() {
	const c = await getDashboardCounts();
	const cards = [
		{ label: 'Home slider', value: c.slider, href: '/admin/home-slider' },
		{ label: 'Other images', value: c.images, href: '/admin/other-images' },
		{ label: 'Services', value: c.services, href: '/admin/services' },
		{ label: 'Blog posts', value: c.posts, href: '/admin/blog' },
		{ label: 'Blog categories', value: c.categories, href: '/admin/blog-categories' },
		{ label: 'FAQs', value: c.faqs, href: '/admin/faqs' },
		{ label: 'Testimonials', value: c.testimonials, href: '/admin/testimonials' },
		{ label: 'Team members', value: c.team, href: '/admin/team' },
		{ label: 'Regulators / partners', value: c.partners, href: '/admin/partners' },
		{ label: 'Email subscribers', value: c.subscribers, href: '/admin/subscribers' },
	];

	return (
		<>
			<PageTitle title="Dashboard" description="Manage the content shown on the public website." />
			<ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{cards.map((card) => (
					<li key={card.href}>
						<Link
							href={card.href}
							className={`${ui.card} block p-5 transition hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent`}>
							<p className="text-sm text-slate-500">{card.label}</p>
							<p className="mt-1 text-3xl font-semibold text-brand">{card.value}</p>
						</Link>
					</li>
				))}
			</ul>
		</>
	);
}
