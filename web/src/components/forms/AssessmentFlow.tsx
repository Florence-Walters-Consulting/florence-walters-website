'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { ArrowLeft, ArrowRight, Check, Loader2, Pencil } from 'lucide-react';
import { SiteLink } from '@/components/ui/SiteLink';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { company } from '@/lib/site';
import { ChoiceGroup, Field, FormError, StepRail, inputClass } from './form-ui';

export type Branch = 'formation' | 'licensing' | 'contracts' | 'marketing' | 'advisory';

const branchMeta: Record<Branch, { label: string; problem: string; slug: string }> = {
	formation: { label: 'Business Formation & Corporate Services', problem: 'I need to register or restructure my business', slug: 'business-formation-corporate-services' },
	licensing: { label: 'Regulatory Licensing & Compliance', problem: "I need a licence, or I'm behind on filings/tax", slug: 'regulatory-licensing-compliance' },
	contracts: { label: 'Contracts, IP & Governance', problem: 'I need contracts, trademark protection, or data/governance help', slug: 'contracts-ip-governance' },
	marketing: { label: 'Marketing & Brand', problem: 'I need help with marketing, branding, or visibility', slug: 'marketing' },
	advisory: { label: 'Business Advisory & Growth', problem: 'I want to grow, raise investment, or need a strategy/business plan', slug: 'business-advisory-growth' },
};

const STAGES = ['Idea / pre-launch', 'Newly registered (under 12 months)', 'Operating, 1–5 years', 'Established, 5+ years', 'NGO / non-profit', 'Foreign entity entering Nigeria'];
const SECTORS = ['Fintech & payments', 'Oil, gas & energy', 'NGO / foundation', 'Education', 'Healthcare & pharma', 'Construction & contracting', 'Professional services', 'Manufacturing', 'Technology', 'Other'];

type Str = 'stage' | 'sector' | 'turnover' | 'employees' | 'years' | 'formationDriver' | 'formationCurrent' | 'foreignPartner' | 'cofounders' | 'licensingState' | 'regulatorAction' | 'licensingDuration' | 'customerData' | 'marketingNeed' | 'socialPresence' | 'growthGoal' | 'financials' | 'budget' | 'timeline' | 'mainProblem' | 'firstname' | 'lastname' | 'email' | 'phone' | 'company';
type List = 'branches' | 'contractsConcerns';
type Answers = Partial<Record<Str, string>> & Record<List, string[]>;

type StepId = 'basics' | 'challenges' | 'details' | 'final';
const stepLabel: Record<StepId, string> = { basics: 'Business basics', challenges: 'Your challenges', details: 'A few details', final: 'Final questions' };

type Props = {
	/** Set when the visitor arrived from a particular service: that service is pre-selected and the question is skipped. */
	initialBranch?: Branch;
	/** With a service chosen, the short form (that service's questions, then the last few) is used, unless `full` is set. */
	full?: boolean;
	/** A goal picked on the advisory page, already ticked. */
	initialGoal?: string;
	nextSteps: { t: string; d: string }[];
};

export function AssessmentFlow({ initialBranch, full, initialGoal, nextSteps }: Props) {
	const short = Boolean(initialBranch) && !full;
	const [answers, setAnswers] = useState<Answers>({ branches: initialBranch ? [initialBranch] : [], contractsConcerns: [], ...(initialGoal ? { growthGoal: initialGoal } : {}) });
	// With a service already chosen the "challenges" step is skipped, unless the visitor asks to change it.
	const [changing, setChanging] = useState(false);
	const flow: StepId[] = initialBranch && !changing ? (short ? ['details', 'final'] : ['basics', 'details', 'final']) : ['basics', 'challenges', 'details', 'final'];
	const [index, setIndex] = useState(0);
	const step = flow[Math.min(index, flow.length - 1)];
	const [error, setError] = useState('');
	const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
	const [priority, setPriority] = useState(false);
	const [captcha, setCaptcha] = useState('');
	const recaptcha = useRef<ReCAPTCHA>(null);
	const top = useRef<HTMLDivElement>(null);

	const set = (k: Str, v: string) => setAnswers((a) => ({ ...a, [k]: v }));
	const toggle = (k: List, v: string) => setAnswers((a) => ({ ...a, [k]: a[k].includes(v) ? a[k].filter((x) => x !== v) : [...a[k], v] }));
	const branches = answers.branches.filter((b): b is Branch => b !== 'unsure');

	useEffect(() => {
		top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, [index, state]);

	const validate = (): string => {
		if ((step === 'basics' || (step === 'details' && short)) && (!answers.stage || !answers.sector)) return 'Please choose your business stage and sector to continue.';
		if (step === 'challenges' && !answers.branches.length) return 'Please select at least one challenge, or tell us you are not sure.';
		return '';
	};
	const next = () => {
		const e = validate();
		setError(e);
		if (!e) setIndex((i) => Math.min(i + 1, flow.length - 1));
	};
	const back = () => {
		setError('');
		setIndex((i) => Math.max(0, i - 1));
	};
	const changeService = () => {
		// Show the challenges step (it sits right after "basics") with the current choice still ticked.
		setChanging(true);
		setError('');
		setIndex(1);
	};

	async function submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError('');
		if (!answers.budget || !answers.timeline) return setError('Please choose your budget band and timeline.');
		if (!captcha) return setError('Please tick “I’m not a robot” before submitting.');
		setState('sending');
		try {
			const res = await fetch('/api/business-assessment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...answers, captchaToken: captcha }) });
			const data = await res.json();
			if (!res.ok || !data.success) throw new Error(data.message || 'Unable to submit your assessment.');
			setPriority(Boolean(data.data?.priority));
			setState('done');
		} catch (err) {
			setError(err instanceof Error && err.message ? err.message : 'Please try again later.');
			setState('idle');
			setCaptcha('');
			recaptcha.current?.reset();
		}
	}

	if (state === 'done') return <ReadOut ref={top} name={answers.firstname ?? ''} branches={branches} priority={priority} nextSteps={nextSteps} onRestart={() => { setAnswers({ branches: initialBranch ? [initialBranch] : [], contractsConcerns: [], ...(initialGoal ? { growthGoal: initialGoal } : {}) }); setIndex(0); setChanging(false); setCaptcha(''); setState('idle'); }} />;

	return (
		<div ref={top} id="assessment-form" className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-16">
			<aside className="lg:sticky lg:top-32 lg:self-start">
				<StepRail steps={flow.map((s) => stepLabel[s])} current={index} />
			</aside>

			<div>
				{initialBranch && (
					<div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/25 bg-accent/[0.06] px-5 py-3.5">
						<p className="text-sm text-ink-soft">Your focus: <strong className="font-semibold text-ink">{branchMeta[branches[0] ?? initialBranch].label}</strong></p>
						{!changing && <button type="button" onClick={changeService} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-deep hover:underline"><Pencil className="size-3.5" /> Change</button>}
					</div>
				)}

				<form onSubmit={submit} className="rounded-card border border-line bg-white p-6 shadow-lift sm:p-10">
					<p className="text-xs font-semibold tracking-[0.16em] text-accent-deep uppercase">Step {index + 1} of {flow.length} · {stepLabel[step]}</p>

					{step === 'basics' && (
						<div className="hero-in">
							<h2 className="mt-3 text-heading">First, tell us where your business is today<span className="stop">.</span></h2>
							<div className="mt-8">
								<ChoiceGroup legend="Where are you right now?" name="stage" options={STAGES} value={answers.stage} onChange={(v) => set('stage', v)} />
								<ChoiceGroup legend="What sector are you in?" name="sector" options={SECTORS} value={answers.sector} onChange={(v) => set('sector', v)} columns={3} />
								<div className="mt-8">
									<p className="text-[1.0625rem] font-semibold">Size <span className="ml-1 text-sm font-normal text-ink-mute">Optional</span></p>
									<div className="mt-4 grid gap-4 sm:grid-cols-3">
										<Field label="Turnover band" optional><input value={answers.turnover ?? ''} onChange={(e) => set('turnover', e.target.value)} placeholder="e.g. Pre-revenue" className={inputClass} /></Field>
										<Field label="Employees" optional><input type="number" min="0" value={answers.employees ?? ''} onChange={(e) => set('employees', e.target.value)} placeholder="e.g. 5" className={inputClass} /></Field>
										<Field label="Years trading" optional><input type="number" min="0" value={answers.years ?? ''} onChange={(e) => set('years', e.target.value)} placeholder="e.g. 2" className={inputClass} /></Field>
									</div>
								</div>
							</div>
						</div>
					)}

					{step === 'challenges' && (
						<div className="hero-in">
							<h2 className="mt-3 text-heading">What&apos;s the main problem you&apos;re facing<span className="stop">?</span></h2>
							<p className="mt-3 max-w-xl text-ink-soft">Select all that apply. A business rarely has exactly one problem. You&apos;ll only see follow-up questions for what you choose.</p>
							<div className="mt-8">
								<ChoiceGroup legend="Choose one or more" name="branches" multiple columns={1} value={answers.branches} onChange={(v) => toggle('branches', v)} options={[...(Object.entries(branchMeta) as [Branch, (typeof branchMeta)[Branch]][]).map(([value, m]) => ({ value, label: m.problem, sub: m.label })), { value: 'unsure', label: 'I’m not sure, something just feels off' }]} />
							</div>
						</div>
					)}

					{step === 'details' && (
						<div className="hero-in">
							<h2 className="mt-3 text-heading">{short ? 'A few quick questions' : 'A little more about what you picked'}<span className="stop">.</span></h2>
							{branches.length === 0 ? (
								<p className="mt-4 rounded-xl bg-mist p-5 text-ink-soft"><strong className="text-ink">It&apos;s okay not to know yet.</strong> Your answers will route you to a diagnostic recommendation, so the underlying issue can be clarified properly.</p>
							) : <p className="mt-3 text-ink-soft">You&apos;ll only see questions related to the areas you selected.</p>}
							<div className="mt-8 grid gap-10">
								{short && (
									<div className="rounded-card-sm border border-line p-6 sm:p-8">
										<h3 className="text-2xl font-bold text-accent-deep">About your business</h3>
										<div className="mt-6">
											<ChoiceGroup legend="Where are you right now?" name="stage" options={STAGES} value={answers.stage} onChange={(v) => set('stage', v)} />
											<ChoiceGroup legend="What sector are you in?" name="sector" options={SECTORS} value={answers.sector} onChange={(v) => set('sector', v)} columns={3} />
										</div>
									</div>
								)}
								{branches.includes('formation') && <BranchBlock title="Business Formation & Corporate Services">
									<ChoiceGroup legend="What’s driving this?" name="formationDriver" value={answers.formationDriver} onChange={(v) => set('formationDriver', v)} options={['Starting a new business', 'Restructuring an existing one', 'Bringing in a partner, co-founder, or investor', 'Converting from one structure to another']} />
									<ChoiceGroup legend="What do you currently have, if anything?" name="formationCurrent" value={answers.formationCurrent} onChange={(v) => set('formationCurrent', v)} options={['Nothing registered yet', 'Business Name', 'Private Limited Company', 'NGO / Incorporated Trustees', 'Other / not sure']} />
									<ChoiceGroup legend="Does this involve a foreign shareholder or partner?" name="foreignPartner" value={answers.foreignPartner} onChange={(v) => set('foreignPartner', v)} options={['Yes', 'No']} />
									<ChoiceGroup legend="Are there co-founders or partners involved?" name="cofounders" value={answers.cofounders} onChange={(v) => set('cofounders', v)} options={['Yes', 'No, just me']} />
								</BranchBlock>}
								{branches.includes('licensing') && <BranchBlock title="Regulatory Licensing & Compliance">
									<ChoiceGroup legend="Which best describes it?" name="licensingState" columns={1} value={answers.licensingState} onChange={(v) => set('licensingState', v)} options={["I don't know what licences my business needs", "I know what I need but haven't started the application", "I have a licence but I'm not confident I'm fully compliant", "I'm behind on tax filing or annual returns"]} />
									<ChoiceGroup legend="Have you received a query, penalty, or enforcement action?" name="regulatorAction" value={answers.regulatorAction} onChange={(v) => set('regulatorAction', v)} options={['Yes', 'No', 'Not sure']} columns={3} />
									<ChoiceGroup legend="How long has this been unresolved?" name="licensingDuration" value={answers.licensingDuration} onChange={(v) => set('licensingDuration', v)} options={['Just realised it', 'A few months', 'Over a year']} columns={3} />
								</BranchBlock>}
								{branches.includes('contracts') && <BranchBlock title="Contracts, IP & Governance">
									<ChoiceGroup legend="What’s the specific concern?" name="contractsConcerns" multiple columns={1} value={answers.contractsConcerns} onChange={(v) => toggle('contractsConcerns', v)} options={["We don't have written contracts with clients or suppliers", "We don't have employment contracts or a staff handbook", "Our brand name or logo isn't trademarked", "We don't have a data protection policy", "We need a shareholders' or founders' agreement", "We're not confident our governance structure would hold up to scrutiny"]} />
									<ChoiceGroup legend="Do you collect or store customer personal or financial data?" name="customerData" value={answers.customerData} onChange={(v) => set('customerData', v)} options={['Yes', 'No', 'Not sure']} columns={3} />
								</BranchBlock>}
								{branches.includes('marketing') && <BranchBlock title="Marketing & Brand">
									<ChoiceGroup legend="What do you need most?" name="marketingNeed" value={answers.marketingNeed} onChange={(v) => set('marketingNeed', v)} options={['Ongoing social media management', 'A new brand identity, or a rebrand', 'A website', 'General marketing strategy / direction']} />
									<ChoiceGroup legend="What is your current social media presence?" name="socialPresence" value={answers.socialPresence} onChange={(v) => set('socialPresence', v)} options={['None yet', 'Some, but inconsistent', 'Active, but not converting into leads or sales']} columns={3} />
								</BranchBlock>}
								{branches.includes('advisory') && <BranchBlock title="Business Advisory & Growth">
									<ChoiceGroup legend="What’s the actual goal?" name="growthGoal" value={answers.growthGoal} onChange={(v) => set('growthGoal', v)} options={['Raising investment or funding', 'Entering a new market or region', 'Improving internal operations', 'Writing a formal business plan', 'Applying for a grant (NGOs)', 'Preparing for a bid or tender']} />
									<ChoiceGroup legend="Do you have financials or projections ready?" name="financials" value={answers.financials} onChange={(v) => set('financials', v)} options={['Have them, need them formalised', 'Starting from scratch']} />
								</BranchBlock>}
							</div>
						</div>
					)}

					{step === 'final' && (
						<div className="hero-in">
							<h2 className="mt-3 text-heading">Last few questions, then your read-out<span className="stop">.</span></h2>
							<div className="mt-8">
								<ChoiceGroup legend="What budget band are you working with?" hint="Helps us scope sensibly. Any fee is confirmed in writing before any work starts." name="budget" value={answers.budget} onChange={(v) => set('budget', v)} options={['Below ₦250,000', '₦250,000–₦1m', '₦1m–₦5m', 'Above ₦5m']} />
								<ChoiceGroup legend="What is your timeline?" name="timeline" value={answers.timeline} onChange={(v) => set('timeline', v)} options={['Immediately', 'Within 30 days', 'Within 90 days', 'Exploring options']} />
								<div className="mt-8">
									<Field label={short ? 'Anything else we should know?' : 'In your own words, what’s the one problem you most want solved?'} optional={short} hint={short ? undefined : 'This is the part we read first, so whoever takes your discovery call already understands your situation.'}>
										<textarea required={!short} rows={5} maxLength={3000} value={answers.mainProblem ?? ''} onChange={(e) => set('mainProblem', e.target.value)} placeholder="Tell us what is happening, what you have tried, and what outcome you need." className={cn(inputClass, 'resize-y')} />
									</Field>
								</div>
								<div role="group" aria-labelledby="readout-heading" className="mt-10 rounded-card-sm bg-mist p-6 sm:p-8">
									<h3 id="readout-heading" className="font-sans text-[1.0625rem] font-semibold">Where should we send your read-out?</h3>
									<p className="mt-1 mb-5 text-sm text-ink-soft">We use these details only to follow up on this assessment. Your answers are kept confidential.</p>
									<div className="grid gap-4 sm:grid-cols-2">
										<Field label="First name"><input required maxLength={100} value={answers.firstname ?? ''} onChange={(e) => set('firstname', e.target.value)} autoComplete="given-name" className={inputClass} /></Field>
										<Field label="Last name"><input required maxLength={100} value={answers.lastname ?? ''} onChange={(e) => set('lastname', e.target.value)} autoComplete="family-name" className={inputClass} /></Field>
										<Field label="Email address"><input required type="email" maxLength={254} value={answers.email ?? ''} onChange={(e) => set('email', e.target.value)} autoComplete="email" placeholder="you@company.com" className={inputClass} /></Field>
										<Field label="Phone / WhatsApp"><input required type="tel" maxLength={50} value={answers.phone ?? ''} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" placeholder="+234 000 000 0000" className={inputClass} /></Field>
										<div className="sm:col-span-2"><Field label="Company or working name" optional><input maxLength={150} value={answers.company ?? ''} onChange={(e) => set('company', e.target.value)} autoComplete="organization" className={inputClass} /></Field></div>
									</div>
									<div className="mt-6 min-h-[78px]"><ReCAPTCHA ref={recaptcha} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''} onChange={(t) => { setCaptcha(t || ''); setError(''); }} onExpired={() => setCaptcha('')} /></div>
									<p className="mt-4 text-sm text-ink-mute">By submitting, you agree we may contact you about this assessment, in line with our <SiteLink href="/privacy" className="prose-link">Privacy Policy</SiteLink> and the NDPA.</p>
								</div>
							</div>
						</div>
					)}

					<FormError>{error}</FormError>

					<div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
						{index > 0 ? <button type="button" onClick={back} disabled={state === 'sending'} className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-5 py-3 text-[0.9375rem] font-medium transition-colors hover:bg-ink hover:text-white"><ArrowLeft className="size-4" /> Back</button> : <span />}
						{step !== 'final' ? (
							<button type="button" onClick={next} className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-accent-btn py-1.5 pr-1.5 pl-6 font-medium text-white transition-colors hover:bg-accent-hover">Continue <span className="grid size-9 place-items-center rounded-full bg-white/20"><ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span></button>
						) : (
							<button type="submit" disabled={state === 'sending'} className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-accent-btn py-1.5 pr-1.5 pl-6 font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70">
								{state === 'sending' ? <><Loader2 className="mr-3 size-5 animate-spin" /> Submitting…</> : <>See my read-out <span className="grid size-9 place-items-center rounded-full bg-white/20"><ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span></>}
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}

function BranchBlock({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div className="rounded-card-sm border border-line p-6 sm:p-8">
			<h3 className="font-display text-2xl text-accent-deep">{title}</h3>
			<div className="mt-6">{children}</div>
		</div>
	);
}


const ReadOut = forwardRef<HTMLDivElement, { name: string; branches: Branch[]; priority: boolean; nextSteps: { t: string; d: string }[]; onRestart: () => void }>(function ReadOut({ name, branches, priority, nextSteps, onRestart }, ref) {
	const scheduler = process.env.NEXT_PUBLIC_DISCOVERY_CALL_URL;
	const bookable = Boolean(scheduler && /^https?:/.test(scheduler));
	const src = bookable ? `${scheduler}${scheduler!.includes('?') ? '&' : '?'}utm_source=business-assessment&utm_medium=website&utm_campaign=free-discovery-call` : '';
	return (
		<div ref={ref} id="assessment-form" className="hero-in mx-auto max-w-4xl">
			<div className="rounded-card bg-ink-deep p-8 text-white sm:p-12">
				<span className="grid size-14 place-items-center rounded-full bg-accent-btn text-white"><Check className="size-7" strokeWidth={2.5} /></span>
				<p className="mt-6 text-xs tracking-[0.18em] text-accent-soft uppercase">Assessment complete</p>
				<h2 className="mt-2 text-title">{name ? `Thank you, ${name}.` : 'Thank you.'} Your read-out<span className="stop">.</span></h2>
				<p className="mt-4 max-w-2xl text-lead text-white/75">{branches.length ? 'Based on your answers, these service areas are most relevant to what your business is facing right now.' : 'Your answers suggest the issue crosses several areas or is not yet clearly defined. A free discovery call will help us identify the real problem before recommending any work.'}</p>
				{priority && <p className="mt-5 inline-flex rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-ink">Priority: you said it&apos;s urgent, so we&apos;ll reply as fast as we can</p>}
			</div>

			{branches.length > 0 && (
				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					{branches.map((b, i) => (
						<article key={b} className="rounded-card-sm border border-line bg-white p-6">
							<p className="font-display text-3xl text-accent-deep">0{i + 1}</p>
							<h3 className="mt-2 font-sans text-lg font-semibold">{branchMeta[b].label}</h3>
							<p className="mt-2 text-[0.9375rem] text-ink-soft">Recommended because you selected: “{branchMeta[b].problem}.”</p>
							<SiteLink href={`/services/${branchMeta[b].slug}`} className="mt-4 inline-block text-sm font-semibold text-accent-deep hover:underline">See what&apos;s included →</SiteLink>
						</article>
					))}
				</div>
			)}

			<section className="mt-6 rounded-card border border-line bg-white p-6 sm:p-10">
				<p className="label-dot text-xs tracking-[0.18em] text-ink-mute uppercase">What happens next</p>
				<ol className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
					{nextSteps.map((s, i) => (
						<li key={s.t} className="grid grid-cols-[2.5rem_1fr] gap-3">
							<span className="font-display text-3xl text-accent-deep">{i + 1}</span>
							<span><span className="block font-semibold">{s.t}</span><span className="mt-0.5 block text-[0.9375rem] text-ink-soft">{s.d}</span></span>
						</li>
					))}
				</ol>
			</section>

			<section className="mt-6 rounded-card border border-line bg-mist p-6 sm:p-10">
				<h3 className="font-display text-3xl">Choose a time for your free discovery call</h3>
				{bookable ? (
					<>
						<p className="mt-2 text-ink-soft">Your booking is confirmed by email, with the meeting details and link.</p>
						<div className="mt-6 overflow-hidden rounded-card-sm bg-white"><iframe title="Book your free discovery call" src={src} loading="lazy" className="h-[44rem] w-full border-0" /></div>
					</>
				) : (
					<>
						<p className="mt-2 max-w-xl text-ink-soft">We&apos;ll reply within 1 business day to arrange your free 15-minute discovery call. Prefer to talk sooner? Reach us directly.</p>
						<div className="mt-6 flex flex-wrap gap-3">
							<Button href={company.whatsapp}>Chat on WhatsApp</Button>
							<Button href={`mailto:${company.email}`} variant="outline" arrow={false}>Email us</Button>
						</div>
					</>
				)}
			</section>

			<button type="button" onClick={onRestart} className="mt-8 text-sm font-semibold text-ink-soft underline decoration-accent-soft underline-offset-4 hover:text-accent-deep">Retake the assessment</button>
		</div>
	);
});
