import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';
import { SiteLink } from '@/components/ui/SiteLink';

const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Florence Walters Consulting';
const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@florencewaltersconsulting.com';

export const metadata: Metadata = {
	title: 'Cookie Policy',
	description: 'This policy explains the technologies used to operate and protect our website and the choices available to you.',
};

const sections: LegalSection[] = [
	{
		id: 'about-this-policy',
		title: '1. About this policy',
		body: (
			<><p>This Cookie Policy applies to the {companyName} website. References to “we”, “us”, or “our” mean {companyName}. By continuing to use the website with cookies enabled in your browser, you acknowledge the use of the technologies described below.</p><p>Where consent is legally required for a non-essential cookie, we will seek that consent before placing or accessing it. Essential technologies required to provide or secure the website may operate without consent where permitted by law.</p></>
		),
	},
	{
		id: 'what-are-cookies',
		title: '2. What are cookies?',
		body: (
			<><p>Cookies are small text files stored on your computer, phone, or other device when you visit a website. They allow a website or service provider to recognise a browser, remember limited information, maintain functionality, and help protect against misuse.</p><p>Similar technologies include local storage, pixels, tags, scripts, and server logs. In this policy, “cookies” is used as a convenient term covering cookies and comparable browser or device technologies.</p></>
		),
	},
	{
		id: 'cookies-we-use',
		title: '3. Categories of cookies we use',
		body: (
			<><h3>Strictly necessary cookies</h3><p>These support essential website functions, security, network management, and form protection. Disabling them may prevent parts of the website from operating correctly. They are not used to build a marketing profile.</p><h3>Preference and functional technologies</h3><p>These may remember limited choices or interface state so that the website behaves consistently during your visit. The website currently uses only limited functionality of this kind.</p><h3>Security and fraud-prevention technologies</h3><p>Our consultation form uses security controls designed to identify automated or abusive submissions. These controls may process browser, device, interaction, and network information to evaluate whether a submission is genuine.</p><h3>Analytics and advertising cookies</h3><p>We do not currently set our own advertising cookies or use website behaviour to serve targeted advertising. If we introduce analytics, advertising, or other non-essential tracking in the future, this policy and any relevant consent controls will be updated before those technologies are used where consent is required.</p></>
		),
	},
	{
		id: 'third-parties',
		title: '4. Google reCAPTCHA',
		body: (
			<><p>We use Google reCAPTCHA on our consultation form to reduce spam and automated abuse. When you interact with a reCAPTCHA-protected page, Google may set or read cookies and collect information such as your IP address, browser and device details, interaction data, and existing Google cookies.</p><p>Google determines how it processes information through reCAPTCHA under its own <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a>. These third-party technologies are not controlled directly by us.</p></>
		),
	},
	{
		id: 'session-persistent-and-third-party-cookies',
		title: '5. Session, persistent, and third-party cookies',
		body: (
			<><ul><li><strong>Session cookies</strong> normally expire when you close your browser.</li><li><strong>Persistent cookies</strong> remain for a defined period or until you remove them.</li><li><strong>First-party cookies</strong> are placed by the website you are visiting.</li><li><strong>Third-party cookies</strong> are placed or accessed by another provider whose service is used on the page.</li></ul><p>The exact lifespan of a third-party cookie is determined by its provider and may change independently of this website.</p></>
		),
	},
	{
		id: 'cookie-choices',
		title: '6. Managing your cookie choices',
		body: (
			<><p>Most browsers allow you to view, block, limit, or delete cookies. These controls are usually available under Privacy, Security, Site Settings, or Cookies in your browser settings. You may also configure your browser to notify you before a cookie is stored.</p><p>Blocking all cookies may affect website functionality and could prevent security-protected forms from working. Browser settings apply to the browser and device on which you configure them, so you may need to repeat your choices on other devices.</p><p>For instructions, consult the support pages for your browser:</p><ul><li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Google Chrome</a></li><li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noreferrer">Mozilla Firefox</a></li><li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noreferrer">Apple Safari</a></li><li><a href="https://support.microsoft.com/microsoft-edge" target="_blank" rel="noreferrer">Microsoft Edge</a></li></ul></>
		),
	},
	{
		id: 'do-not-track-signals',
		title: '7. Do Not Track signals',
		body: (
			<><p>Some browsers send a “Do Not Track” signal. There is not currently a universally accepted technical standard for responding to every such signal. We do not currently use our own advertising cookies to track visitors across unrelated websites.</p></>
		),
	},
	{
		id: 'personal-information',
		title: '8. Personal information',
		body: (
			<><p>Information collected through cookies or similar technologies may constitute personal information when it identifies or can reasonably be linked to you. Our <SiteLink href="/privacy">Privacy Policy</SiteLink> explains how we process personal information, the grounds on which we do so, how long it may be retained, and the rights available to you.</p></>
		),
	},
	{
		id: 'cookie-changes',
		title: '9. Changes to this policy',
		body: (
			<><p>We may update this policy when website features, service providers, technologies, or legal requirements change. The latest version will be posted on this page with its updated effective date. If a change materially affects your choices, we may provide an additional notice where appropriate.</p></>
		),
	},
	{
		id: 'cookie-contact',
		title: '10. Contact us',
		body: (
			<><p>If you have questions about our use of cookies or other website technologies, contact:</p><address><strong>{companyName}</strong><br />17a Rasaq Gbadamosi Avenue<br />Surulere, Lagos, Nigeria<br /><a href={`mailto:${companyEmail}`}>{companyEmail}</a></address></>
		),
	},
];

export default function Cookies() {
	return (
		<LegalPage
			current='cookies'
			eyebrow='Cookie Policy'
			lines={['How this website', 'uses cookies.']}
			lead='This policy explains the technologies used to operate and protect our website and the choices available to you.'
			updated='11 July 2026'
			intro={{ title: 'Cookie Policy', text: `This policy explains how ${companyName} uses cookies and similar technologies when you visit this website. It should be read together with our Privacy Policy.` }}
			sections={sections}
		/>
	);
}
