'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNav } from './nav';

export default function NavLinks() {
	const pathname = usePathname();
	const isActive = (href: string) => (href === '/admin' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

	return (
		<nav aria-label="Admin" className="space-y-5">
			{adminNav.map((group) => (
				<div key={group.title}>
					<p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-600">{group.title}</p>
					<ul className="mt-1 space-y-0.5">
						{group.items.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									aria-current={isActive(item.href) ? 'page' : undefined}
									className={`block rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
										isActive(item.href) ? 'bg-brand text-white' : 'text-slate-700 hover:bg-slate-100'
									}`}>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</nav>
	);
}
