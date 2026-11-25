import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowUpRight, Award, BookOpenText, Building2, CheckCircle2, HelpCircle, Inbox, LogIn, Mail, Pencil, Plus, Quote, Trash2, TriangleAlert } from 'lucide-react';
import { countChangesSince, getRecentActivity } from '@/db/admin/activity';
import { countNewLeads, countStaleNewLeads } from '@/db/admin/leads';
import { getContentChecks, getDashboardCounts, getRecentPosts, getRecentSubscribers } from '@/db/admin/stats';
import { requireAdmin } from '@/lib/auth/dal';
import { roleLabel } from '@/lib/auth/roles';
import { formatDate, timeAgo } from '@/lib/format';
import { imageUrl } from '@/lib/images';

export const metadata: Metadata = { title: 'Overview' };

const kindIcon = { create: Plus, update: Pencil, delete: Trash2, auth: LogIn, other: Activity } as const;
const kindTone = {
	create: 'bg-emerald-50 text-emerald-700',
	update: 'bg-brand-soft text-accent',
	delete: 'bg-red-50 text-red-600',
	auth: 'bg-slate-100 text-slate-500',
	other: 'bg-slate-100 text-slate-500',
} as const;

const card = 'rounded-2xl border border-line bg-white p-6 sm:p-8';
const link = 'inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline';

export default async function Overview() {
	const me = await requireAdmin();
	const isAdmin = me.role === 'admin';
	const now = new Date();
	const weekAgo = new Date(now.getTime() - 7 * 86400000);

	const [c, posts, subs, activity, changesThisWeek, checks, newLeads, staleLeads] = await Promise.all([
		getDashboardCounts(),
		getRecentPosts(),
		isAdmin ? getRecentSubscribers() : Promise.resolve([]),
		getRecentActivity(8, isAdmin),
		countChangesSince(weekAgo),
		getContentChecks(),
		isAdmin ? countNewLeads() : Promise.resolve(0),
		isAdmin ? countStaleNewLeads(24) : Promise.resolve(0),
	]);

	const first = me.name.split(' ')[0];
	const tiles = [
		...(isAdmin ? [{ label: 'New enquiries', value: newLeads, href: '/admin/inbox', icon: Inbox }] : []),
		{ label: 'Work highlights', value: c.work, href: '/admin/work', icon: Award },
		{ label: 'Blog posts', value: c.posts, href: '/admin/blog', icon: BookOpenText },
		{ label: 'FAQs', value: c.faqs, href: '/admin/faqs', icon: HelpCircle },
		{ label: 'Testimonials', value: c.testimonials, href: '/admin/testimonials', icon: Quote },
		{ label: 'Regulators', value: c.partners, href: '/admin/partners', icon: Building2 },
		...(isAdmin ? [{ label: 'Email subscribers', value: c.subscribers, href: '/admin/subscribers', icon: Mail }] : []),
	];

	// Share of each content type on the site, as in a status bar.
	const mix = [
		{ label: 'Posts', value: c.posts, color: '#4b48d6' },
		{ label: 'Work', value: c.work, color: '#2bb3a6' },
		{ label: 'FAQs', value: c.faqs, color: '#6b68f7' },
		{ label: 'Testimonials', value: c.testimonials, color: '#f2b84b' },
		{ label: 'Regulators', value: c.partners, color: '#1f2a44' },
	];
	const mixTotal = mix.reduce((a, m) => a + m.value, 0) || 1;

	const attention: { text: string; href: string }[] = [];
	if (staleLeads > 0) attention.push({ text: `${staleLeads} new enquir${staleLeads === 1 ? 'y has' : 'ies have'} waited more than a day for a reply.`, href: '/admin/inbox' });
	if (checks.lastPostDate) {
		const days = Math.floor((now.getTime() - new Date(checks.lastPostDate).getTime()) / 86400000);
		if (days > 45) attention.push({ text: `Your last blog post was ${days} days ago. A fresh post keeps the site active.`, href: '/admin/blog' });
	} else attention.push({ text: 'You have no blog posts yet.', href: '/admin/blog' });
	if (checks.drafts > 0) attention.push({ text: `${checks.drafts} blog draft${checks.drafts === 1 ? ' is' : 's are'} waiting to be published.`, href: '/admin/blog?status=draft' });
	if (checks.hiddenTestimonials > 0) attention.push({ text: `${checks.hiddenTestimonials} testimonial${checks.hiddenTestimonials === 1 ? ' is' : 's are'} hidden from the website.`, href: '/admin/testimonials' });
	if (isAdmin && c.subscribers === 0) attention.push({ text: 'No newsletter subscribers yet. Share the footer sign-up in your posts.', href: '/admin/subscribers' });

	return (
		<>
			<section className="relative isolate overflow-hidden rounded-3xl bg-brand-deep p-8 text-white sm:p-12">
				<span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_24rem_at_90%_0%,rgb(75_72_214/0.5),transparent),radial-gradient(28rem_20rem_at_0%_100%,rgb(107_104_247/0.2),transparent)]" />
				<div className="flex flex-wrap items-end justify-between gap-8">
					<div>
						<p className="text-xs tracking-[0.22em] text-accent-soft uppercase">{roleLabel[me.role]} · Overview</p>
						<h1 className="mt-3 text-5xl leading-none sm:text-6xl">Hello, <span className="text-accent-soft italic">{first}</span>.</h1>
						<p className="mt-4 max-w-xl text-white/70">Here is where the website stands today, and what has changed recently.</p>
					</div>
					<dl className="flex gap-8 sm:gap-10">
						<div><dt className="text-xs tracking-wider text-white/50 uppercase">Items live</dt><dd className="mt-1 font-display text-5xl leading-none">{c.posts + c.faqs + c.testimonials + c.partners + c.work}</dd></div>
						<div><dt className="text-xs tracking-wider text-white/50 uppercase">Changes this week</dt><dd className="mt-1 font-display text-5xl leading-none">{changesThisWeek}</dd></div>
					</dl>
				</div>
				<div className="mt-8 flex flex-wrap gap-2.5">
					{[
						{ label: 'Add a work highlight', href: '/admin/work' },
						{ label: 'Write a blog post', href: '/admin/blog' },
						{ label: 'Add an FAQ', href: '/admin/faqs' },
						{ label: 'Add a regulator logo', href: '/admin/partners' },
					].map((a) => (
						<Link key={a.href} href={a.href} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-accent-soft"><Plus className="size-4" /> {a.label}</Link>
					))}
				</div>
			</section>

			<ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{tiles.map((t) => (
					<li key={t.href}>
						<Link href={t.href} className="group flex items-center justify-between rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_18px_40px_-24px_rgb(75_72_214/0.5)]">
							<span>
								<span className="block text-sm text-slate-500">{t.label}</span>
								<span className="mt-1 block font-display text-5xl leading-none text-brand">{t.value}</span>
							</span>
							<span className="grid size-12 place-items-center rounded-full bg-brand-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white"><t.icon className="size-5" strokeWidth={1.75} /></span>
						</Link>
					</li>
				))}
			</ul>

			<section className={`${card} mt-6`}>
				<div className="flex flex-wrap items-baseline justify-between gap-2">
					<h2 className="text-3xl text-brand">What is on the website</h2>
					<p className="text-sm text-slate-500">{c.categories} blog categories</p>
				</div>
				<div className="mt-5 flex h-3 overflow-hidden rounded-full bg-line" role="img" aria-label={mix.map((m) => `${m.value} ${m.label}`).join(', ')}>
					{mix.filter((m) => m.value > 0).map((m) => <span key={m.label} style={{ width: `${(m.value / mixTotal) * 100}%`, background: m.color }} />)}
				</div>
				<ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
					{mix.map((m) => (
						<li key={m.label} className="flex items-center gap-2 text-sm text-slate-600"><span className="size-2.5 rounded-full" style={{ background: m.color }} />{m.label} <strong className="font-semibold text-brand">{m.value}</strong></li>
					))}
				</ul>
			</section>

			<div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
				<section className={card}>
					<h2 className="text-3xl text-brand">Recent activity</h2>
					{activity.length === 0 ? (
						<p className="mt-6 text-sm text-slate-500">Changes you and your team make will appear here, with who made them and when.</p>
					) : (
						<ol className="mt-5">
							{activity.map((a, i) => {
								const kind = (a.kind in kindIcon ? a.kind : 'other') as keyof typeof kindIcon;
								const Icon = kindIcon[kind];
								return (
									<li key={a.id} className="relative flex gap-4 pb-6 last:pb-0">
										{i < activity.length - 1 && <span aria-hidden className="absolute top-10 bottom-0 left-[1.0625rem] w-px bg-line" />}
										<span className={`relative grid size-[2.125rem] shrink-0 place-items-center rounded-full ${kindTone[kind]}`}><Icon className="size-4" strokeWidth={1.75} /></span>
										<div className="min-w-0 pt-0.5">
											<p className="text-[0.9375rem] text-slate-800"><strong className="font-semibold text-brand">{a.adminName}</strong> · {a.message.replace(/\.$/, '')}</p>
											<p className="text-xs text-slate-500" title={a.createdAt.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}>{timeAgo(a.createdAt, now)}</p>
										</div>
									</li>
								);
							})}
						</ol>
					)}
				</section>

				<section className={card}>
					<h2 className="text-3xl text-brand">Needs attention</h2>
					{attention.length === 0 ? (
						<p className="mt-6 flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 className="size-5 text-emerald-600" /> Everything looks in order.</p>
					) : (
						<ul className="mt-5 grid gap-3">
							{attention.map((a) => (
								<li key={a.text}>
									<Link href={a.href} className="group flex items-start gap-3 rounded-xl border border-line p-4 text-sm text-slate-700 transition-colors hover:border-accent/40 hover:bg-brand-soft/50">
										<TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
										<span className="flex-1">{a.text}</span>
										<ArrowUpRight className="size-4 shrink-0 text-slate-400 transition-colors group-hover:text-accent" />
									</Link>
								</li>
							))}
						</ul>
					)}
				</section>
			</div>

			<div className={`mt-6 grid gap-6 ${isAdmin ? 'lg:grid-cols-[1.35fr_1fr]' : ''}`}>
				<section className={card}>
					<div className="flex items-center justify-between">
						<h2 className="text-3xl text-brand">Latest posts</h2>
						<Link href="/admin/blog" className={link}>All posts <ArrowUpRight className="size-4" /></Link>
					</div>
					{posts.length === 0 ? (
						<p className="mt-6 text-sm text-slate-500">No posts yet.</p>
					) : (
						<ul className="mt-5 divide-y divide-line">
							{posts.map((p) => (
								<li key={p.id}>
									<Link href="/admin/blog" className="flex items-center gap-4 py-4 transition-colors hover:text-accent">
										<img src={imageUrl('blog', p.picture)} alt="" loading="lazy" className="size-14 shrink-0 rounded-xl border border-line object-cover" />
										<span className="min-w-0 flex-1">
											<span className="block truncate font-medium">{p.heading}</span>
											<span className="mt-0.5 block text-sm text-slate-500">{p.category} · {formatDate(p.date)}</span>
										</span>
										{p.status === 'draft' ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Draft</span> : p.featured === 'Yes' && <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-accent">Featured</span>}
									</Link>
								</li>
							))}
						</ul>
					)}
				</section>

				{isAdmin && (
					<section className={card}>
						<div className="flex items-center justify-between">
							<h2 className="text-3xl text-brand">New subscribers</h2>
							<Link href="/admin/subscribers" className={link}>All <ArrowUpRight className="size-4" /></Link>
						</div>
						{subs.length === 0 ? (
							<p className="mt-6 text-sm text-slate-500">Nobody has subscribed yet. Sign-ups from the website footer appear here.</p>
						) : (
							<ul className="mt-5 divide-y divide-line">
								{subs.map((s) => (
									<li key={s.id} className="flex items-center justify-between gap-3 py-3.5 text-sm"><span className="truncate font-medium">{s.email}</span><span className="shrink-0 text-slate-500">{s.date}</span></li>
								))}
							</ul>
						)}
					</section>
				)}
			</div>
		</>
	);
}
