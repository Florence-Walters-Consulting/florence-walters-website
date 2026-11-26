'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Award, BookOpenText, CalendarDays, Building2, HelpCircle, Inbox, KeyRound, LayoutDashboard, Mail, Quote, ShieldCheck, Tags, type LucideIcon } from 'lucide-react';
import type { NavGroup, NavIcon } from './nav';

const icons: Record<NavIcon, LucideIcon> = {
	dashboard: LayoutDashboard,
	inbox: Inbox,
	work: Award,
	events: CalendarDays,
	posts: BookOpenText,
	categories: Tags,
	faqs: HelpCircle,
	testimonials: Quote,
	partners: Building2,
	subscribers: Mail,
	users: ShieldCheck,
	password: KeyRound,
};

/** Sidebar links (the list is already filtered for the signed-in role). Active page is a pill. */
export default function NavLinks({ groups, onNavigate, badges = {} }: { groups: NavGroup[]; onNavigate?: () => void; badges?: Record<string, number> }) {
	const pathname = usePathname();
	const isActive = (href: string) => (href === '/admin' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

	return (
		<nav aria-label="Admin" className="space-y-5">
			{groups.map((group) => (
				<div key={group.title}>
					<p className="px-3 text-[0.6875rem] font-semibold tracking-[0.18em] text-white/40 uppercase">{group.title}</p>
					<ul className="mt-2 space-y-0.5">
						{group.items.map((item) => {
							const Icon = icons[item.icon];
							const active = isActive(item.href);
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={onNavigate}
										aria-current={active ? 'page' : undefined}
										className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[0.9375rem] transition-colors ${active ? 'bg-accent font-medium text-white shadow-[0_8px_20px_-10px_rgb(75_72_214/0.9)]' : 'text-white/70 hover:bg-white/8 hover:text-white'}`}>
										<Icon className="size-[1.125rem] shrink-0" strokeWidth={1.75} />
										<span className="flex-1">{item.label}</span>
										{badges[item.href] > 0 && <span className={`grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-xs font-semibold ${active ? 'bg-white text-accent' : 'bg-accent text-white'}`} aria-label={`${badges[item.href]} new`}>{badges[item.href]}</span>}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			))}
		</nav>
	);
}
