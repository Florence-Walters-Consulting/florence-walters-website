'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, Pencil } from 'lucide-react';
import { SiteLink } from '@/components/ui/SiteLink';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { consultationTypes, type ConsultationType, type TextKey } from '@/lib/forms/consultation-content';
import { ChoiceGroup, Field, FormError, StepRail, inputClass } from './form-ui';

type Answers = Partial<Record<TextKey, string>> & { type?: ConsultationType; topics: string[] };
type StepId = 'type' | 'requirements' | 'contact';
const stepLabel: Record<StepId, string> = { type: 'Consultation type', requirements: 'Your requirements', contact: 'Contact details' };

type Props = {
	/** Set when the visitor already chose a type (from a service page): step 1 is skipped. */
	initialType?: ConsultationType;
	nextSteps: { t: string; d: string }[];
};

export function ConsultationFlow({ initialType, nextSteps }: Props) {
	const [answers, setAnswers] = useState<Answers>({ type: initialType, topics: [] });
	const [changing, setChanging] = useState(false);
	const flow: StepId[] = initialType && !changing ? ['requirements', 'contact'] : ['type', 'requirements', 'contact'];
	const [index, setIndex] = useState(0);
	const step = flow[Math.min(index, flow.length - 1)];
	const [error, setError] = useState('');
	const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
	const [priority, setPriority] = useState(false);
	const [captcha, setCaptcha] = useState('');
	const recaptcha = useRef<ReCAPTCHA>(null);
	const top = useRef<HTMLDivElement>(null);

	const type = consultationTypes.find((t) => t.value === answers.type);
	const set = (k: TextKey, v: string) => setAnswers((a) => ({ ...a, [k]: v }));
	const toggleTopic = (t: string) => setAnswers((a) => ({ ...a, topics: a.topics.includes(t) ? a.topics.filter((x) => x !== t) : [...a.topics, t] }));
	const urgent = (answers.type === 'legal' && answers.legalDeadline === 'Yes' && !!answers.deadlineDetails?.trim()) || (answers.type === 'tax' && !!answers.taxTimeline?.startsWith('Immediate'));

	useEffect(() => {
		top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, [index, state]);

	const validate = () => {
		if (step === 'type' && !answers.type) return 'Please choose a consultation type to continue.';
		if (step === 'requirements') {
			if (!answers.topics.length) return 'Please select at least one topic you would like to discuss.';
			if (answers.type === 'legal' && answers.legalDeadline === 'Yes' && !answers.deadlineDetails?.trim()) return 'Please tell us the deadline, so we can prioritise your request.';
		}
		return '';
	};
	const next = () => {
		const e = validate();
		setError(e);
		if (!e) setIndex((i) => Math.min(i + 1, flow.length - 1));
	};

	async function submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError('');
		if (!answers.contactMethod) return setError('Please choose the best way for us to reach you.');
		if (!captcha) return setError('Please tick “I’m not a robot” before sending.');
		setState('sending');
		try {
			const res = await fetch('/api/paid-consultation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...answers, captchaToken: captcha }) });
			const data = await res.json();
			if (!res.ok || !data.success) throw new Error(data.message || 'Unable to send your consultation request.');
			setPriority(Boolean(data.data?.priority));
			setState('done');
		} catch (err) {
			setError(err instanceof Error && err.message ? err.message : 'Please try again later.');
			setState('idle');
			setCaptcha('');
			recaptcha.current?.reset();
		}
	}

	if (state === 'done')
		return <Confirmation ref={top} name={answers.firstname ?? ''} typeLabel={type?.label ?? ''} topics={answers.topics} method={answers.contactMethod ?? ''} priority={priority} nextSteps={nextSteps} onRestart={() => { setAnswers({ type: initialType, topics: [] }); setChanging(false); setIndex(0); setCaptcha(''); setState('idle'); }} />;

	return (
		<div ref={top} id="consultation-form" className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-16">
			<aside className="lg:sticky lg:top-32 lg:self-start">
				<StepRail steps={flow.map((s) => stepLabel[s])} current={index} />
				<div className="mt-10 hidden rounded-card-sm bg-mist p-5 text-sm text-ink-soft lg:block">
					<p className="font-semibold text-ink">No price is shown or charged at this stage.</p>
					<p className="mt-2">The fee is confirmed in writing before anything is booked.</p>
				</div>
			</aside>

			<div>
				{initialType && type && (
					<div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/25 bg-accent/[0.06] px-5 py-3.5">
						<p className="text-sm text-ink-soft">Consultation type: <strong className="font-semibold text-ink">{type.label}</strong></p>
						{!changing && <button type="button" onClick={() => { setChanging(true); setIndex(0); setError(''); }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-deep hover:underline"><Pencil className="size-3.5" /> Change type</button>}
					</div>
				)}

				<form onSubmit={submit} className="rounded-card border border-line bg-white p-6 shadow-lift sm:p-10">
					<p className="text-xs font-semibold tracking-[0.16em] text-accent-deep uppercase">Step {index + 1} of {flow.length} · {stepLabel[step]}</p>

					{step === 'type' && (
						<div className="hero-in">
							<h2 className="mt-3 text-heading">Which type of consultation<span className="stop">?</span></h2>
							<p className="mt-3 max-w-xl text-ink-soft">Choose one. This answer decides which follow-up questions appear next.</p>
							<div className="mt-8 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Consultation type">
								{consultationTypes.map((t) => {
									const on = answers.type === t.value;
									return (
										<button key={t.value} type="button" role="radio" aria-checked={on} onClick={() => setAnswers({ type: t.value, topics: [] })} className={cn('group flex flex-col items-start rounded-xl border p-5 text-left transition-all duration-300', on ? 'border-accent bg-accent/[0.06] shadow-[0_8px_24px_-16px_rgb(75_72_214/0.6)]' : 'border-line bg-white hover:border-ink/30')}>
											<span className="flex w-full items-center justify-between">
												<span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold tracking-wider text-accent-deep uppercase">{t.tag}</span>
												<span aria-hidden className={cn('grid size-5 place-items-center rounded-full border-2', on ? 'border-accent bg-accent-btn text-white' : 'border-accent-soft')}>{on && <Check className="size-3.5" strokeWidth={3.5} />}</span>
											</span>
											<span className="mt-4 text-[1.0625rem] font-semibold leading-snug">{t.label}</span>
											<span className="mt-1.5 text-sm text-ink-soft">{t.description}</span>
										</button>
									);
								})}
							</div>
						</div>
					)}

					{step === 'requirements' && type && (
						<div className="hero-in">
							<h2 className="mt-3 text-heading">{type.label}<span className="stop">.</span></h2>
							<p className="mt-3 max-w-2xl text-ink-soft">{type.intro}</p>
							<div className="mt-8">
								<ChoiceGroup legend="Which of these would you like to discuss?" name="topics" multiple columns={1} options={type.topics} value={answers.topics} onChange={toggleTopic} />
								{answers.topics.includes('Something else') && (
									<div className="mt-5"><Field label="Tell us briefly what" optional><input value={answers.otherTopic ?? ''} onChange={(e) => set('otherTopic', e.target.value)} maxLength={1000} placeholder="e.g. the specific question you want answered" className={inputClass} /></Field></div>
								)}
								{type.questions.map((q) => <ChoiceGroup key={q.name} legend={q.label} name={q.name} options={q.options} value={answers[q.name]} onChange={(v) => set(q.name, v)} />)}
								{answers.type === 'legal' && answers.legalDeadline === 'Yes' && (
									<div className="mt-5"><Field label="What is the deadline?" hint="A stated deadline flags your request for a reply within 4 business hours."><textarea required rows={3} value={answers.deadlineDetails ?? ''} onChange={(e) => set('deadlineDetails', e.target.value)} maxLength={1000} placeholder="Include the date and what must happen by then." className={cn(inputClass, 'resize-y')} /></Field></div>
								)}
								{urgent && <p className="mt-6 flex items-start gap-3 rounded-xl bg-gold/20 px-4 py-3 text-sm text-ink"><AlertTriangle className="mt-0.5 size-4 shrink-0" /> <span><strong>Urgent.</strong> This will be flagged for a reply within 4 business hours.</span></p>}
							</div>
						</div>
					)}

					{step === 'contact' && (
						<div className="hero-in">
							<h2 className="mt-3 text-heading">Your contact details<span className="stop">.</span></h2>
							<p className="mt-3 max-w-xl text-ink-soft">So we can reach you with the fee and available times. We use these details only to respond to this request, in line with the NDPA.</p>
							<div className="mt-8 grid gap-4 sm:grid-cols-2">
								<Field label="Full name"><input required maxLength={150} value={answers.firstname ?? ''} onChange={(e) => set('firstname', e.target.value)} autoComplete="name" className={inputClass} /></Field>
								<Field label="Company"><input required maxLength={150} value={answers.company ?? ''} onChange={(e) => set('company', e.target.value)} autoComplete="organization" className={inputClass} /></Field>
								<Field label="Email address"><input required type="email" maxLength={254} value={answers.email ?? ''} onChange={(e) => set('email', e.target.value)} autoComplete="email" placeholder="you@company.com" className={inputClass} /></Field>
								<Field label="Phone number"><input required type="tel" maxLength={50} value={answers.phone ?? ''} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" placeholder="+234 000 000 0000" className={inputClass} /></Field>
							</div>
							<ChoiceGroup legend="What is the best way to reach you?" name="contactMethod" columns={3} options={['Phone call', 'WhatsApp', 'Email only']} value={answers.contactMethod} onChange={(v) => set('contactMethod', v)} />
							<div className="mt-8 grid gap-4">
								<Field label="Best time to reach you"><input required maxLength={150} value={answers.contactTime ?? ''} onChange={(e) => set('contactTime', e.target.value)} placeholder="e.g. weekday mornings, after 2pm" className={inputClass} /></Field>
								<Field label="Anything else we should know before reaching out?" optional><textarea rows={4} maxLength={3000} value={answers.additionalNotes ?? ''} onChange={(e) => set('additionalNotes', e.target.value)} placeholder="Context, documents you have ready, people who'll join" className={cn(inputClass, 'resize-y')} /></Field>
							</div>
							<div className="mt-6 min-h-[78px]"><ReCAPTCHA ref={recaptcha} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''} onChange={(t) => { setCaptcha(t || ''); setError(''); }} onExpired={() => setCaptcha('')} /></div>
							<p className="mt-4 text-sm text-ink-mute">See our <SiteLink href="/privacy" className="prose-link">Privacy Policy</SiteLink>.</p>
						</div>
					)}

					<FormError>{error}</FormError>

					<div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
						{index > 0 ? <button type="button" onClick={() => { setError(''); setIndex((i) => Math.max(0, i - 1)); }} disabled={state === 'sending'} className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-5 py-3 text-[0.9375rem] font-medium transition-colors hover:bg-ink hover:text-white"><ArrowLeft className="size-4" /> Back</button> : <SiteLink href="/services/consultation" className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink"><ArrowLeft className="size-4" /> Back to Paid Consultation</SiteLink>}
						{step !== 'contact' ? (
							<button type="button" onClick={next} className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-accent-btn py-1.5 pr-1.5 pl-6 font-medium text-white transition-colors hover:bg-accent-hover">Continue <span className="grid size-9 place-items-center rounded-full bg-white/20"><ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span></button>
						) : (
							<button type="submit" disabled={state === 'sending'} className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-accent-btn py-1.5 pr-1.5 pl-6 font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70">
								{state === 'sending' ? <><Loader2 className="mr-3 size-5 animate-spin" /> Sending…</> : <>Send my request <span className="grid size-9 place-items-center rounded-full bg-white/20"><ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span></>}
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}

const Confirmation = forwardRef<HTMLDivElement, { name: string; typeLabel: string; topics: string[]; method: string; priority: boolean; nextSteps: { t: string; d: string }[]; onRestart: () => void }>(function Confirmation({ name, typeLabel, topics, method, priority, nextSteps, onRestart }, ref) {
	return (
		<div ref={ref} id="consultation-form" className="hero-in mx-auto max-w-4xl">
			<div className="rounded-card bg-ink-deep p-8 text-white sm:p-12">
				<span className="grid size-14 place-items-center rounded-full bg-accent-btn"><Check className="size-7" strokeWidth={2.5} /></span>
				<p className="mt-6 text-xs tracking-[0.18em] text-accent-soft uppercase">{priority ? 'Urgent: priority response' : 'Request received'}</p>
				<h2 className="mt-2 text-title">{name ? `Thank you, ${name}.` : 'Thank you.'}</h2>
				<p className="mt-4 max-w-2xl text-lead text-white/75">{priority ? 'Given the timeline you flagged, we’ll be in touch within 4 business hours to confirm details and pricing before anything is booked.' : 'We’ll be in touch within 1 business day to confirm details and pricing before anything is booked.'}</p>
			</div>
			<div className="mt-6 grid gap-6 md:grid-cols-2">
				<section className="rounded-card border border-line bg-white p-6 sm:p-8">
					<p className="label-dot text-xs tracking-[0.18em] text-ink-mute uppercase">Your request</p>
					<dl className="mt-5 divide-y divide-line text-[0.9375rem]">
						<div className="grid gap-1 pb-4"><dt className="text-xs tracking-wider text-ink-mute uppercase">Consultation</dt><dd className="font-semibold">{typeLabel}</dd></div>
						<div className="grid gap-1 py-4"><dt className="text-xs tracking-wider text-ink-mute uppercase">Topics</dt><dd>{topics.join(' · ')}</dd></div>
						<div className="grid gap-1 pt-4"><dt className="text-xs tracking-wider text-ink-mute uppercase">We will reach you by</dt><dd>{method}</dd></div>
					</dl>
				</section>
				<section className="rounded-card border border-line bg-mist p-6 sm:p-8">
					<p className="label-dot text-xs tracking-[0.18em] text-ink-mute uppercase">What happens next</p>
					<ol className="mt-5 grid gap-5">
						{nextSteps.map((s, i) => (
							<li key={s.t} className="grid grid-cols-[2rem_1fr] gap-3"><span className="font-display text-2xl text-accent-deep">{i + 1}</span><span><span className="block font-semibold">{s.t}</span><span className="block text-sm text-ink-soft">{s.d}</span></span></li>
						))}
					</ol>
				</section>
			</div>
			<div className="mt-8 flex flex-wrap items-center gap-4">
				<Button href="/services/consultation" variant="outline" arrow={false}>Back to Paid Consultation</Button>
				<button type="button" onClick={onRestart} className="text-sm font-semibold text-ink-soft underline decoration-accent-soft underline-offset-4 hover:text-accent-deep">Start a new request</button>
			</div>
		</div>
	);
});
