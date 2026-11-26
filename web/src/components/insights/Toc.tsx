'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import type { TocItem } from '@/lib/article';

/** "In this article" list; the section being read is highlighted. */
export function Toc({ items, className = 'hidden xl:block', title = 'In this article' }: { items: TocItem[]; className?: string; title?: string }) {
	const [active, setActive] = useState(items[0]?.id ?? '');
	useEffect(() => {
		const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
		const io = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible[0]) setActive(visible[0].target.id);
			},
			{ rootMargin: '-15% 0px -70% 0px' },
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	}, [items]);

	if (items.length < 2) return null;
	return (
		<nav aria-label={title} className={cn('sticky top-32', className)}>
			<p className="label-dot text-xs tracking-[0.18em] text-ink-mute uppercase">{title}</p>
			<ol className="mt-5 border-l border-line">
				{items.map((i) => (
					<li key={i.id}>
						<a href={`#${i.id}`} className={cn('-ml-px block border-l-2 py-2 pr-2 text-sm leading-snug transition-colors', i.level === 3 ? 'pl-5' : 'pl-5', active === i.id ? 'border-accent font-semibold text-ink' : 'border-transparent text-ink-soft hover:text-ink')}>
							{i.text}
						</a>
					</li>
				))}
			</ol>
		</nav>
	);
}
