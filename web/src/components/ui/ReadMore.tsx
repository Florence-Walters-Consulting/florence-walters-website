'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';

/** Clamps a long paragraph to three lines with a "Read more" toggle. Short text is shown whole. */
export function ReadMore({ children, className, long = true }: { children: React.ReactNode; className?: string; long?: boolean }) {
	const [open, setOpen] = useState(false);
	const id = useId();
	if (!long) return <p className={className}>{children}</p>;
	return (
		<div>
			<p id={id} className={cn(className, !open && 'line-clamp-3')}>{children}</p>
			<button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className="mt-2 text-sm font-semibold text-accent-deep underline decoration-accent-soft underline-offset-4 hover:decoration-accent">
				{open ? 'Read less' : 'Read more'}
			</button>
		</div>
	);
}
