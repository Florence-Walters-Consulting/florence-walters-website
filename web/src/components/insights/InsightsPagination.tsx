'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { blogHref } from '@/components/insights/href';

export function InsightsPagination({ page, totalPages, search, category }: { page: number; totalPages: number; search: string; category: number }) {
	const router = useRouter();
	if (totalPages <= 1) return null;
	const go = (n: number) => router.push(blogHref({ page: n, search, category }), { scroll: false });
	const arrow = 'grid size-11 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink';
	return (
		<nav className="mt-16 flex items-center justify-center gap-2" aria-label="Pagination">
			<button onClick={() => go(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page" className={arrow}><ArrowLeft className="size-4" /></button>
			{Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
				<button key={n} onClick={() => go(n)} aria-current={n === page ? 'page' : undefined} className={cn('size-11 rounded-full text-[0.9375rem] tabular-nums transition-colors', n === page ? 'bg-ink font-semibold text-white' : 'text-ink-soft hover:bg-mist')}>{n}</button>
			))}
			<button onClick={() => go(Math.min(totalPages, page + 1))} disabled={page === totalPages} aria-label="Next page" className={arrow}><ArrowRight className="size-4" /></button>
		</nav>
	);
}
