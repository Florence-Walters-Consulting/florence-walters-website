'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';

type FormData = {
	full_name: string;
	email: string;
	phone: string;
	company: string;
	subject: string;
	message: string;
	website: string;
};

const emptyForm: FormData = { full_name: '', email: '', phone: '', company: '', subject: '', message: '', website: '' };

export default function ContactForm() {
	const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';
	const [captchaToken, setCaptchaToken] = useState('');
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<FormData>(emptyForm);
	// Set after mount (not during prerender, which would freeze it at build time). The API uses it
	// to reject bot submissions that arrive too fast.
	const [formStartedAt, setFormStartedAt] = useState(0);
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFormStartedAt(Date.now());
	}, []);
	const captchaRef = useRef<ReCAPTCHA>(null);

	const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
		setFormData((current) => ({ ...current, [target.name]: target.value }));

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!captchaToken) {
			Swal.fire({ icon: 'error', title: 'Captcha Error', text: 'Please verify that you are not a robot', timer: 1500, showConfirmButton: false });
			return;
		}

		const nameParts = formData.full_name.trim().split(/\s+/);
		const firstName = nameParts.shift();
		const lastName = nameParts.join(' ') || firstName;
		setLoading(true);
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...formData, first_name: firstName, last_name: lastName, captchaToken, formStartedAt }),
			});
			const result = await response.json();
			if (!response.ok || !result.success) throw new Error(result.message || 'Unable to send your enquiry.');
			await Swal.fire({ icon: 'success', title: 'Enquiry Sent', text: result.message, showConfirmButton: true });
			setFormData(emptyForm);
			setCaptchaToken('');
			setFormStartedAt(Date.now());
			captchaRef.current?.reset();
		} catch (error) {
			setCaptchaToken('');
			captchaRef.current?.reset();
			Swal.fire({ icon: 'error', title: 'Unable to send', text: (error instanceof Error ? error.message : '') || 'Please try again.', showConfirmButton: true });
		} finally {
			setLoading(false);
		}
	};

	return (
			<form className="contact-form" onSubmit={handleSubmit}>
				<label className="contact-honeypot" aria-hidden="true">Website<input name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" /></label>
				<div className="contact-form-grid">
					<label>Full Name<span>*</span><input name="full_name" maxLength={200} value={formData.full_name} onChange={handleChange} placeholder="Enter Your Full Name" autoComplete="name" required /></label>
					<label>Email Address<span>*</span><input type="email" name="email" maxLength={254} value={formData.email} onChange={handleChange} placeholder="your@email.com" autoComplete="email" required /></label>
					<label>Phone Number<span>*</span><input type="tel" name="phone" maxLength={50} value={formData.phone} onChange={handleChange} placeholder="+234 000 000 000" autoComplete="tel" required /></label>
					<label>Company/Organization<input name="company" maxLength={150} value={formData.company} onChange={handleChange} placeholder="Your Company Name" autoComplete="organization" /></label>
				</div>
				<label>Service Interest<span>*</span><select name="subject" value={formData.subject} onChange={handleChange} required><option value="" disabled>Select a service area</option><option>Business Formation</option><option>Regulatory Compliance</option><option>Business Advisory</option><option>Market Entry Strategy</option><option>Fintech Advisory</option><option>Other Enquiry</option></select></label>
				<label>Message<span>*</span><textarea name="message" maxLength={5000} value={formData.message} onChange={handleChange} placeholder="Briefly describe your advisory needs or the matter you would like to discuss" required /></label>
				<div className="contact-captcha"><ReCAPTCHA ref={captchaRef} sitekey={siteKey} onChange={(token) => setCaptchaToken(token || '')} onExpired={() => setCaptchaToken('')} /></div>
				<button type="submit" disabled={loading}>{loading ? 'Sending your enquiry...' : 'Book a Consultation'}</button>
				<p className="contact-privacy">By submitting this form, you agree to our <Link href="/privacy">Privacy Policy</Link>. All information is treated with strict professional confidentiality.</p>
			</form>
	);
}
