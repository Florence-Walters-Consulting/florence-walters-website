import Link from 'next/link';
import { ExternalLink, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/admin/actions';
import { roleLabel, type Role } from '@/lib/auth/roles';
import MobileNav from './MobileNav';
import NavLinks from './NavLinks';
import { navFor } from './nav';
import Toaster from './Toaster';

function initials(name: string) {
	return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'A';
}

/** Dark navy sidebar (brand), light content canvas. Menu items follow the signed-in role. */
export default function AdminShell({ name, role, badges, children }: { name: string; role: Role; badges?: Record<string, number>; children: React.ReactNode }) {
	const groups = navFor(role);
	const account = (
		<div className="border-t border-white/10 pt-4">
			<div className="flex items-center gap-3 px-1">
				<span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 font-display text-lg text-white">{initials(name)}</span>
				<div className="min-w-0">
					<p className="truncate text-sm font-medium text-white">{name}</p>
					<p className="text-xs text-white/50">{roleLabel[role]}</p>
				</div>
			</div>
			<div className="mt-3 grid gap-0.5">
				<a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"><ExternalLink className="size-4" strokeWidth={1.75} /> View website</a>
				<form action={logoutAction}>
					<button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"><LogOut className="size-4" strokeWidth={1.75} /> Sign out</button>
				</form>
			</div>
		</div>
	);

	return (
		<div className="lg:flex">
			<Toaster />
			<aside className="hidden w-72 shrink-0 lg:block">
				<div className="sticky top-0 flex h-screen flex-col overflow-y-auto bg-brand-deep px-5 py-4">
					<Link href="/admin" className="block px-3 py-1"><img src="/brand/logo-white.svg" alt="Florence Walters Consulting" className="h-11 w-auto" /></Link>
					<div className="mt-4 flex-1">
						<NavLinks groups={groups} badges={badges} />
					</div>
					<div className="mt-5">{account}</div>
				</div>
			</aside>

			<div className="min-w-0 flex-1">
				<MobileNav groups={groups} footer={account} badges={badges} />
				<main className="mx-auto max-w-6xl p-4 sm:p-8 lg:p-12">{children}</main>
			</div>
		</div>
	);
}
