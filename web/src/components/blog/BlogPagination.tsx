'use client';

import { useRouter } from 'next/navigation';
import { blogHref } from './href';

export default function BlogPagination({
	page,
	totalPages,
	search,
	category,
}: {
	page: number;
	totalPages: number;
	search: string;
	category: number;
}) {
	const router = useRouter();
	const go = (target: number) => router.push(blogHref({ page: target, search, category }), { scroll: false });

	if (totalPages <= 1) return null;

	return (
		<nav className="insights-pagination" aria-label="Blog pagination">
			<button onClick={() => go(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page">
				←
			</button>
			{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
				<button
					key={number}
					className={number === page ? 'active' : ''}
					onClick={() => go(number)}
					aria-current={number === page ? 'page' : undefined}>
					{number}
				</button>
			))}
			<button onClick={() => go(Math.min(totalPages, page + 1))} disabled={page === totalPages} aria-label="Next page">
				→
			</button>
		</nav>
	);
}
