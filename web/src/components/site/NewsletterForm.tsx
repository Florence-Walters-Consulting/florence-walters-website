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
			<div className="mt-6 flex items-center border-b border-white/30 transition-colors focus-within:border-accent-soft">
				<input
					id="newsletter-email"
					type="email"
					required
					autoComplete="email"
					placeholder="Email address"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="min-w-0 flex-1 bg-transparent py-3 text-white placeholder:text-white/50 focus:outline-none"
				/>
				<button type="submit" disabled={busy} aria-label="Subscribe" className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-btn text-white transition-colors hover:bg-accent-bright disabled:opacity-50">
					<ArrowRight className="size-4" />
				</button>
			</div>
		</form>
	);
}
