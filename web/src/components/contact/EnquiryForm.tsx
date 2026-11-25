'use client';

import { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { SiteLink } from '@/components/ui/SiteLink';
import { cn } from '@/lib/cn';

const interests = [
	'Business Formation & Corporate Services',
	'Regulatory Licensing & Compliance',
	'Contracts, IP & Governance',
	'Business Advisory & Growth',
	'Marketing & Brand',
	'Paid Consultation',
	'Other enquiry',
];

type Values = { full_name: string; email: string; phone: string; company: string; subject: string; message: string; website: string };
const empty: Values = { full_name: '', email: '', phone: '', company: '', subject: '', message: '', website: '' };

const field = 'w-full rounded-xl border border-line bg-white px-4 py-3.5 text-ink placeholder:text-ink-mute/70 transition-[border-color,box-shadow] duration-300 focus:border-accent focus:shadow-[0_0_0_4px_rgb(75_72_214/0.12)] focus:outline-none';
const label = 'mb-2 block text-sm font-medium text-ink';

/** Enquiry form. Same API and anti-spam rules as before (honeypot, timing check, reCAPTCHA, rate limits). */
export function EnquiryForm() {
	const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';
	const [v, setV] = useState<Values>(empty);
	const [captcha, setCaptcha] = useState('');
	const [captchaOn, setCaptchaOn] = useState(false); // load Google's script only once someone starts the form
	const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
	const [error, setError] = useState('');
	const [sentMessage, setSentMessage] = useState('');
	// Set after mount (prerender would freeze it at build time). The API rejects submissions that arrive too fast.
	const [startedAt, setStartedAt] = useState(0);
	const recaptcha = useRef<ReCAPTCHA>(null);

	useEffect(() => {
		const t = window.setTimeout(() => setStartedAt(Date.now()), 0);
		return () => window.clearTimeout(t);
	}, []);

	const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV((c) => ({ ...c, [e.target.name]: e.target.value }));

	async function submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError('');
		if (!captcha) return setError('Please tick “I’m not a robot” before sending.');
		const parts = v.full_name.trim().split(/\s+/);
		const first = parts.shift();
		const last = parts.join(' ') || first;
		setState('sending');
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...v, first_name: first, last_name: last, captchaToken: captcha, formStartedAt: startedAt }),
			});
			const data = await res.json();
			if (!res.ok || !data.success) throw new Error(data.message || 'Unable to send your enquiry.');
			setSentMessage(data.message);
			setState('sent');
			setV(empty);
		} catch (err) {
			setError(err instanceof Error && err.message ? err.message : 'Please try again.');
			setState('idle');
		}
		setCaptcha('');
		recaptcha.current?.reset();
	}

	if (state === 'sent') {
		return (
			<div className="hero-in grid min-h-[28rem] place-items-center rounded-card border border-line bg-white p-10 text-center shadow-lift" role="status">
				<div>
					<span className="mx-auto grid size-16 place-items-center rounded-full bg-accent/10 text-accent-deep"><CheckCircle2 className="size-8" strokeWidth={1.5} /></span>
					<h3 className="mt-6 font-display text-4xl">Enquiry sent<span className="stop">.</span></h3>
					<p className="mx-auto mt-3 max-w-sm text-ink-soft">{sentMessage} We typically respond within one business day.</p>
					<button onClick={() => { setState('idle'); setStartedAt(Date.now()); }} className="mt-8 rounded-full border border-ink/25 px-6 py-3 text-[0.9375rem] font-medium transition-colors hover:bg-ink hover:text-white">Send another enquiry</button>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={submit} onFocusCapture={() => setCaptchaOn(true)} className="rounded-card border border-line bg-white p-6 shadow-lift sm:p-10">
			<label className="absolute -left-[9999px]" aria-hidden="true">Website<input name="website" value={v.website} onChange={set} tabIndex={-1} autoComplete="off" /></label>
			<div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
				<div><label htmlFor="c-name" className={label}>Full name <span className="text-accent-deep">*</span></label><input id="c-name" name="full_name" maxLength={200} value={v.full_name} onChange={set} placeholder="Your full name" autoComplete="name" required className={field} /></div>
				<div><label htmlFor="c-email" className={label}>Email address <span className="text-accent-deep">*</span></label><input id="c-email" type="email" name="email" maxLength={254} value={v.email} onChange={set} placeholder="you@company.com" autoComplete="email" required className={field} /></div>
				<div><label htmlFor="c-phone" className={label}>Phone number <span className="text-accent-deep">*</span></label><input id="c-phone" type="tel" name="phone" maxLength={50} value={v.phone} onChange={set} placeholder="+234 000 000 0000" autoComplete="tel" required className={field} /></div>
				<div><label htmlFor="c-company" className={label}>Company / organisation</label><input id="c-company" name="company" maxLength={150} value={v.company} onChange={set} placeholder="Your company name" autoComplete="organization" className={field} /></div>
			</div>
			<div className="mt-6">
				<label htmlFor="c-subject" className={label}>What do you need help with? <span className="text-accent-deep">*</span></label>
				<select id="c-subject" name="subject" value={v.subject} onChange={set} required className={cn(field, 'appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%231f2a44%27 stroke-width=%272%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-11', !v.subject && 'text-ink-mute/70')}>
					<option value="" disabled>Select a service area</option>
					{interests.map((o) => <option key={o} className="text-ink">{o}</option>)}
				</select>
			</div>
			<div className="mt-6">
				<label htmlFor="c-message" className={label}>Message <span className="text-accent-deep">*</span></label>
				<textarea id="c-message" name="message" rows={6} maxLength={5000} value={v.message} onChange={set} placeholder="Briefly describe your needs or the matter you would like to discuss" required className={cn(field, 'resize-y')} />
				<p className="mt-2 text-xs text-ink-mute">{v.message.trim().length < 20 ? 'A few lines help us prepare, at least 20 characters.' : 'Thank you. That is plenty to start with.'}</p>
			</div>

			<div className="mt-6 min-h-[78px]">{captchaOn && siteKey && <ReCAPTCHA ref={recaptcha} sitekey={siteKey} onChange={(t) => { setCaptcha(t || ''); setError(''); }} onExpired={() => setCaptcha('')} />}</div>

			{error && <p role="alert" className="mt-4 rounded-xl border border-[#e8664a]/40 bg-[#e8664a]/10 px-4 py-3 text-sm text-[#a2381f]">{error}</p>}

			<button type="submit" disabled={state === 'sending'} className="group mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-accent-btn px-8 text-base font-medium text-white transition-colors duration-300 hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70 sm:w-auto">
				{state === 'sending' ? <><Loader2 className="size-5 animate-spin" /> Sending your enquiry…</> : 'Book a consultation'}
			</button>
			<p className="mt-5 text-sm text-ink-mute">By submitting this form, you agree to our <SiteLink href="/privacy" className="prose-link">Privacy Policy</SiteLink>. All information is treated with strict professional confidentiality.</p>
		</form>
	);
}
