import { logoutAction } from '@/app/admin/actions';
import NavLinks from './NavLinks';
import Toaster from './Toaster';
import { ui } from './ui';

export default function AdminShell({ name, children }: { name: string; children: React.ReactNode }) {
	const signOut = (
		<form action={logoutAction}>
			<button type="submit" className={`${ui.btn} ${ui.btnSecondary}`}>
				Sign out
			</button>
		</form>
	);

	return (
		<div className="lg:flex">
			<Toaster />
			<aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
				<div className="sticky top-0 flex h-screen flex-col overflow-y-auto p-4">
					<p className="px-3 pb-4 text-base font-semibold text-brand">FWC Admin</p>
					<div className="flex-1">
						<NavLinks />
					</div>
					<div className="mt-6 border-t border-slate-200 pt-4">
						<p className="mb-2 truncate px-3 text-xs text-slate-500">Signed in as {name}</p>
						{signOut}
					</div>
				</div>
			</aside>

			<div className="min-w-0 flex-1">
				<header className="border-b border-slate-200 bg-white lg:hidden">
					<details className="group">
						<summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
							<span className="font-semibold text-brand">FWC Admin</span>
							<span className="text-sm text-slate-600 group-open:hidden">Menu</span>
							<span className="hidden text-sm text-slate-600 group-open:inline">Close</span>
						</summary>
						<div className="space-y-4 border-t border-slate-200 p-4">
							<NavLinks />
							<div className="border-t border-slate-200 pt-4">
								<p className="mb-2 text-xs text-slate-500">Signed in as {name}</p>
								{signOut}
							</div>
						</div>
					</details>
				</header>
				<main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
