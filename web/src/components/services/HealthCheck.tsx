'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { cn } from '@/lib/cn';
import { healthCheckItems } from '@/data/service-pages';

/** Contracts only: tick what you have, see your gaps. Nothing is stored or sent. */
export function HealthCheck({ slug }: { slug: string }) {
	const [done, setDone] = useState<Record<string, boolean>>({});
	const total = healthCheckItems.length;
	const count = healthCheckItems.filter((it) => done[it.t]).length;
	const gaps = total - count;
	return (
		<section id="health-check" className="section-space bg-mist">
			<Container>
				<SectionHead label="30-second health-check" title="Tick what you have. See your gaps." />
				<div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-12">
					<ul className="grid gap-3 sm:grid-cols-2">
						{healthCheckItems.map((it) => {
							const on = !!done[it.t];
							return (
								<li key={it.t}>
									<button type="button" aria-pressed={on} onClick={() => setDone((d) => ({ ...d, [it.t]: !d[it.t] }))} className={cn('flex h-full w-full items-start gap-4 rounded-card-sm border bg-white p-5 text-left transition-colors', on ? 'border-accent' : 'border-line hover:border-accent/40')}>
										<span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-2', on ? 'border-accent-btn bg-accent-btn text-white' : 'border-accent-soft bg-white')}>{on && <Check className="size-4" strokeWidth={3} />}</span>
										<span>
											<span className="block font-semibold">{it.t}</span>
											<span className="mt-1 block text-sm text-ink-soft">{it.d}</span>
										</span>
									</button>
								</li>
							);
						})}
					</ul>
					<div className="self-start rounded-card bg-ink-deep p-7 text-white lg:sticky lg:top-32">
						<p className="text-xs tracking-[0.16em] text-accent-soft uppercase">Your result</p>
						<p className="mt-3 text-6xl leading-none font-black tabular-nums">{count}<span className="text-white/40"> / {total}</span></p>
						<p className="mt-4 text-sm text-white/75" aria-live="polite">{gaps === 0 ? 'No gaps found. Keep these current as the business grows.' : `${gaps} ${gaps === 1 ? 'gap' : 'gaps'} to close. Start with the ones you left unticked.`}</p>
						{gaps > 0 && count > 0 && <div className="mt-6"><Button href={`/business-assessment?service=${slug}`} variant="light">Close these gaps</Button></div>}
					</div>
				</div>
			</Container>
		</section>
	);
}
