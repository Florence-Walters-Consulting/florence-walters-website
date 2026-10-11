'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';

export default function NewsletterForm() {
	const [email, setEmail] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const normalizedEmail = email.trim();
		if (!normalizedEmail || isSubmitting) return;

		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append('email', normalizedEmail);
			const response = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				body: formData,
			});
			const result = await response.json().catch(() => ({}));
			if (!response.ok || !result.success)
				throw new Error(result.message || 'Subscription failed. Please try again.');
			await Swal.fire({
				icon: 'success',
				title: 'Thank you',
				text: result.message || 'Thank you for subscribing.',
				timer: 1800,
				showConfirmButton: false,
			});
			setEmail('');
		} catch (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Unable to subscribe',
				text: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				placeholder="Enter your email"
				value={email}
				onChange={(event) => setEmail(event.target.value)}
				required
				disabled={isSubmitting}
			/>
			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Subscribing...' : 'Subscribe'} {!isSubmitting && <span>→</span>}
			</button>
		</form>
	);
}
