'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { blogHref } from '@/components/insights/href';

type Category = { id: number; category_name: string; count: number };

/** Topic chips and search. Both live in the URL (so results can be shared); search waits 350ms after typing. */
export function InsightsToolbar({ categories, search, category }: { categories: Category[]; search: string; category: number }) {
	const router = useRouter();
	const [input, setInput] = useState(search);

	useEffect(() => {
		const trimmed = input.trim();
		if (trimmed === search) return;
		const t = setTimeout(() => router.replace(blogHref({ search: trimmed, category })), 350);
		return () => clearTimeout(t);
	}, [input, search, category, router]);

	const chip = (active: boolean) => cn('shrink-0 rounded-full border px-5 py-2.5 text-[0.9375rem] transition-colors', active ? 'border-ink bg-ink font-semibold text-white' : 'border-line bg-white text-ink-soft hover:border-ink/40 hover:text-ink');

	return (
		<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter articles by topic">
				<button aria-pressed={!category} className={chip(!category)} onClick={() => router.push(blogHref({ search }))}>All topics</button>
				{categories.filter((c) => c.count > 0).map((c) => (
					<button key={c.id} aria-pressed={c.id === category} className={chip(c.id === category)} onClick={() => router.push(blogHref({ search, category: c.id }))}>
						{c.category_name}<span className={cn('ml-2 text-xs tabular-nums', c.id === category ? 'text-white/60' : 'text-ink-mute')}>{c.count}</span>
					</button>
				))}
			</div>
			<label className="relative block lg:w-80">
				<span className="sr-only">Search insights</span>
				<Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-mute" />
				<input type="search" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search insights" className="w-full rounded-full border border-line bg-white py-3 pr-4 pl-11 text-[0.9375rem] transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_4px_rgb(75_72_214/0.12)] focus:outline-none" />
			</label>
		</div>
	);
}
