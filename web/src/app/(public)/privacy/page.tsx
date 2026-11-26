import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';


const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Florence Walters Consulting';
const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@florencewaltersconsulting.com';

export const metadata: Metadata = {
	title: 'Privacy Policy',
	description: 'This policy explains what information we collect, why we use it, and the choices available to you.',
};

const sections: LegalSection[] = [
	{
		id: 'who-we-are',
		title: '1. Who we are',
		body: (
			<><p>{companyName} is a business consultancy operating in Nigeria. For personal information collected through this website, we act as the data controller and determine how and why that information is processed.</p></>
		),
	},
	{
		id: 'information',
		title: '2. Information we collect',
		body: (
			<><p>We collect information that you choose to provide, including:</p><ul><li>Your name, email address, telephone number, company or organisation, service interest, and message when you submit the consultation form.</li><li>The answers you give when you submit our business assessment or paid consultation forms, such as your business details, the challenges you describe, your budget and timeline, and your preferred way to be contacted.</li><li>Your email address when you subscribe to our newsletter.</li><li>Information contained in correspondence you send to us and any later communications relating to your enquiry.</li><li>Notes our team records about your enquiry so that we can respond and keep an accurate record of our conversations.</li></ul><p>Our website and hosting systems may also process limited technical information such as your IP address, browser type, device information, access time, referring page, and security logs. We do not intentionally request sensitive personal information through the website. Please avoid including confidential or sensitive information in an initial enquiry unless it is necessary.</p></>
		),
	},
	{
		id: 'use',
		title: '3. How and why we use your information',
		body: (
			<><p>We may use your information to:</p><ul><li>Respond to enquiries and arrange consultations.</li><li>Assess how our advisory services may support you or your organisation.</li><li>Provide requested services and manage our professional relationship.</li><li>Send newsletters and business updates where you have subscribed or otherwise consented.</li><li>Operate, secure, troubleshoot, and improve this website.</li><li>Maintain appropriate business records and comply with legal or regulatory obligations.</li></ul><p>Depending on the circumstances, our lawful basis may be your consent, steps taken at your request before entering a contract, performance of a contract, compliance with a legal obligation, or our legitimate interests in operating and protecting our business. You may withdraw consent at any time, although this does not affect processing that was lawful before withdrawal.</p></>
		),
	},
	{
		id: 'newsletter-communications',
		title: '4. Newsletter communications',
		body: (
			<><p>When you subscribe, we use your email address to send relevant insights, news, and service updates. You can withdraw your consent at any time by using an unsubscribe option in a message or by contacting us. We will not require you to receive marketing as a condition of making an enquiry.</p></>
		),
	},
	{
		id: 'cookies-and-recaptcha',
		title: '5. Cookies and reCAPTCHA',
		body: (
			<><p>The website may use essential cookies or similar technologies needed for security and reliable operation. Our consultation form uses Google reCAPTCHA to help distinguish genuine submissions from automated abuse. When reCAPTCHA is used, Google may process device and usage information in accordance with its own privacy policy and terms. Please see our Cookie Policy for more information about website technologies and your choices.</p></>
		),
	},
	{
		id: 'sharing',
		title: '6. When we share information',
		body: (
			<><p>We do not sell your personal information. We may disclose it only where reasonably necessary to:</p><ul><li>Authorised employees, senior advisers, and professional consultants who need it to handle your enquiry or provide services.</li><li>Trusted providers supporting website hosting, email delivery, security, data storage, and other business operations.</li><li>Regulators, courts, law-enforcement authorities, or other parties where disclosure is required by law or necessary to establish, exercise, or defend legal rights.</li><li>A successor organisation in connection with a merger, restructuring, or transfer of our business, subject to appropriate confidentiality safeguards.</li></ul><p>Where a provider processes information outside Nigeria, we take reasonable steps to ensure the transfer is protected as required by applicable data-protection law.</p></>
		),
	},
	{
		id: 'retention',
		title: '7. Retention and security',
		body: (
			<><p>We retain personal information only for as long as reasonably necessary for the purpose for which it was collected, to maintain required business records, resolve disputes, and meet legal, accounting, or regulatory obligations. Retention periods vary according to the nature of the information and our relationship with you.</p><p>Submissions made through our website forms are stored in our secure systems, in addition to being e-mailed to our team, and are accessible only to authorised staff. We automatically delete these stored submissions, and any internal notes attached to them, 90 days after you send them. Copies of the notification e-mails we receive are kept in our mailboxes for as long as reasonably necessary for the purposes described in this policy.</p><p>We use reasonable administrative, technical, and organisational safeguards designed to protect information from loss, misuse, unauthorised access, alteration, or disclosure. No internet transmission or storage system can be guaranteed to be completely secure, so please take care when deciding what to send electronically.</p></>
		),
	},
	{
		id: 'rights',
		title: '8. Your privacy rights',
		body: (
			<><p>Subject to the Nigeria Data Protection Act 2023 and any applicable limitations, you may have the right to:</p><ul><li>Be informed about and obtain access to your personal information.</li><li>Request correction of inaccurate or incomplete information.</li><li>Request erasure or restriction of processing in appropriate circumstances.</li><li>Object to certain processing, including direct marketing.</li><li>Withdraw consent and request data portability where applicable.</li><li>Not be subject to certain decisions based solely on automated processing.</li><li>Lodge a complaint with the Nigeria Data Protection Commission.</li></ul><p>We may need to confirm your identity before responding to a rights request. We will respond within the period required by applicable law.</p></>
		),
	},
	{
		id: 'children-s-privacy',
		title: '9. Children’s privacy',
		body: (
			<><p>This website and our professional services are not directed to children. We do not knowingly collect personal information from children through this website. If you believe a child has provided information to us, please contact us so that we can take appropriate action.</p></>
		),
	},
	{
		id: 'changes-to-this-policy',
		title: '10. Changes to this policy',
		body: (
			<><p>We may update this policy to reflect changes to our services, technology, or legal obligations. The latest version will always appear on this page with its effective date. Material changes may also be communicated through an appropriate additional notice.</p></>
		),
	},
	{
		id: 'contact-privacy',
		title: '11. Contact us',
		body: (
			<><p>For privacy questions, requests, or concerns, contact:</p><address><strong>{companyName}</strong><br />17a Rasaq Gbadamosi Avenue<br />Surulere, Lagos, Nigeria<br /><a href={`mailto:${companyEmail}`}>{companyEmail}</a></address><p>You may also raise a concern with the <a href="https://ndpc.gov.ng/" target="_blank" rel="noreferrer">Nigeria Data Protection Commission</a>.</p></>
		),
	},
];

export default function Privacy() {
	return (
		<LegalPage
			current='privacy'
			eyebrow='Privacy Policy'
			lines={['Your information,', 'handled with care.']}
			lead='This policy explains what information we collect, why we use it, and the choices available to you.'
			updated='1 November 2026'
			intro={{ title: `Privacy at ${companyName}`, text: `We respect your privacy and are committed to processing personal information fairly, lawfully, securely, and transparently. This policy applies when you visit this website, contact us, request a consultation, or subscribe to our newsletter.` }}
			sections={sections}
		/>
	);
}
