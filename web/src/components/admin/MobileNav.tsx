'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import NavLinks from './NavLinks';
import type { NavGroup } from './nav';

/** Top bar and slide-over menu for small screens. */
export default function MobileNav({ groups, footer, badges }: { groups: NavGroup[]; footer: React.ReactNode; badges?: Record<string, number> }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="lg:hidden">
			<header className="flex items-center justify-between bg-brand-deep px-4 py-3">
				<Link href="/admin"><img src="/brand/logo-white.svg" alt="Florence Walters Consulting" className="h-10 w-auto" /></Link>
				<button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="grid size-11 place-items-center rounded-full border border-white/25 text-white"><Menu className="size-5" /></button>
			</header>
			{open && (
				<div className="fixed inset-0 z-50">
					<button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-brand-deep/70 backdrop-blur-sm" />
					<div className="absolute inset-y-0 left-0 flex w-80 max-w-[88vw] flex-col overflow-y-auto bg-brand-deep p-5">
						<div className="flex items-center justify-between">
							<img src="/brand/logo-white.svg" alt="" className="h-10 w-auto" />
							<button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-11 place-items-center rounded-full border border-white/25 text-white"><X className="size-5" /></button>
						</div>
						<div className="mt-8 flex-1"><NavLinks groups={groups} badges={badges} onNavigate={() => setOpen(false)} /></div>
						<div className="mt-8">{footer}</div>
					</div>
				</div>
			)}
		</div>
	);
}
