import type { LucideIcon } from 'lucide-react';
import type { MotionName } from '@/components/ui/MotionIcon';
import { BadgeCheck, CalendarCheck, ChartNoAxesCombined, FileCheck2, FileSignature, Heart, Lock, Megaphone, ShieldCheck, Stamp } from 'lucide-react';

/**
 * The five service pages, from the FWC Website Content Pack. Every page uses the same six blocks:
 * 1 hero, 2 is this for you, 3 what's included, 4 what you receive, 5 what we need from you, 6 next step with three FAQs.
 * Documents are generic mock-ups: never an invented client name.
 */
export type ServicePage = {
	slug: string;
	name: string;
	headline: string;
	/** The closing phrase of the headline that shimmers. Must be the end of `headline`. */
	accent: string;
	line: string;
	/** Busola's animated graphics: the icon video, how the hero is built, and the page's signature tool. */
	motion: MotionName;
	heroKind: 'video';
	tool: 'structure' | 'licences' | 'health' | 'goals' | 'brand';
	/** The service-specific action (a short form, a check, a goal picker). */
	action: { label: string; href: string };
	/** 3D art in the hero: two document titles and two small floating tiles. */
	art: { icon: LucideIcon; badge: LucideIcon; docs: [string, string]; tiles: [LucideIcon, LucideIcon] };
	/** Situations in the client's words; tapping one shows the reply and the best next step. */
	situations: { t: string; reply: string }[];
	included: { t: string; d: string }[];
	receive: string[];
	need: string[];
	faqs: { q: string; a: string }[];
	/** Standard process, used by work highlights that have no steps of their own. */
	process: { t: string; d: string }[];
	/** Extra notes shown with a block. */
	banner?: string;
	legalNote?: string;
	honest?: string;
	notIncluded?: string;
	addOn?: string;
};

const a = (slug: string, query = '') => `/business-assessment?service=${slug}${query}`;

export const goals = [
	{ key: 'raise', label: 'Raise investment', value: 'Raising investment or funding', gets: ['Investor deck', 'Financial model', 'Data room', 'Cap table'] },
	{ key: 'enter', label: 'Enter Nigeria', value: 'Entering a new market or region', gets: ['Market entry strategy', 'Registration roadmap'] },
	{ key: 'operations', label: 'Fix operations', value: 'Improving internal operations', gets: ['Operational review', 'Process improvement plan'] },
	{ key: 'tender', label: 'Win a tender', value: 'Preparing for a bid or tender', gets: ['Bid document', 'Compliance checklist'] },
	{ key: 'grant', label: 'Win a grant', value: 'Applying for a grant (NGOs)', gets: ['Grant proposal', 'Budget and work plan'] },
	{ key: 'plan', label: 'Write a business plan', value: 'Writing a formal business plan', gets: ['Business plan', 'Financial projections'] },
] as const;

export const healthCheckItems = [
	{ t: 'Written employment contracts', d: 'Every staff member has signed one.' },
	{ t: "Shareholders' or founders' agreement", d: 'Who owns what, who decides, and how exits work.' },
	{ t: 'Signed customer and supplier contracts', d: 'Not just WhatsApp messages or emails.' },
	{ t: 'NDPA privacy policy and data map', d: 'You know what personal data you hold and why.' },
	{ t: 'Registered trademark', d: 'Your name and logo are legally yours.' },
	{ t: 'Board charter and governance policies', d: 'The basics an investor will ask for.' },
	{ t: 'AML/CFT policy', d: 'If you handle money or customer funds.' },
];

export const servicePages: Record<string, ServicePage> = {
	'business-formation-corporate-services': {
		slug: 'business-formation-corporate-services',
		name: 'Business Setup & Corporate Services',
		headline: 'The right structure, registered properly, ready for the bank.',
		accent: 'ready for the bank.',
		motion: 'setup',
		heroKind: 'video',
		tool: 'structure',
		line: 'We help you choose your structure, register it with the CAC and hand you a complete, bank-ready document pack.',
		action: { label: 'Start your registration', href: a('business-formation-corporate-services') },
		art: { icon: Stamp, badge: FileCheck2, docs: ['Certificate of incorporation', 'Memorandum & Articles'], tiles: [BadgeCheck, ShieldCheck] },
		situations: [
			{ t: "You're starting out or trading informally", reply: 'Start with a Business Name or a company. We help you choose, register it and hand you a bank-ready pack.' },
			{ t: 'Your Business Name needs to become a company', reply: 'We register the company and guide the move from your Business Name, including your TIN and bank details.' },
			{ t: "You're forming an NGO or foundation", reply: 'That is an Incorporated Trustees registration with the CAC. We prepare the constitution and file it.' },
			{ t: "You're a foreign company setting up in Nigeria", reply: 'We handle foreign company registration, and tell you what else you need before you can trade.' },
		],
		included: [
			{ t: 'Company registration', d: 'We help you choose the right structure, then register it: Business Name, Ltd, Ltd/Gte, Incorporated Trustees (NGO), LP/LLP or a foreign company.' },
			{ t: 'Post-incorporation changes', d: 'Directors, shares, registered address and name changes, filed with the CAC.' },
			{ t: 'TIN set-up with the NRS', d: 'Your Tax Identification Number, set up with the Nigeria Revenue Service.' },
			{ t: 'Company secretarial support', d: 'Registers, resolutions and filings kept in order, so you are always ready for the bank or an investor.' },
		],
		receive: ['Certificate of incorporation or registration', 'Memorandum & Articles or constitution', 'CAC status report', 'TIN', 'Share certificates and registers', 'Bank account resolution and certified copies', 'Official receipts', 'Next-steps note on licences and first filings'],
		need: ['Two or three name options', 'Names, addresses and phone numbers of directors and shareholders', 'A valid ID and passport photograph for each', 'What the business does', 'How shares will be split'],
		addOn: 'Optional add-on: ongoing tax filing (see Regulatory Licences & Compliance).',
		faqs: [
			{ q: 'How do I choose between a Business Name and a company?', a: 'A Business Name is simple and quick. A company (Ltd) limits your personal risk and looks stronger to banks and investors. We help you choose in the free call.' },
			{ q: 'Can a foreign company register in Nigeria?', a: 'Yes. We handle foreign company registration and the follow-up filings, and tell you what else you will need before you can trade.' },
			{ q: 'What do I get at the end?', a: 'A complete, bank-ready document pack: your certificate, constitution documents, status report, TIN and receipts.' },
		],
		process: [
			{ t: 'Choose your structure', d: 'We confirm the right structure and check the name.' },
			{ t: 'Register', d: 'We file with the CAC and follow up until it is approved.' },
			{ t: 'Your document pack', d: 'You receive the certificate and the full bank-ready pack.' },
		],
	},
	'regulatory-licensing-compliance': {
		slug: 'regulatory-licensing-compliance',
		name: 'Regulatory Licences & Compliance',
		headline: 'Stay licensed. Stay compliant. Keep growing.',
		accent: 'Keep growing.',
		motion: 'compliance',
		heroKind: 'video',
		tool: 'licences',
		line: 'We work out which licences and filings your business needs, file them, deal with the regulator and track every renewal.',
		action: { label: 'Check which licences you need', href: a('regulatory-licensing-compliance') },
		art: { icon: ShieldCheck, badge: CalendarCheck, docs: ['Licence certificate', 'Compliance calendar'], tiles: [BadgeCheck, Stamp] },
		situations: [
			{ t: "You don't know which licences you need", reply: 'Try the licence finder just below: pick your sector and see what usually applies.' },
			{ t: "You know but haven't started", reply: 'Tell us which ones. We file them, follow up with the regulator and track every renewal.' },
			{ t: "You're licensed but not sure you're fully compliant", reply: 'We check what you hold against what your sector expects, then close the gaps.' },
			{ t: "You're behind on annual returns or tax", reply: 'We file what is outstanding and bring you back into good standing.' },
		],
		included: [
			{ t: 'CAC annual returns', d: 'Every company files every year. We file what is due and any years that were missed.' },
			{ t: 'Tax registration and monthly returns', d: 'Tax registration, then your monthly VAT, PAYE and WHT returns, filed on time.' },
			{ t: 'Sector licences', d: 'CBN, NAFDAC, NCDMB NOGIC JQS, NUPRC, NCC, NERC and more: we find the ones your sector needs and file them.' },
			{ t: 'SCUML and BPP registration', d: 'Anti-money-laundering registration with SCUML and contractor registration with the BPP.' },
			{ t: 'PenCom, NSITF and ITF certificates', d: 'The staff-related certificates employers are expected to hold.' },
			{ t: 'NDPA data-protection filing', d: 'Registration and filing under the Nigeria Data Protection Act where it applies to you.' },
			{ t: 'Monthly compliance retainer', d: 'We keep every filing and renewal on track, month after month.' },
		],
		receive: ['Your licence or certificate', 'Filing receipts and acknowledgements', 'A compliance calendar with every due date', 'Status updates at each stage', 'Renewal reminders'],
		need: ['Your CAC documents and TIN', 'What the business does and where it operates', 'Any licences you already hold', 'Your last filings, if any', 'A contact person for the regulator'],
		banner: 'Licences expiring in December or January? Renew early and avoid penalties.',
		faqs: [
			{ q: 'How do I know which licences I need?', a: 'Tell us your sector and what you do. We list every licence and filing that applies, and which to do first.' },
			{ q: 'Can you fix overdue filings?', a: "Yes. We file what's outstanding and bring you back into good standing." },
			{ q: 'Do you keep track of renewals?', a: 'Yes. You get a compliance calendar with every due date and reminders before each one.' },
		],
		process: [
			{ t: 'Find what you need', d: 'We work out which licences and filings apply to your business.' },
			{ t: 'File and follow up', d: 'We file, deal with the regulator and chase until it is issued.' },
			{ t: 'Stay on track', d: 'You get your licence, receipts and a calendar of every renewal.' },
		],
	},
	'contracts-ip-governance': {
		slug: 'contracts-ip-governance',
		name: 'Contracts, IP & Governance',
		headline: 'Protect what you’ve built, in writing.',
		accent: 'in writing.',
		motion: 'contracts',
		heroKind: 'video',
		tool: 'health',
		line: 'Contracts that hold up, a brand that’s legally yours, and the policies investors and regulators expect.',
		action: { label: 'Run the 30-second health-check', href: '#health-check' },
		art: { icon: FileSignature, badge: Lock, docs: ['Service agreement', 'Privacy policy'], tiles: [BadgeCheck, ShieldCheck] },
		situations: [
			{ t: 'You work on WhatsApp agreements', reply: 'We turn them into proper written agreements that say what you actually agreed.' },
			{ t: 'Your staff have no written contracts', reply: 'We draft employment contracts and a short staff handbook.' },
			{ t: 'An investor or partner is doing due diligence', reply: 'We check your agreements and policies and close the gaps first. Try the health-check below.' },
			{ t: 'You hold customer data or handle money', reply: 'You need an NDPA privacy policy and data map, and an AML/CFT policy if you handle money.' },
		],
		included: [
			{ t: 'Contract drafting and review', d: 'Agreements written or checked so they say what you mean and protect you.' },
			{ t: 'Employment contracts and staff handbook', d: 'Clear terms for every role, and the house rules in one place.' },
			{ t: "Shareholders' and partnership agreements", d: 'Who owns what, who decides, and what happens if someone leaves.' },
			{ t: 'Trademark search and registration', d: 'We check your name and logo are free to use, then file to protect them.' },
			{ t: 'NDPA privacy policy and data map', d: 'A privacy policy that meets the Nigeria Data Protection Act and a map of the data you hold.' },
			{ t: 'AML/CFT policy', d: 'The anti-money-laundering policy regulators expect from businesses that handle money.' },
			{ t: 'Board charter and governance pack', d: 'The governance documents an investor will ask to see.' },
		],
		receive: ['Signed agreements and editable templates', 'A marked-up review with a plain-English summary', 'Trademark filing and certificate', 'Privacy and governance policies'],
		need: ['What you want protected', 'Any existing agreements or drafts', 'Names and details of the parties', 'A description of the data you collect', 'Your logo and business name'],
		legalNote: 'Legal advice is provided through our partner lawyers. Court cases are outside our scope.',
		faqs: [
			{ q: 'Can you review a contract I have been sent?', a: 'Yes. You get a marked-up copy and a plain-English summary of the risks and what to push back on.' },
			{ q: 'Do I really need a trademark?', a: 'If your name or logo matters to your business, yes. Registration is what makes it legally yours.' },
			{ q: 'Is this legal advice?', a: 'Legal advice is provided through our partner lawyers. Court cases are outside our scope.' },
		],
		process: [
			{ t: 'Understand the need', d: 'We learn what you need to protect and what already exists.' },
			{ t: 'Draft or review', d: 'We prepare or mark up the documents in plain English.' },
			{ t: 'Sign and file', d: 'You receive the signed documents, filings and certificates.' },
		],
	},
	'business-advisory-growth': {
		slug: 'business-advisory-growth',
		name: 'Business Advisory & Growth',
		headline: 'Plans investors read. Growth you can defend.',
		accent: 'Growth you can defend.',
		motion: 'growth',
		heroKind: 'video',
		tool: 'goals',
		line: 'We do the research, build the numbers and write the documents, so you walk into the meeting ready.',
		action: { label: 'Pick your goal', href: '#goals' },
		art: { icon: ChartNoAxesCombined, badge: BadgeCheck, docs: ['Business plan', 'Investor pack'], tiles: [FileCheck2, Stamp] },
		situations: [
			{ t: 'Investors keep asking for things you don’t have', reply: 'We build the deck, model, data room and cap table, so you are ready before the meeting.' },
			{ t: 'You want to enter Nigeria properly', reply: 'We prepare a market entry strategy and the registrations you will need.' },
			{ t: "You're busy but things don't feel under control", reply: 'An operational review finds what slows you down, then we fix it.' },
			{ t: 'A tender or grant deadline is coming', reply: 'We prepare the bid or proposal and check it before you submit.' },
		],
		included: [
			{ t: 'Business plans and financial projections', d: 'A plan and numbers that explain your business clearly and stand up to questions.' },
			{ t: 'Investor readiness', d: 'Your deck, model, data room and cap table, ready before the first meeting.' },
			{ t: 'Feasibility studies', d: 'Research that tells you whether an idea is worth pursuing, and how.' },
			{ t: 'Market entry strategy', d: 'A practical route into Nigeria for foreign businesses.' },
			{ t: 'Tender and bid preparation', d: 'Bid documents prepared, checked and submitted on time.' },
			{ t: 'Grant and donor proposals', d: 'Proposals for NGOs that funders can say yes to.' },
			{ t: 'Operational review and process improvement', d: 'We find what slows you down and fix it.' },
			{ t: 'Restructuring and change management', d: 'Help to reorganise the business and bring people with you.' },
		],
		receive: ['Finished, editable documents: plan, model, deck, proposal or report', 'A PDF set', 'A handover walkthrough'],
		need: ['What you want to achieve and by when', 'Any existing plan, financials or deck', 'Access to the person who knows the numbers', 'Details of the tender, grant or investor if there is one'],
		honest: "We prepare you for investors and funders. We don't promise a raise or a win.",
		faqs: [
			{ q: 'Will you guarantee we raise money or win the tender?', a: "No. We prepare you properly for investors and funders, but we don't promise a raise or a win." },
			{ q: 'Do you write the documents or just advise?', a: 'We write them. You receive finished, editable documents and a walkthrough.' },
			{ q: 'I am not sure what I need. Where do I start?', a: 'Pick the goal closest to yours below, or take the free assessment and we will help you decide.' },
		],
		process: [
			{ t: 'Agree the goal', d: 'We confirm what you want to achieve and what you already have.' },
			{ t: 'Research and build', d: 'We do the research, build the numbers and write the documents.' },
			{ t: 'Handover', d: 'You receive the finished documents and a walkthrough.' },
		],
	},
	marketing: {
		slug: 'marketing',
		name: 'Marketing & Brand',
		headline: 'Look as good as your work really is.',
		accent: 'really is.',
		motion: 'marketing',
		heroKind: 'video',
		tool: 'brand',
		line: 'We build your brand and run your social media, from the first logo to the monthly report.',
		action: { label: 'Get a brand check', href: a('marketing') },
		art: { icon: Megaphone, badge: Heart, docs: ['Brand guidelines', 'Content calendar'], tiles: [BadgeCheck, FileCheck2] },
		situations: [
			{ t: "You're new and not online yet", reply: 'We build your brand and set up your first month of content.' },
			{ t: 'You post when you remember', reply: 'We plan and publish for you, on a monthly calendar you approve.' },
			{ t: 'People like your posts but nobody enquires', reply: 'We rework what you post and how people reach you.' },
			{ t: 'Your business has outgrown its look', reply: 'A refreshed identity and guidelines, applied across your channels.' },
		],
		included: [
			{ t: 'Brand identity', d: 'A logo, colours and guidelines so your business looks like one business everywhere.' },
			{ t: 'Social media management', d: 'We plan, write and publish your posts, so you show up consistently.' },
			{ t: 'Website structure and content', d: 'What goes on each page and how it reads, so visitors know what to do next.' },
			{ t: 'Launch and campaign content', d: 'Content for a launch or a push, ready to post.' },
		],
		receive: ['Brand guidelines', 'A monthly content calendar for your approval', 'Ready-to-post content, published for you', 'A plain-English monthly report'],
		need: ['Account access (you keep ownership)', 'Your logo and colours', 'One person to approve the calendar', 'Photos of your team or work'],
		notIncluded: 'Not included: ad spend, photo or video shoots and influencer fees, all quoted separately.',
		faqs: [
			{ q: 'Do I keep ownership of my accounts?', a: 'Yes. You always own your accounts. We only need access to post for you.' },
			{ q: 'Do you handle paid ads?', a: 'Ad spend is not included and is quoted separately.' },
			{ q: 'How will I know it is working?', a: 'You get a plain-English report every month showing what was posted and what happened.' },
		],
		process: [
			{ t: 'Brand check', d: 'We look at where your brand and social media stand today.' },
			{ t: 'Plan', d: 'We agree the look and a monthly content calendar for your approval.' },
			{ t: 'Publish and report', d: 'We publish for you and send a plain-English monthly report.' },
		],
	},
};
