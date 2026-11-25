'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ui } from './ui';

export type Filter = { param: string; label: string; options: { value: string; label: string }[] };

/** Search box and filter dropdowns for an admin list. Everything is stored in the URL; changing one resets to page 1. */
export function ListControls({ placeholder = 'Search', filters = [] }: { placeholder?: string; filters?: Filter[] }) {
	const router = useRouter();
	const pathname = usePathname();
	const params = useSearchParams();
	const current = params.get('q') ?? '';
	const [q, setQ] = useState(current);

	const go = (changes: Record<string, string>) => {
		const next = new URLSearchParams(params.toString());
		for (const [k, v] of Object.entries(changes)) {
			if (v) next.set(k, v);
			else next.delete(k);
		}
		next.delete('page');
		const s = next.toString();
		router.replace(s ? `${pathname}?${s}` : pathname);
	};

	useEffect(() => {
		const t = q.trim();
		if (t === current) return;
		const id = setTimeout(() => go({ q: t }), 350);
		return () => clearTimeout(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [q]);

	return (
		<div className="mb-5 flex flex-wrap items-center gap-3">
			<label className="relative block w-full sm:w-72">
				<span className="sr-only">{placeholder}</span>
				<Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
				<input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className={cn(ui.input, 'rounded-full py-2 pl-10')} />
			</label>
			{filters.map((f) => (
				<label key={f.param} className="block">
					<span className="sr-only">{f.label}</span>
					<select value={params.get(f.param) ?? ''} onChange={(e) => go({ [f.param]: e.target.value })} className={cn(ui.input, 'w-auto rounded-full py-2 pr-9')}>
						<option value="">{f.label}</option>
						{f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
					</select>
				</label>
			))}
		</div>
	);
}

/** "Showing 1 to 10 of 23" with previous and next. Renders nothing for a single page. */
export function Pager({ page, pages, total, size }: { page: number; pages: number; total: number; size: number }) {
	const pathname = usePathname();
	const params = useSearchParams();
	if (pages <= 1) return null;
	const href = (p: number) => {
		const next = new URLSearchParams(params.toString());
		if (p > 1) next.set('page', String(p));
		else next.delete('page');
		const s = next.toString();
		return s ? `${pathname}?${s}` : pathname;
	};
	const from = (page - 1) * size + 1;
	const to = Math.min(total, page * size);
	const arrow = 'grid size-10 place-items-center rounded-full border border-line bg-white text-slate-600 transition-colors hover:border-accent hover:text-accent';
	return (
		<nav aria-label="Pagination" className="mt-5 flex items-center justify-between gap-4">
			<p className="text-sm text-slate-500">Showing {from} to {to} of {total}</p>
			<div className="flex items-center gap-2">
				{page > 1 ? <Link href={href(page - 1)} aria-label="Previous page" className={arrow}><ArrowLeft className="size-4" /></Link> : <span className={cn(arrow, 'opacity-30')} aria-hidden><ArrowLeft className="size-4" /></span>}
				<span className="px-2 text-sm text-slate-600 tabular-nums">Page {page} of {pages}</span>
				{page < pages ? <Link href={href(page + 1)} aria-label="Next page" className={arrow}><ArrowRight className="size-4" /></Link> : <span className={cn(arrow, 'opacity-30')} aria-hidden><ArrowRight className="size-4" /></span>}
			</div>
		</nav>
	);
}
