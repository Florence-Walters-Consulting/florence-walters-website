import Link from 'next/link';
import { services } from '@/data/services';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
	return (
		<>
			<footer className="fwc-footer">
				<div className="footer-brand">
					<img src="/img/logo-white.png" alt="Florence Walters Consulting" />
					<NewsletterForm />
					<small>
						By subscribing, you agree to our <Link href="/privacy">Privacy Policy</Link> and provide
						consent to receive updates from our company.
					</small>
				</div>
				<div className="footer-links">
					<h4>Quick Links</h4>
					<Link href="/">Home</Link>
					<Link href="/about">About Us</Link>
					<Link href="/services">Services</Link>
					<Link href="/blog">Blog</Link>
					<Link href="/contact">Contact Us</Link>
				</div>
				<div className="footer-links">
					<h4>Services</h4>
					{services.map((service) => (
						<Link key={service.slug} href={`/services/${service.slug}`}>
							{service.heading}
						</Link>
					))}
				</div>
				<div className="footer-links">
					<h4>Legal</h4>
					<Link href="/privacy">Privacy Policy</Link>
					<Link href="/terms">Terms of Service</Link>
					<Link href="/cookies">Cookie Settings</Link>
				</div>
				<div className="footer-bottom">
					<p>© 2026 Florence Walters Consulting Limited. All rights reserved.</p>
					<div className="footer-socials">
						<a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
							in
						</a>
						<a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">
							𝕏
						</a>
						<a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
							f
						</a>
					</div>
				</div>
			</footer>
			<a href="https://wa.me/2349047422694" target="_blank" className="whatsapp-float">
				<img src="/img/wa.png" alt="Whatsapp Icon" title="Chat with us!" />
			</a>
		</>
	);
}
