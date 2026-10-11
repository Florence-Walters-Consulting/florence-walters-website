'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { blogHref } from './href';

type Category = { id: number; category_name: string; count: number };

export default function BlogToolbar({
	categories,
	search,
	category,
}: {
	categories: Category[];
	search: string;
	category: number;
}) {
	const router = useRouter();
	const [searchInput, setSearchInput] = useState(search);

	// Same 350ms debounce the legacy page used; resets to page 1.
	useEffect(() => {
		const trimmed = searchInput.trim();
		if (trimmed === search) return;
		const timeout = setTimeout(() => router.replace(blogHref({ search: trimmed, category })), 350);
		return () => clearTimeout(timeout);
	}, [searchInput, search, category, router]);

	return (
		<div className="insights-toolbar">
			<div className="insights-topics" aria-label="Filter articles by topic">
				<button
					className={!category ? 'active' : ''}
					onClick={() => router.push(blogHref({ search }))}>
					All Topics
				</button>
				{categories
					.filter((item) => item.count > 0)
					.map((item) => (
						<button
							key={item.id}
							className={item.id === category ? 'active' : ''}
							onClick={() => router.push(blogHref({ search, category: item.id }))}>
							{item.category_name}
						</button>
					))}
			</div>
			<label className="insights-search">
				<span className="icon icon-MagnifyingGlass" aria-hidden="true" />
				<input
					type="search"
					value={searchInput}
					onChange={(event) => setSearchInput(event.target.value)}
					placeholder="Search insights"
					aria-label="Search insights"
				/>
			</label>
		</div>
	);
}
