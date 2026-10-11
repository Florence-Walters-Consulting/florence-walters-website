import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = { title: 'Contact Us' };

const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL;
const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE;

export default function Contact() {
	return (
		<div className="page-enter">
			<PageHeader title="Contact" heading="Book A Consultation or Send An Enquiry" text="Speak with a senior advisor about how we can support your organization’s regulatory and business advisory needs." />

		<section className="contact-consultation">
			<aside className="contact-details">
				<div><h2>Abuja Office</h2><p>Plot 1234, Wuse II<br />Abuja, Federal Capital Territory<br />Nigeria</p></div>
				<div><h2>Lagos Office</h2><p>17a Rasaq Gbadamosi Avenue<br />Surulere, Lagos<br />Nigeria</p></div>
				<div><h2>Email</h2><p><a href={`mailto:${companyEmail}`}>{companyEmail}</a><br /><a href={`mailto:enquiries@florencewaltersconsulting.com`}>enquiries@florencewaltersconsulting.com</a></p></div>
				<div><h2>Telephone</h2><p><a href={`tel:${companyPhone}`}>{companyPhone}</a><br /><a href="tel:+2348010000001">+234 (0) 801 000 0001</a></p></div>
				<div><h2>Office Hours</h2><p>Monday — Friday<br />8:00 AM — 6:00 PM WAT</p></div>
				<p className="contact-details-note">All initial consultations are handled by senior advisors. We typically respond to enquiries within one business day.</p>
			</aside>

			<ContactForm />
		</section>
		</div>
	);
}
