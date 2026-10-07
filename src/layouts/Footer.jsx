import { Link } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import Swal from 'sweetalert2';
import { useState } from 'react';

export default function Footer() {
	const [email, setEmail] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { data } = useServices();
	const services = data?.data ?? [];

	const handleNewsletterSubmit = async (event) => {
		event.preventDefault();
		const normalizedEmail = email.trim();
		if (!normalizedEmail || isSubmitting) return;

		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append('email', normalizedEmail);
			const response = await fetch('/api/newsletter/subscribe.php', {
				method: 'POST',
				body: formData,
			});
			const result = await response.json().catch(() => ({}));
			if (!response.ok || !result.success)
				throw new Error(
					result.message || 'Subscription failed. Please try again.',
				);
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
				text: error.message || 'Something went wrong. Please try again.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<footer className="fwc-footer">
				<div className="footer-brand">
					<img src="/img/logo-white.png" alt="Florence Walters Consulting" />
					<form onSubmit={handleNewsletterSubmit}>
						<input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							required
							disabled={isSubmitting}
						/>
						<button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Subscribing...' : 'Subscribe'}{' '}
							{!isSubmitting && <span>→</span>}
						</button>
					</form>
					<small>
						By subscribing, you agree to our{' '}
						<Link to="/privacy">Privacy Policy</Link> and provide consent to
						receive updates from our company.
					</small>
				</div>
				<div className="footer-links">
					<h4>Quick Links</h4>
					<Link to="/">Home</Link>
					<Link to="/about">About Us</Link>
					<Link to="/services">Services</Link>
					<Link to="/blog">Blog</Link>
					<Link to="/contact">Contact Us</Link>
				</div>
				<div className="footer-links">
					<h4>Services</h4>
					{services.map((service) => (
						<Link key={service.id} to={`/services/${service.slug}`}>
							{service.heading}
						</Link>
					))}
				</div>
				<div className="footer-links">
					<h4>Legal</h4>
					<Link to="/privacy">Privacy Policy</Link>
					<Link to="/terms">Terms of Service</Link>
					<Link to="/cookies">Cookie Settings</Link>
				</div>
				<div className="footer-bottom">
					<p>
						© 2026 Florence Walters Consulting Limited. All rights reserved.
					</p>
					<div className="footer-socials">
						<a
							href="https://www.linkedin.com/"
							target="_blank"
							rel="noreferrer"
							aria-label="LinkedIn">
							in
						</a>
						<a
							href="https://x.com/"
							target="_blank"
							rel="noreferrer"
							aria-label="X">
							𝕏
						</a>
						<a
							href="https://www.facebook.com/"
							target="_blank"
							rel="noreferrer"
							aria-label="Facebook">
							f
						</a>
					</div>
				</div>
			</footer>
			<a
				href="https://wa.me/2349047422694"
				target="_blank"
				className="whatsapp-float">
				<img src="/img/wa.png" alt="Whatsapp Icon" title="Chat with us!" />
			</a>
		</>
	);
}
