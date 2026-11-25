'use client';

import { useEffect, useState } from 'react';
import * as m from 'motion/react-m';
import { CertificateCard } from '@/components/work/CertificateCard';
import type { WorkItem } from '@/lib/work';

const AUTO_MS = 4000;

// Where a certificate sits in the deck, by how far it is from the front.
const pose = [
	{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
	{ x: 26, y: 20, rotate: 3, scale: 0.955, opacity: 1 },
	{ x: -22, y: 36, rotate: -3, scale: 0.91, opacity: 0.9 },
];
const hidden = { x: 0, y: 56, rotate: 0, scale: 0.87, opacity: 0 };

/** One to three real certificates (client names are never shown) that swap slowly, every 4 s. Pauses on hover or focus. */
export function ProofDeck({ items }: { items: WorkItem[] }) {
	const n = items.length;
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);

	useEffect(() => {
		if (n < 2 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const id = window.setInterval(() => setActive((i) => (i + 1) % n), AUTO_MS);
		return () => window.clearInterval(id);
	}, [paused, n]);

	return (
		<div className="mx-auto w-full max-w-md" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
			<div className="grid pt-3 pr-7 pb-12" aria-live="off">
				{items.map((c, i) => {
					const depth = (i - active + n) % n;
					return (
						<m.div key={c.code} className="col-start-1 row-start-1" style={{ zIndex: n - depth, transformOrigin: 'bottom center' }} initial={false} animate={depth < pose.length ? pose[depth] : hidden} transition={{ type: 'spring', stiffness: 130, damping: 20, mass: 0.9 }} aria-hidden={depth !== 0}>
							<CertificateCard c={c} />
						</m.div>
					);
				})}
			</div>
			<p className="text-center text-sm text-white/65">Real certificates secured for our clients. Names hidden to protect their privacy.</p>
		</div>
	);
}
