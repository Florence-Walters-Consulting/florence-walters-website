'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Cards stacked in a pile that fan out on hover, focus or tap (Busola's certificate deck). Pass up to ~8 cards.
 * Closed, they overlap; open, they spread in an arc so each can be read.
 */
export function FanDeck({ cards, label, className, cardClassName }: { cards: React.ReactNode[]; label: string; className?: string; cardClassName?: string }) {
	const [open, setOpen] = useState(false);
	const n = cards.length;
	const mid = (n - 1) / 2;
	return (
		<button
			type="button"
			aria-expanded={open}
			aria-label={label}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
			onFocus={() => setOpen(true)}
			onBlur={() => setOpen(false)}
			onClick={() => setOpen((o) => !o)}
			className={cn('relative block w-full cursor-pointer overflow-x-clip perspective-1000 [--sp:2.6rem] sm:[--sp:4.6rem] lg:[--sp:5.6rem]', className)}
			style={{ height: 'clamp(15rem, 34vw, 19rem)' }}>
			{cards.map((card, i) => {
				const k = i - mid;
				const x = open ? `calc(${k} * var(--sp))` : `${k * 0.6}rem`;
				const rot = open ? k * 5 : k * 1.2;
				const y = open ? Math.abs(k) * 0.8 : Math.abs(k) * 0.25;
				return (
					<span key={i} className="absolute inset-0 grid place-items-center transition-transform duration-700 ease-out-expo" style={{ transform: `translate3d(${x}, ${y}rem, 0) rotate(${rot}deg)`, zIndex: open ? i : n - Math.abs(Math.round(k)) }}>
						<span className={cn('block w-[8.5rem] text-left sm:w-44', cardClassName)}>{card}</span>
					</span>
				);
			})}
		</button>
	);
}
