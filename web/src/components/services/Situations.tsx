'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { cn } from '@/lib/cn';

/** "Is this for you?": four situations in the client's words. Tap the one that sounds like you and the reply and best next step appear. */
export function Situations({ items, action }: { items: { t: string; reply: string }[]; action: { label: string; href: string } }) {
	const [pick, setPick] = useState<number | null>(null);
	return (
		<section className="section-space pb-0">
			<Container>
				<SectionHead label="Is this for you?" title="Which one sounds like you?" />
				<ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label="Situations">
					{items.map((it, i) => {
						const on = pick === i;
						return (
							<li key={it.t}>
								<button type="button" aria-pressed={on} onClick={() => setPick(on ? null : i)} className={cn('lift3d flex h-full w-full flex-col gap-4 rounded-card-sm border p-5 text-left', on ? 'border-accent bg-white shadow-[var(--shadow-soft)]' : 'border-line bg-white hover:border-accent/40')}>
									<span className={cn('grid size-9 place-items-center rounded-full transition-colors duration-300', on ? 'bg-accent-btn text-white' : 'bg-accent/15 text-accent-deep')}><Check className="size-5" strokeWidth={2.5} /></span>
									<span className="text-lg leading-snug font-semibold text-ink">{it.t}</span>
								</button>
							</li>
						);
					})}
				</ul>
				<div aria-live="polite" className="mt-4 min-h-[4.5rem] rounded-card-sm bg-mist p-5 sm:p-6">
					{pick === null ? (
						<p className="text-ink-mute">Tap the one that sounds like you.</p>
					) : (
						<div key={pick} className="hero-in flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
							<p className="max-w-2xl text-lg text-ink">{items[pick].reply}</p>
							<Button href={action.href} className="shrink-0">{action.label}</Button>
						</div>
					)}
				</div>
			</Container>
		</section>
	);
}
