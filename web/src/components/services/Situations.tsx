'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { cn } from '@/lib/cn';

/**
 * "Is this for you?": four situations in the client's words as a tab row. The first is open, so the answer is already visible;
 * choosing another swaps the reply and the best next step underneath, attached to the chosen card.
 */
export function Situations({ items, action }: { items: { t: string; reply: string }[]; action: { label: string; href: string } }) {
	const [pick, setPick] = useState(0);
	return (
		<section className="section-space pb-0">
			<Container>
				<SectionHead label="Is this for you?" title="Which one sounds like you?" />
				<div className="mt-10 overflow-hidden rounded-card ring-1 ring-line">
					<ul className="grid sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="Situations">
						{items.map((it, i) => {
							const on = pick === i;
							return (
								<li key={it.t} role="presentation" className="border-b border-line last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:border-r lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
									<button type="button" role="tab" id={`sit-${i}`} aria-selected={on} aria-controls="sit-panel" onClick={() => setPick(i)} className={cn('relative flex h-full w-full items-start gap-3 p-5 text-left transition-colors duration-300 sm:p-6', on ? 'bg-white' : 'bg-white/50 hover:bg-white')}>
										<span className={cn('mt-0.5 grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-300', on ? 'bg-accent-btn text-white' : 'bg-accent/15 text-accent-deep')}><Check className="size-4" strokeWidth={3} /></span>
										<span className={cn('text-lg leading-snug font-semibold', on ? 'text-ink' : 'text-ink-soft')}>{it.t}</span>
										<span aria-hidden className={cn('absolute inset-x-0 bottom-0 h-1 origin-left bg-accent-btn transition-transform duration-500 ease-out-expo', on ? 'scale-x-100' : 'scale-x-0')} />
									</button>
								</li>
							);
						})}
					</ul>
					<div id="sit-panel" role="tabpanel" aria-labelledby={`sit-${pick}`} className="border-t border-line bg-mist p-5 sm:p-7">
						<div key={pick} className="hero-in flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
							<p className="max-w-2xl text-lg text-ink">{items[pick].reply}</p>
							<Button href={action.href} className="shrink-0">{action.label}</Button>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
