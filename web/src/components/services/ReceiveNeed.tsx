'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { CountUp } from '@/components/ui/CountUp';
import { DocMock } from '@/components/ui/DocMock';
import { FanDeck } from '@/components/ui/FanDeck';
import { Ring } from '@/components/ui/Ring';
import { SectionHead } from '@/components/ui/SectionHead';
import { cn } from '@/lib/cn';

/**
 * One band for two ideas: the documents you walk away with (a deck that fans out on hover or tap), and what we need from you
 * (a checklist whose ring fills as you tick, and a button that adapts to how ready you are).
 */
export function ReceiveNeed({ receive, need, notIncluded, startHref }: { receive: string[]; need: string[]; notIncluded?: string; startHref: string }) {
	const [done, setDone] = useState<Record<string, boolean>>({});
	const count = need.filter((t) => done[t]).length;
	const label = count === 0 ? 'Start the free assessment' : count === need.length ? 'You are ready. Start now' : 'Start with what you have';
	const spacing = receive.length > 6 ? '[--sp:2.1rem] sm:[--sp:3.1rem] lg:[--sp:3.5rem]' : receive.length > 4 ? '[--sp:2.4rem] sm:[--sp:3.9rem] lg:[--sp:4.6rem]' : '';
	return (
		<section className="section-space">
			<Container className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
				<div>
					<SectionHead label="What you receive" title="The documents you walk away with." />
					<p className="mt-5 text-ink-soft"><strong className="text-3xl font-black text-ink"><CountUp to={receive.length} /></strong> <span className="ml-1">documents in your hands. Hover or tap the pile to read them.</span></p>
					<FanDeck className={cn('mt-6', spacing)} label="Documents you receive. Press to spread them out." cards={receive.map((r) => <DocMock key={r} title={r} kind="Document" lines={3} />)} />
					{notIncluded && <p className="mt-4 text-sm text-ink-soft">{notIncluded}</p>}
				</div>
				<div className="self-start rounded-card bg-mist p-6 sm:p-8">
					<SectionHead label="What we need from you" title="Keep these to hand." />
					<div className="mt-6 flex items-center gap-5">
						<Ring value={count} total={need.length} size={96} tone="light" />
						<p className="text-sm text-ink-soft" aria-live="polite">{count} of {need.length} ready. Tick what you already have.</p>
					</div>
					<ul className="mt-5 grid gap-2.5">
						{need.map((t) => {
							const on = !!done[t];
							return (
								<li key={t}>
									<button type="button" aria-pressed={on} onClick={() => setDone((d) => ({ ...d, [t]: !d[t] }))} className={cn('flex w-full items-center gap-3 rounded-card-sm bg-white p-3.5 text-left ring-1 transition-all duration-300', on ? 'ring-accent' : 'ring-line hover:ring-accent/40')}>
										<span className={cn('grid size-6 shrink-0 place-items-center rounded-md border-2 transition-colors', on ? 'border-accent-btn bg-accent-btn text-white' : 'border-accent-soft bg-white')}>{on && <Check className="size-4" strokeWidth={3} />}</span>
										<span className={cn('font-medium', on && 'text-ink')}>{t}</span>
									</button>
								</li>
							);
						})}
					</ul>
					<div className="mt-6"><Button href={startHref}>{label}</Button></div>
				</div>
			</Container>
		</section>
	);
}
