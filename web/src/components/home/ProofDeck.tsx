'use client';

import { useEffect, useState } from 'react';
import * as m from 'motion/react-m';
import { CertificateCard } from '@/components/work/CertificateCard';
import type { WorkItem } from '@/lib/work';

const AUTO_MS = 4000;

// Stacked: where a certificate sits by how far it is from the front. Fanned: spread out so all can be seen.
const stacked = [
	{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
	{ x: 34, y: 18, rotate: 4, scale: 0.94, opacity: 1 },
	{ x: -30, y: 34, rotate: -4, scale: 0.88, opacity: 0.95 },
];
const fanned = [
	{ x: 0, y: -14, rotate: 0, scale: 1, opacity: 1 },
	{ x: 170, y: 30, rotate: 9, scale: 0.9, opacity: 1 },
	{ x: -170, y: 30, rotate: -9, scale: 0.9, opacity: 1 },
];
const hidden = { x: 0, y: 56, rotate: 0, scale: 0.8, opacity: 0 };

/**
 * Real (blurred) certificates, stacked. The front one swaps every 4 s; hover, focus or tap fans all of them out so they can be
 * read side by side. Names are blurred in the images themselves.
 */
export function ProofDeck({ items }: { items: WorkItem[] }) {
	const n = items.length;
	const [active, setActive] = useState(0);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (n < 2 || open || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const id = window.setInterval(() => setActive((i) => (i + 1) % n), AUTO_MS);
		return () => window.clearInterval(id);
	}, [open, n]);

	return (
		<div className="mx-auto w-full max-w-xl">
			<button
				type="button"
				aria-expanded={open}
				aria-label="Real certificates secured for our clients. Press to spread them out."
				onMouseEnter={() => setOpen(true)}
				onMouseLeave={() => setOpen(false)}
				onFocus={() => setOpen(true)}
				onBlur={() => setOpen(false)}
				onClick={() => setOpen((o) => !o)}
				className="relative block h-[22rem] w-full cursor-pointer sm:h-[26rem]">
				{items.map((c, i) => {
					const depth = (i - active + n) % n;
					const pose = depth < 3 ? (open ? fanned[depth] : stacked[depth]) : hidden;
					return (
						<span key={c.slug} className="absolute inset-0 grid place-items-center" style={{ zIndex: n - depth }}>
							<m.span className="block w-[62%] sm:w-[58%]" initial={false} animate={pose} transition={{ type: 'spring', stiffness: 120, damping: 19, mass: 0.9 }} aria-hidden={depth !== 0 && !open}>
								<CertificateCard c={c} size="sm" className="[&_img]:max-h-[19rem] sm:[&_img]:max-h-[22rem]" />
							</m.span>
						</span>
					);
				})}
			</button>
			<p className="mt-2 text-center text-sm text-white/65">Real certificates secured for our clients. Names hidden to protect their privacy. <span className="text-white/90">Tap to spread them out.</span></p>
		</div>
	);
}
