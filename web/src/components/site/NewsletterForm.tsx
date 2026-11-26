'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

/** Footer newsletter signup. Posts to the existing /api/newsletter/subscribe route. */
export function NewsletterForm() {
	const [email, setEmail] = useState('');
	const [busy, setBusy] = useState(false);

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const value = email.trim();
		if (!value || busy) return;
		setBusy(true);
		try {
			const body = new FormData();
			body.append('email', value);
			const res = await fetch('/api/newsletter/subscribe', { method: 'POST', body });
			const data = await res.json().catch(() => ({}));
			if (!res.ok || !data.success) throw new Error(data.message || 'Subscription failed. Please try again.');
			toast.success(data.message || 'Thank you for subscribing.');
			setEmail('');
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
		} finally {
			setBusy(false);
		}
	}

	return (
		<form id="newsletter" onSubmit={onSubmit} aria-label="Newsletter">
			<label htmlFor="newsletter-email" className="text-3xl font-bold text-white">
				Subscribe to our newsletter<span className="stop">.</span>
			</label>
			<p className="mt-2 text-white/70">One email a month. Unsubscribe any time.</p>
			<div className="mt-5 flex flex-col gap-3 sm:flex-row">
				<input
					id="newsletter-email"
					type="email"
					required
					autoComplete="email"
					placeholder="Email address"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="min-h-12 min-w-0 flex-1 rounded-full border border-white/30 bg-white/5 px-5 text-white placeholder:text-white/50 focus:border-accent-soft focus:outline-none"
				/>
				<button type="submit" disabled={busy} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-accent-btn px-7 font-semibold text-white transition-colors hover:bg-accent-bright disabled:opacity-50">
					{busy ? 'Subscribing…' : 'Subscribe'}
					<ArrowRight className="size-4" />
				</button>
			</div>
		</form>
	);
}
