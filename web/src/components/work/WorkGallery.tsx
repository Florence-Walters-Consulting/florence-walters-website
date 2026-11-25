'use client';

import { useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SiteLink } from '@/components/ui/SiteLink';
import { cn } from '@/lib/cn';
import { assessmentHref } from '@/lib/site';
import { workCategories, type WorkItem } from '@/lib/work';
import { CertificateCard } from './CertificateCard';

type Filter = string;

/**
 * Filterable gallery of work. Each tile opens a detail view (also reachable by URL hash, so a
 * single result can be shared). Arrow keys or the buttons move between results.
 */
export function WorkGallery({ workItems }: { workItems: WorkItem[] }) {
	const [filter, setFilter] = useState<Filter>('All');
	const [openSlug, setOpenSlug] = useState<string | null>(null);

	// Chips for the categories that have work, in a fixed order, then any others.
	const present = [...new Set(workItems.map((w) => w.category))];
	const categories: Filter[] = ['All', ...workCategories.filter((c) => present.includes(c)), ...present.filter((c) => !(workCategories as readonly string[]).includes(c))];
	const items = filter === 'All' ? workItems : workItems.filter((w) => w.category === filter);
	const open = openSlug ? workItems.find((w) => w.slug === openSlug) : undefined;

	const show = useCallback((slug: string | null) => {
		setOpenSlug(slug);
		const url = slug ? `#${slug}` : window.location.pathname + window.location.search;
		window.history.replaceState(null, '', url);
	}, []);

	useEffect(() => {
		const slug = window.location.hash.slice(1);
		if (workItems.some((w) => w.slug === slug)) {
			const t = window.setTimeout(() => setOpenSlug(slug), 0);
			return () => window.clearTimeout(t);
		}
	}, [workItems]);

	const step = (dir: 1 | -1) => {
		if (!open) return;
		const list = items.some((w) => w.slug === open.slug) ? items : workItems;
		const i = list.findIndex((w) => w.slug === open.slug);
		show(list[(i + dir + list.length) % list.length].slug);
	};

	const count = (c: Filter) => (c === 'All' ? workItems.length : workItems.filter((w) => w.category === c).length);

	return (
		<section id="work-grid" className="section-space pt-10">
			<div className="sticky top-[4.5rem] z-30 border-y border-line bg-canvas/90 backdrop-blur-xl">
				<div className="page-container flex gap-2 overflow-x-auto py-4" role="group" aria-label="Filter work">
					{categories.map((c) => (
						<button key={c} aria-pressed={filter === c} onClick={() => setFilter(c)} className={cn('shrink-0 rounded-full border px-5 py-2.5 text-[0.9375rem] transition-colors', filter === c ? 'border-ink bg-ink font-semibold text-white' : 'border-line bg-white text-ink-soft hover:border-ink/40 hover:text-ink')}>
							{c}
							<span className={cn('ml-2 text-xs tabular-nums', filter === c ? 'text-white/60' : 'text-ink-mute')}>{count(c)}</span>
						</button>
					))}
				</div>
			</div>

			<div key={filter} className="page-container mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2">
				{items.map((w, i) => (
					<button key={w.slug} onClick={() => show(w.slug)} aria-haspopup="dialog" className={cn('hero-in group text-left', i === 0 && filter === 'All' && 'md:col-span-2')} style={{ animationDelay: `${i * 90}ms` }}>
						<span className={cn('relative grid place-items-center overflow-hidden rounded-card bg-mist px-6 py-14 sm:px-12', i === 0 && filter === 'All' ? 'md:aspect-[16/7]' : 'md:aspect-[5/4]')}>
							<span aria-hidden className="absolute inset-0 bg-[radial-gradient(40rem_26rem_at_70%_20%,rgb(107_104_247/0.28),transparent),radial-gradient(30rem_20rem_at_0%_100%,rgb(107_104_247/0.14),transparent)]" />
							<span aria-hidden className="absolute top-6 left-7 font-display text-5xl text-ink/10">{String(i + 1).padStart(2, '0')}</span>
							<span className="absolute top-6 right-6 rounded-full bg-white px-3.5 py-1.5 text-xs tracking-wider text-ink-soft uppercase ring-1 ring-line">{w.category}</span>
							<CertificateCard c={w} size="sm" className={cn('relative w-full -rotate-2 transition-all duration-[900ms] ease-out-expo group-hover:-translate-y-2 group-hover:rotate-0', i === 0 && filter === 'All' ? 'max-w-md' : 'max-w-[22rem]')} />
						</span>
						<span className="mt-6 flex items-start justify-between gap-6">
							<span>
								<span className="block text-xs font-semibold tracking-[0.16em] text-accent-deep uppercase">{w.body} · {w.kind}</span>
								<span className="mt-2 block font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-tight transition-colors group-hover:text-accent-deep">{w.code}: {w.full}</span>
								<span className="mt-3 block max-w-xl text-ink-soft">{w.summary}</span>
							</span>
							<span className="mt-1 grid size-12 shrink-0 place-items-center rounded-full border border-ink/20 transition-colors group-hover:border-accent group-hover:bg-accent-btn group-hover:text-white">
								<ArrowUpRight className="size-5" />
							</span>
						</span>
					</button>
				))}
			</div>

			<Dialog.Root open={!!open} onOpenChange={(o) => !o && show(null)}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 z-[60] bg-ink-deep/70 backdrop-blur-md data-[state=open]:animate-[fade-in_300ms_ease-out]" />
					<Dialog.Content
						data-lenis-prevent
						aria-describedby={undefined}
						onKeyDown={(e) => {
							if (e.key === 'ArrowRight') step(1);
							if (e.key === 'ArrowLeft') step(-1);
						}}
						className="fixed inset-3 z-[70] overflow-y-auto rounded-card bg-canvas shadow-2xl data-[state=open]:animate-[menu-in_450ms_var(--ease-out-expo)] sm:inset-6 lg:inset-y-8 lg:inset-x-[max(2rem,calc((100vw-76rem)/2))]">
						{open && <Detail w={open} onStep={step} />}
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</section>
	);
}

function Detail({ w, onStep }: { w: WorkItem; onStep: (d: 1 | -1) => void }) {
	return (
		<div className="grid min-h-full lg:grid-cols-[0.95fr_1.05fr]">
			<div className="relative isolate overflow-hidden bg-ink-deep text-white">
				<span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(34rem_24rem_at_80%_10%,rgb(75_72_214/0.5),transparent),radial-gradient(28rem_20rem_at_0%_100%,rgb(107_104_247/0.25),transparent)]" />
				<div className="flex min-h-[30rem] flex-col gap-8 p-6 sm:p-10 lg:sticky lg:top-0 lg:h-[calc(100dvh-4rem)]">
					<p className="label-dot text-xs tracking-[0.18em] text-white/70 uppercase">{w.category}</p>
					<div className="grid flex-1 place-items-center">
						<CertificateCard key={w.slug} c={w} className="hero-in w-full max-w-md -rotate-1" />
					</div>
					<div className="flex items-center gap-3">
						<button onClick={() => onStep(-1)} aria-label="Previous work" className="grid size-12 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-ink"><ArrowLeft className="size-4" /></button>
						<button onClick={() => onStep(1)} aria-label="Next work" className="grid size-12 place-items-center rounded-full bg-white text-ink transition-colors hover:bg-accent-soft"><ArrowRight className="size-4" /></button>
						<p className="ml-2 text-sm text-white/60">Use ← → to move between results</p>
					</div>
				</div>
			</div>

			<div className="relative p-6 sm:p-10 lg:p-14">
				<Dialog.Close aria-label="Close" className="absolute top-5 right-5 grid size-11 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-white"><X className="size-5" /></Dialog.Close>
				<p className="text-xs font-semibold tracking-[0.16em] text-accent-deep uppercase">{w.body} · {w.kind}</p>
				<Dialog.Title className="mt-3 max-w-lg pr-12 text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]">{w.code}: {w.full}</Dialog.Title>
				<p className="mt-5 max-w-lg text-lead text-ink-soft">{w.summary}</p>
				<p className="mt-4 text-sm text-ink-mute">Client names are kept confidential.</p>

				<h3 className="mt-10 text-xs font-semibold tracking-[0.16em] text-ink-mute uppercase">What we handled</h3>
				<ol className="mt-2 border-t border-line">
					{w.scope.map((s, i) => (
						<li key={s.t} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-line py-4">
							<span className="font-display text-2xl text-accent-deep">{i + 1}</span>
							<span>
								<span className="block font-semibold">{s.t}</span>
								<span className="mt-0.5 block text-[0.9375rem] text-ink-soft">{s.d}</span>
							</span>
						</li>
					))}
				</ol>

				<h3 className="mt-10 text-xs font-semibold tracking-[0.16em] text-ink-mute uppercase">What the client received</h3>
				<ul className="mt-4 grid gap-2.5">
					{w.receive.map((r) => (
						<li key={r} className="flex items-start gap-3 text-[0.9375rem]"><Check className="mt-0.5 size-4 shrink-0 text-accent-deep" strokeWidth={2.5} />{r}</li>
					))}
				</ul>

				<div className="mt-12 rounded-card-sm bg-mist p-6">
					<p className="text-sm text-ink-soft">Part of our service</p>
					<SiteLink href={`/services/${w.service.slug}`} className="mt-1 inline-flex items-center gap-2 font-display text-2xl transition-colors hover:text-accent-deep">{w.service.name} <ArrowUpRight className="size-5" /></SiteLink>
					<div className="mt-5 flex flex-wrap gap-3">
						<Button href={assessmentHref(w.service.slug)}>Start yours</Button>
						<Button href="/paid-consultation" variant="outline" arrow={false}>Book a consultation</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
