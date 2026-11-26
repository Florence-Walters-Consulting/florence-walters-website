'use client';

import { BadgeCheck } from 'lucide-react';
import { AutoTabs } from '@/components/ui/AutoTabs';
import { Container } from '@/components/ui/Container';
import { DocMock } from '@/components/ui/DocMock';
import { MotionIcon, type MotionName } from '@/components/ui/MotionIcon';
import { SectionHead } from '@/components/ui/SectionHead';

type Item = { t: string; d: string; motion?: MotionName };

/**
 * "What's included" as Busola's auto-advancing stage: the items on the left (the open one reads its sentence), and on the right
 * the item's document with a stamp that lands on it. An item with its own animation (the compliance retainer) shows that instead.
 */
export function IncludedTabs({ items, addOn }: { items: Item[]; addOn?: string }) {
	return (
		<section className="section-space pb-0">
			<Container>
				<SectionHead label="What's included" title="What we do for you." line="Open any item, or watch them in turn." />
				<AutoTabs
					className="mt-10"
					label="What's included"
					stageTone="light"
					tabs={items.map((it, i) => ({ id: `inc-${i}`, title: it.t, text: it.d }))}
					footer={addOn ? <p className="px-2 text-sm text-ink-soft">{addOn}</p> : undefined}
					stage={(i) => {
						const it = items[i];
						const others = items.filter((_, k) => k !== i).slice(0, 2);
						if (it.motion) return <MotionIcon key={i} kind="hero" name={it.motion} play="visible" className="scene-pop mx-auto w-full max-w-md" label={it.t} />;
						return (
							<div key={i} className="relative w-full max-w-sm py-6">
								<DocMock title={it.t} kind="In scope" lines={5} rotate={-3} className="scene-pop mx-auto w-64 sm:w-72" />
								<span className="scene-stamp absolute right-2 bottom-4 grid size-24 place-items-center rounded-full border-[3px] border-accent-btn bg-white/80 text-center text-[0.6875rem] font-black tracking-widest text-accent-deep">
									<span><BadgeCheck className="mx-auto mb-0.5 size-6" />DONE</span>
								</span>
								{others.map((o, k) => (
									<span key={o.t} className={`shape-drift absolute hidden max-w-[11rem] truncate rounded-full bg-white px-3.5 py-1.5 text-[0.8125rem] font-bold text-ink shadow-lg ring-1 ring-line sm:block ${k === 0 ? 'top-0 right-0' : 'bottom-0 left-0'}`} style={{ ['--dur' as string]: k === 0 ? '8s' : '9.5s' }}>{o.t}</span>
								))}
							</div>
						);
					}}
				/>
			</Container>
		</section>
	);
}
