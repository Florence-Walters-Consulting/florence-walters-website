import { useRef, useState } from 'react';
import PageHeader from '@/layouts/PageHeader';
import { useImages } from '@/context/useImages';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';

const companyEmail = import.meta.env.VITE_COMPANY_EMAIL;
const companyPhone = import.meta.env.VITE_COMPANY_PHONE;

function Contact() {
	const images = useImages();
	const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
	const [captchaToken, setCaptchaToken] = useState('');
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', company: '', subject: '', message: '', website: '' });
	const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
	const captchaRef = useRef(null);

	const handleChange = ({ target }) => setFormData((current) => ({ ...current, [target.name]: target.value }));

	const handleSubmit = async (event) => {
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
			const response = await fetch('/api/contact/index.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...formData, first_name: firstName, last_name: lastName, captchaToken, formStartedAt }),
			});
			const result = await response.json();
			if (!response.ok || !result.success) throw new Error(result.message || 'Unable to send your enquiry.');
			await Swal.fire({ icon: 'success', title: 'Enquiry Sent', text: result.message, showConfirmButton: true });
			setFormData({ full_name: '', email: '', phone: '', company: '', subject: '', message: '', website: '' });
			setCaptchaToken('');
			setFormStartedAt(Date.now());
			captchaRef.current?.reset();
		} catch (error) {
			setCaptchaToken('');
			captchaRef.current?.reset();
			Swal.fire({ icon: 'error', title: 'Unable to send', text: error.message || 'Please try again.', showConfirmButton: true });
		} finally {
			setLoading(false);
		}
	};

	return <div className="page-enter">
		<PageHeader title="Contact" heading="Book A Consultation or Send An Enquiry" text="Speak with a senior advisor about how we can support your organization’s regulatory and business advisory needs." image={images['Contact Header']} />

		<section className="contact-consultation">
			<aside className="contact-details">
				<div><h2>Abuja Office</h2><p>Plot 1234, Wuse II<br />Abuja, Federal Capital Territory<br />Nigeria</p></div>
				<div><h2>Lagos Office</h2><p>17a Rasaq Gbadamosi Avenue<br />Surulere, Lagos<br />Nigeria</p></div>
				<div><h2>Email</h2><p><a href={`mailto:${companyEmail}`}>{companyEmail}</a><br /><a href={`mailto:enquiries@florencewaltersconsulting.com`}>enquiries@florencewaltersconsulting.com</a></p></div>
				<div><h2>Telephone</h2><p><a href={`tel:${companyPhone}`}>{companyPhone}</a><br /><a href="tel:+2348010000001">+234 (0) 801 000 0001</a></p></div>
				<div><h2>Office Hours</h2><p>Monday — Friday<br />8:00 AM — 6:00 PM WAT</p></div>
				<p className="contact-details-note">All initial consultations are handled by senior advisors. We typically respond to enquiries within one business day.</p>
			</aside>

			<form className="contact-form" onSubmit={handleSubmit}>
				<label className="contact-honeypot" aria-hidden="true">Website<input name="website" value={formData.website} onChange={handleChange} tabIndex="-1" autoComplete="off" /></label>
				<div className="contact-form-grid">
					<label>Full Name<span>*</span><input name="full_name" maxLength="200" value={formData.full_name} onChange={handleChange} placeholder="Enter Your Full Name" autoComplete="name" required /></label>
					<label>Email Address<span>*</span><input type="email" name="email" maxLength="254" value={formData.email} onChange={handleChange} placeholder="your@email.com" autoComplete="email" required /></label>
					<label>Phone Number<span>*</span><input type="tel" name="phone" maxLength="50" value={formData.phone} onChange={handleChange} placeholder="+234 000 000 000" autoComplete="tel" required /></label>
					<label>Company/Organization<input name="company" maxLength="150" value={formData.company} onChange={handleChange} placeholder="Your Company Name" autoComplete="organization" /></label>
				</div>
				<label>Service Interest<span>*</span><select name="subject" value={formData.subject} onChange={handleChange} required><option value="" disabled>Select a service area</option><option>Business Formation</option><option>Regulatory Compliance</option><option>Business Advisory</option><option>Market Entry Strategy</option><option>Fintech Advisory</option><option>Other Enquiry</option></select></label>
				<label>Message<span>*</span><textarea name="message" maxLength="5000" value={formData.message} onChange={handleChange} placeholder="Briefly describe your advisory needs or the matter you would like to discuss" required /></label>
				<div className="contact-captcha"><ReCAPTCHA ref={captchaRef} sitekey={siteKey} onChange={(token) => setCaptchaToken(token || '')} onExpired={() => setCaptchaToken('')} /></div>
				<button type="submit" disabled={loading}>{loading ? 'Sending your enquiry...' : 'Book a Consultation'}</button>
				<p className="contact-privacy">By submitting this form, you agree to our <a href="/privacy">Privacy Policy</a>. All information is treated with strict professional confidentiality.</p>
			</form>
		</section>
	</div>;
}

export default Contact;
