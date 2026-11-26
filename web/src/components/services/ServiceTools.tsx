'use client';

import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { DocMock } from '@/components/ui/DocMock';
import { SectionHead } from '@/components/ui/SectionHead';
import { cn } from '@/lib/cn';
import { goals } from '@/data/service-pages';

/** The pick-and-see panels, one per service. Everything happens in the browser: nothing is stored or sent. */
const panel = 'rounded-card bg-white p-5 ring-1 ring-line sm:p-8';
const choice = (on: boolean) => cn('lift3d rounded-card-sm border px-5 py-4 text-left text-lg font-semibold transition-colors', on ? 'border-accent bg-accent/10 text-ink' : 'border-line bg-white text-ink hover:border-accent/40');

// ---------- Setup: which structure fits you?
type Kind = 'profit' | 'nonprofit' | 'foreign';
type Owners = 'one' | 'partners' | 'professionals';
const results = {
	ngo: { name: 'Incorporated Trustees (NGO)', why: 'For associations, foundations and other non-profits registered with the CAC.', gets: ['Certificate of registration', 'Constitution', 'CAC status report'] },
	foreign: { name: 'Foreign company registration', why: 'For a foreign company that wants to operate in Nigeria.', gets: ['Registration certificate', 'Next-steps note on licences'] },
	name: { name: 'Business Name', why: 'Quick and simple for one owner. Your personal liability is not limited.', gets: ['Certificate of registration', 'CAC status report', 'TIN'] },
	ltd: { name: 'Private company (Ltd)', why: 'Limits your personal risk and looks stronger to banks and investors.', gets: ['Certificate of incorporation', 'Memorandum & Articles', 'Share certificates and registers', 'TIN'] },
	llp: { name: 'Partnership (LP or LLP)', why: 'For professionals who practise together and want the partnership to be recognised.', gets: ['Registration certificate', 'Partnership agreement', 'CAC status report'] },
} as const;

export function StructurePicker({ action }: { action: { label: string; href: string } }) {
	const [kind, setKind] = useState<Kind | null>(null);
	const [owners, setOwners] = useState<Owners | null>(null);
	const [protect, setProtect] = useState<boolean | null>(null);
	const reset = () => { setKind(null); setOwners(null); setProtect(null); };

	let result: keyof typeof results | null = null;
	if (kind === 'nonprofit') result = 'ngo';
	else if (kind === 'foreign') result = 'foreign';
	else if (kind === 'profit' && owners === 'partners') result = 'ltd';
	else if (kind === 'profit' && owners === 'professionals') result = 'llp';
	else if (kind === 'profit' && owners === 'one' && protect !== null) result = protect ? 'ltd' : 'name';

	const step = kind === null ? 1 : kind === 'profit' && owners === null ? 2 : 3;
	const question = step === 1 ? 'What are you setting up?' : step === 2 ? 'Who will own it?' : 'Do you want your personal assets protected, or plan to bring in investors?';
	return (
		<section id="tool" className="section-space pb-0">
			<Container>
				<SectionHead label="Which structure fits you?" title="Answer two or three questions." />
				<div className={cn(panel, 'mt-10')}>
					{result ? (
						<div key={result} className="scene-pop grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
							<div>
								<p className="text-xs font-bold tracking-[0.16em] text-accent-deep uppercase">Best fit</p>
								<h3 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{results[result].name}</h3>
								<p className="mt-3 max-w-xl text-lg text-ink-soft">{results[result].why}</p>
								<ul className="mt-5 flex flex-wrap gap-2">{results[result].gets.map((g) => <li key={g} className="inline-flex items-center gap-2 rounded-full bg-mist px-3.5 py-1.5 text-sm font-semibold"><Check className="size-4 text-accent-deep" strokeWidth={3} />{g}</li>)}</ul>
							</div>
							<div className="flex flex-wrap items-center gap-3">
								<Button href={action.href} size="lg">{action.label}</Button>
								<button type="button" onClick={reset} className="inline-flex items-center gap-2 px-3 py-3 text-sm font-semibold text-ink-soft hover:text-ink"><RotateCcw className="size-4" />Start over</button>
							</div>
						</div>
					) : (
						<div key={step} className="hero-in">
							<p className="text-xs font-bold tracking-[0.16em] text-ink-mute uppercase">Question {step}</p>
							<h3 className="mt-2 text-2xl font-bold">{question}</h3>
							<div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{step === 1 && ([['profit', 'A business to make a profit'], ['nonprofit', 'A non-profit or foundation'], ['foreign', 'A branch of a foreign company']] as const).map(([k, t]) => <button key={k} type="button" onClick={() => setKind(k)} className={choice(false)}>{t}</button>)}
								{step === 2 && ([['one', 'Just me'], ['partners', 'Two or more owners or investors'], ['professionals', 'A partnership of professionals']] as const).map(([k, t]) => <button key={k} type="button" onClick={() => setOwners(k)} className={choice(false)}>{t}</button>)}
								{step === 3 && ([[true, 'Yes, protect me'], [false, 'No, keep it simple']] as const).map(([k, t]) => <button key={t} type="button" onClick={() => setProtect(k)} className={choice(false)}>{t}</button>)}
							</div>
						</div>
					)}
				</div>
			</Container>
		</section>
	);
}

// ---------- Licences: which licences does your sector usually need?
type Lic = { code: string; what: string; logo?: string };
const L: Record<string, Lic> = {
	cbn: { code: 'CBN', what: 'Fintech and payments', logo: 'cbn' }, scuml: { code: 'SCUML', what: 'Anti-money-laundering', logo: 'scuml' }, ndpc: { code: 'NDPC', what: 'Data protection', logo: 'ndpc' },
	nuprc: { code: 'NUPRC', what: 'Upstream oil and gas', logo: 'nuprc' }, nmdpra: { code: 'NMDPRA', what: 'Midstream and downstream', logo: 'nmdpra' }, nogic: { code: 'NCDMB NOGIC JQS', what: 'Oil and gas contractors' },
	nerc: { code: 'NERC', what: 'Power', logo: 'nerc' }, nafdac: { code: 'NAFDAC', what: 'Food, drugs, cosmetics', logo: 'nafdac' }, ncc: { code: 'NCC', what: 'Telecoms', logo: 'ncc' },
	naicom: { code: 'NAICOM', what: 'Insurance', logo: 'naicom' }, bpp: { code: 'BPP', what: 'Government contracts' }, nimasa: { code: 'NIMASA', what: 'Maritime', logo: 'nimasa' }, sec: { code: 'SEC', what: 'Capital markets', logo: 'sec' },
};
const sectors: { name: string; licences: string[] }[] = [
	{ name: 'Fintech & payments', licences: ['cbn', 'scuml', 'ndpc'] },
	{ name: 'Oil, gas & energy', licences: ['nuprc', 'nmdpra', 'nogic'] },
	{ name: 'Power', licences: ['nerc'] },
	{ name: 'Food, health & cosmetics', licences: ['nafdac'] },
	{ name: 'Telecoms & tech', licences: ['ncc', 'ndpc'] },
	{ name: 'Insurance', licences: ['naicom'] },
	{ name: 'Construction & contracting', licences: ['bpp', 'scuml'] },
	{ name: 'Professional services', licences: ['scuml'] },
	{ name: 'Shipping & maritime', licences: ['nimasa'] },
	{ name: 'Investments', licences: ['sec'] },
];
const everyone: Lic[] = [{ code: 'CAC annual returns', what: 'Every company, every year', logo: 'cac' }, { code: 'NRS tax', what: 'VAT, PAYE, WHT', logo: 'nrs' }, { code: 'PenCom, NSITF, ITF', what: 'If you employ staff', logo: 'pencom' }];

export function LicenceFinder({ action }: { action: { label: string; href: string } }) {
	const [sector, setSector] = useState(0);
	const chosen = sectors[sector];
	const card = (l: Lic, i: number) => (
		<li key={l.code} className="scene-pop flex items-center gap-3 rounded-card-sm border border-line bg-white p-3.5" style={{ animationDelay: `${i * 90}ms` }}>
			<span className="grid h-11 w-14 shrink-0 place-items-center rounded-lg bg-mist p-1">{l.logo ? <img src={`/media/regulators/${l.logo}.webp`} alt="" loading="lazy" className="max-h-full max-w-full object-contain" /> : <span className="text-xs font-black text-accent-deep">{l.code.slice(0, 4)}</span>}</span>
			<span><span className="block text-[0.9375rem] leading-tight font-bold">{l.code}</span><span className="block text-sm text-ink-soft">{l.what}</span></span>
		</li>
	);
	return (
		<section id="tool" className="section-space pb-0">
			<Container>
				<SectionHead label="Licence finder" title="Pick your sector. See what usually applies." />
				<div className={cn(panel, 'mt-10')}>
					<div role="tablist" aria-label="Sector" className="flex flex-wrap gap-2">
						{sectors.map((s, i) => <button key={s.name} type="button" role="tab" aria-selected={i === sector} onClick={() => setSector(i)} className={cn('rounded-full border px-4 py-2 text-sm font-semibold transition-colors', i === sector ? 'border-accent-btn bg-accent-btn text-white' : 'border-line bg-white text-ink hover:border-accent/50')}>{s.name}</button>)}
					</div>
					<p className="mt-6 text-xs font-bold tracking-[0.16em] text-ink-mute uppercase">For {chosen.name.toLowerCase()}</p>
					<ul key={sector} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{chosen.licences.map((k, i) => card(L[k], i))}</ul>
					<p className="mt-6 text-xs font-bold tracking-[0.16em] text-ink-mute uppercase">Every business</p>
					<ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{everyone.map((l, i) => card(l, i + 3))}</ul>
					<div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
						<p className="max-w-lg text-sm text-ink-soft">A starting point, not a full list. The assessment confirms what applies to your business.</p>
						<Button href={action.href}>{action.label}</Button>
					</div>
				</div>
			</Container>
		</section>
	);
}

// ---------- Advisory: what will I get for my goal?
export function GoalExplorer({ slug }: { slug: string }) {
	const [i, setI] = useState(0);
	const g = goals[i];
	return (
		<section id="goals" className="section-space bg-mist">
			<Container>
				<SectionHead label="Pick your goal" title="See what you would walk away with." />
				<div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
					<ul className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1" role="tablist" aria-label="Goal">
						{goals.map((x, k) => (
							<li key={x.key}>
								<button type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)} onMouseEnter={() => setI(k)} className={cn('flex w-full items-center justify-between gap-4 rounded-card-sm border p-5 text-left text-lg font-bold transition-all duration-300', k === i ? 'border-accent bg-white shadow-[var(--shadow-soft)]' : 'border-line bg-white/70 hover:bg-white')}>
									{x.label}
									<span aria-hidden className={cn('grid size-8 shrink-0 place-items-center rounded-full transition-colors', k === i ? 'bg-accent-btn text-white' : 'bg-mist text-accent-deep')}>→</span>
								</button>
							</li>
						))}
					</ul>
					<div className="rounded-card bg-white p-6 ring-1 ring-line sm:p-8">
						<p className="text-xs font-bold tracking-[0.16em] text-accent-deep uppercase">For “{g.label.toLowerCase()}” you receive</p>
						<div key={g.key} className="mt-6 flex flex-wrap gap-4">
							{g.gets.map((t, n) => <DocMock key={t} title={t} kind="Document" lines={4} rotate={n % 2 ? 2 : -2} className="scene-pop w-44" />)}
						</div>
						<p className="mt-6 text-sm text-ink-soft">Finished, editable documents, a PDF set and a handover walkthrough.</p>
						<div className="mt-6"><Button href={`/business-assessment?service=${slug}&goal=${g.key}`}>Start with this goal</Button></div>
					</div>
				</div>
			</Container>
		</section>
	);
}

// ---------- Marketing: where should your brand start?
const channels = ['Instagram', 'LinkedIn', 'Facebook', 'X', 'Website'];
const needs: { key: string; label: string; start: string }[] = [
	{ key: 'logo', label: 'A logo and colours', start: 'Brand identity' },
	{ key: 'guide', label: 'Brand guidelines', start: 'Brand identity' },
	{ key: 'posting', label: 'Posting every month', start: 'Social media management' },
	{ key: 'ideas', label: 'Ideas for content', start: 'Social media management' },
	{ key: 'site', label: 'A clearer website', start: 'Website structure and content' },
	{ key: 'launch', label: 'A launch or campaign', start: 'Launch and campaign content' },
];

export function BrandCheck({ included, action }: { included: { t: string; d: string }[]; action: { label: string; href: string } }) {
	const [on, setOn] = useState<string[]>([]);
	const [need, setNeed] = useState<string[]>([]);
	const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
	const starts = [...new Set(needs.filter((n) => need.includes(n.key)).map((n) => n.start))];
	const chip = (active: boolean) => cn('rounded-full border px-4 py-2 text-sm font-semibold transition-colors', active ? 'border-accent-btn bg-accent-btn text-white' : 'border-line bg-white text-ink hover:border-accent/50');
	return (
		<section id="tool" className="section-space pb-0">
			<Container>
				<SectionHead label="Brand check" title="Where should your brand start?" />
				<div className={cn(panel, 'mt-10 grid gap-8 lg:grid-cols-2')}>
					<div>
						<p className="font-bold">Where do you show up?</p>
						<div className="mt-3 flex flex-wrap gap-2">{channels.map((c) => <button key={c} type="button" aria-pressed={on.includes(c)} onClick={() => toggle(on, setOn, c)} className={chip(on.includes(c))}>{c}</button>)}</div>
						<p className="mt-6 font-bold">What needs work?</p>
						<div className="mt-3 flex flex-wrap gap-2">{needs.map((n) => <button key={n.key} type="button" aria-pressed={need.includes(n.key)} onClick={() => toggle(need, setNeed, n.key)} className={chip(need.includes(n.key))}>{n.label}</button>)}</div>
					</div>
					<div className="rounded-card-sm bg-mist p-5 sm:p-6" aria-live="polite">
						<p className="text-xs font-bold tracking-[0.16em] text-accent-deep uppercase">Your starting point</p>
						{starts.length === 0 ? (
							<p className="mt-3 text-ink-soft">Choose what needs work and we will show where to begin{on.length ? ` on ${on.join(', ')}` : ''}.</p>
						) : (
							<ul className="mt-4 grid gap-3">
								{starts.map((t, k) => <li key={t} className="scene-pop flex gap-3 rounded-xl bg-white p-4" style={{ animationDelay: `${k * 80}ms` }}><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-btn text-white"><Check className="size-3.5" strokeWidth={3} /></span><span><span className="block font-bold">{t}</span><span className="block text-sm text-ink-soft">{included.find((x) => x.t === t)?.d}</span></span></li>)}
							</ul>
						)}
						{starts.length > 0 && <div className="mt-5"><Button href={action.href}>{action.label}</Button></div>}
					</div>
				</div>
			</Container>
		</section>
	);
}
