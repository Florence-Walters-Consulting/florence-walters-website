'use client';

import { ClipboardList, MessageSquareQuote } from 'lucide-react';
import { AutoTabs } from '@/components/ui/AutoTabs';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon3D } from '@/components/ui/Icon3D';
import { SectionHead } from '@/components/ui/SectionHead';
import { steps } from '@/data/home';
import { HowScene } from './HowWeWorkScenes';

/**
 * Five steps as Busola's auto-advancing tabs: the open step reads its sentence and a bar fills over 6 s before the next opens, while
 * an animated scene plays on the right. Choosing a step takes over from the timer. Under it, two ways to begin.
 */
export function HowWeWork() {
	return (
		<section id="how-we-work" className="section-space bg-mist">
			<Container>
				<SectionHead label="How we work" title="From first click to signed agreement, in five steps." />
				<AutoTabs className="mt-12" label="How we work" tabs={steps.map((s) => ({ id: `how-${s.n}`, title: s.keyword, text: s.open }))} stage={(i) => <HowScene key={i} i={i} />} />

				<div className="mt-14 grid gap-4 md:grid-cols-2">
					<div className="flex flex-col rounded-card border border-line bg-white p-7 sm:p-9">
						<Icon3D icon={ClipboardList} size={56} />
						<h3 className="mt-7 text-2xl leading-snug font-bold">Not sure where to start?</h3>
						<p className="mt-2 text-ink-soft">Tell us about your business in a few minutes and we will show you what to do first. Free.</p>
						<div className="mt-7"><Button href="/business-assessment" size="lg">Start with the free assessment</Button></div>
					</div>
					<div className="flex flex-col rounded-card border border-line bg-white p-7 sm:p-9">
						<Icon3D icon={MessageSquareQuote} size={56} tone="navy" />
						<h3 className="mt-7 text-2xl leading-snug font-bold">Know the decision you need help with?</h3>
						<p className="mt-2 text-ink-soft">Book a session on structure, strategy, tax planning or marketing. The fee is confirmed before you book, and you leave with a short written recommendation.</p>
						<div className="mt-7"><Button href="/paid-consultation" variant="outline" size="lg">Book a consultation</Button></div>
					</div>
				</div>
			</Container>
		</section>
	);
}
