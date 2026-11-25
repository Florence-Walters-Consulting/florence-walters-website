'use client';

import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as m from 'motion/react-m';
import { Maximize2, X } from 'lucide-react';
import { TiltStage } from '@/components/ui/TiltStage';
import { cn } from '@/lib/cn';
import type { WorkItem } from '@/lib/work';

type Cert = Pick<WorkItem, 'slug' | 'code' | 'body' | 'certificateUrl'>;

const AUTO_MS = 4000;
const poses = [
	{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
	{ x: 44, y: 20, rotate: 5, scale: 0.93, opacity: 1 },
	{ x: -40, y: 38, rotate: -5, scale: 0.86, opacity: 0.95 },
];
const away = { x: 0, y: 60, rotate: 0, scale: 0.8, opacity: 0 };

/**
 * Hero art for Regulatory Licences: the real certificates (names already blurred) as a tilting stack. The front one swaps every
 * 4 s; the regulator chips jump to a certificate; pressing the front one opens it large. Pauses on hover and for reduced motion.
 */
export function CertShowcase({ items }: { items: Cert[] }) {
	const n = items.length;
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const [zoom, setZoom] = useState(false);

	useEffect(() => {
		if (n < 2 || paused || zoom || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const id = window.setInterval(() => setActive((i) => (i + 1) % n), AUTO_MS);
		return () => window.clearInterval(id);
	}, [paused, zoom, n]);

	if (n === 0) return null;
	const front = items[active];

	return (
		<div className="mx-auto w-full max-w-xl" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
			<TiltStage max={8}>
				<div className="relative h-[19rem] sm:h-[25rem]">
					<span aria-hidden className="absolute inset-[10%] rounded-full bg-accent/20 blur-3xl" />
					{items.map((c, i) => {
						const depth = (i - active + n) % n;
						const pose = depth < 3 ? poses[depth] : away;
						return (
							<span key={c.slug} className="absolute inset-0 grid place-items-center" style={{ zIndex: n - depth }}>
								<m.button type="button" tabIndex={depth === 0 ? 0 : -1} aria-label={depth === 0 ? `Open the ${c.code} certificate` : undefined} aria-hidden={depth !== 0} onClick={() => (depth === 0 ? setZoom(true) : setActive(i))} className="group relative block cursor-zoom-in overflow-hidden rounded-xl bg-white p-1.5 shadow-[0_30px_60px_-24px_rgb(31_42_68/0.5)] ring-1 ring-line" initial={false} animate={pose} transition={{ type: 'spring', stiffness: 120, damping: 19, mass: 0.9 }}>
									<img src={c.certificateUrl} alt={depth === 0 ? `${c.code} certificate. Client details are blurred.` : ''} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" className="block h-auto max-h-[17rem] w-auto max-w-[78vw] rounded-lg sm:max-h-[23rem] sm:max-w-[26rem]" />
									{depth === 0 && <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><Maximize2 className="size-4" /></span>}
								</m.button>
							</span>
						);
					})}
				</div>
			</TiltStage>

			<div role="tablist" aria-label="Choose a certificate" className="mt-3 flex flex-wrap justify-center gap-2">
				{items.map((c, i) => (
					<button key={c.slug} type="button" role="tab" aria-selected={i === active} onClick={() => setActive(i)} className={cn('rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-bold transition-colors', i === active ? 'border-accent-btn bg-accent-btn text-white' : 'border-line bg-white text-ink hover:border-accent/50')}>
						{c.code}
					</button>
				))}
			</div>
			<p className="mt-3 text-center text-sm text-ink-soft">Real certificates we secured for clients. Names are blurred to protect their privacy.</p>

			<Dialog.Root open={zoom} onOpenChange={setZoom}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 z-[60] bg-ink-deep/80 backdrop-blur-md data-[state=open]:animate-[fade-in_250ms_ease-out]" />
					<Dialog.Content aria-describedby={undefined} className="fixed inset-3 z-[70] grid place-items-center sm:inset-8">
						<Dialog.Title className="sr-only">{front.code} certificate</Dialog.Title>
						<img src={front.certificateUrl} alt={`${front.code} certificate. Client details are blurred.`} className="max-h-full max-w-full rounded-xl bg-white object-contain p-2 shadow-2xl" />
						<Dialog.Close aria-label="Close" className="absolute top-0 right-0 grid size-11 place-items-center rounded-full bg-white text-ink shadow-lg"><X className="size-5" /></Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	);
}
