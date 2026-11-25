import { BadgeCheck, CalendarCheck, ChartNoAxesCombined, ClipboardList, FileCheck2, FileSignature, FileText, Handshake, Heart, Lock, Megaphone, PhoneCall, ShieldCheck, Stamp, Tag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Home page content, from the FWC Website Content Pack. Service slugs match data/services.ts.

const FORMATION = '/services/business-formation-corporate-services';
const LICENSING = '/services/regulatory-licensing-compliance';
const ADVISORY = '/services/business-advisory-growth';

/** The fixed line above all three hero slides. It is the page's main title (h1) for search engines. */
export const heroLine = 'Practical business solutions for organisations ready to start, comply and grow in Nigeria.';

export const heroSlides = [
	{
		id: 'structure',
		label: 'Structure',
		headline: 'Build your business on the right foundation.',
		line: 'Setup, licences and compliance done properly from day one, so banks, partners and regulators take you seriously.',
		button: { label: 'Take the free assessment', href: '/business-assessment' },
	},
	{
		id: 'strategy',
		label: 'Strategy',
		headline: 'Wherever your business is, we know the next step.',
		line: '',
		button: { label: 'Find your next step', href: '/business-assessment' },
	},
	{
		id: 'excellence',
		label: 'Excellence',
		headline: "We don't stop at advice. We get it done.",
		line: 'Certificates issued, licences renewed, agreements signed, brands launched.',
		button: { label: 'See our work', href: '/work' },
	},
] as const;

/** The four stage chips on hero slide 2. Each opens the matching service page. */
export const heroStages = [
	{ label: 'Starting out', href: FORMATION },
	{ label: 'Operating', href: LICENSING },
	{ label: 'Raising or expanding', href: ADVISORY },
	{ label: 'Entering Nigeria', href: FORMATION },
];

export const regulatorsHeading = "The regulators we file with, so you don't have to.";

export type HomeService = {
	slug: string;
	name: string;
	short: string;
	icon: LucideIcon;
	badge: LucideIcon;
};

export const homeServices: HomeService[] = [
	{ slug: 'business-formation-corporate-services', name: 'Business Setup & Corporate Services', short: 'Register the right structure and get bank-ready, from name search to certificate.', icon: Stamp, badge: FileCheck2 },
	{ slug: 'regulatory-licensing-compliance', name: 'Regulatory Licences & Compliance', short: 'Every licence, filing and renewal your sector needs, tracked so nothing lapses.', icon: ShieldCheck, badge: CalendarCheck },
	{ slug: 'contracts-ip-governance', name: 'Contracts, IP & Governance', short: "Contracts that hold up, a brand that's legally yours, and policies investors expect.", icon: FileSignature, badge: Lock },
	{ slug: 'business-advisory-growth', name: 'Business Advisory & Growth', short: 'Business plans, investor packs, tenders and grant proposals that get read.', icon: ChartNoAxesCombined, badge: BadgeCheck },
	{ slug: 'marketing', name: 'Marketing & Brand', short: 'Brand identity and social media that make you look as good as your work.', icon: Megaphone, badge: Heart },
];

export type Step = { n: string; keyword: string; open: string; icon: LucideIcon };

/** How we work: five keywords, tap one to read the sentence. The consultation route is shown under them. */
export const steps: Step[] = [
	{ n: '01', keyword: 'Free assessment', open: "A few minutes online. Tell us where your business is and what's in the way.", icon: ClipboardList },
	{ n: '02', keyword: '15-min call', open: 'Free. We listen and ask questions so we understand the problem properly.', icon: PhoneCall },
	{ n: '03', keyword: 'Diagnostic quote', open: 'We confirm the fee for your Diagnostic Report before any work begins.', icon: Tag },
	{ n: '04', keyword: 'Your report', open: 'The problem, the solutions and the exact services, with prices.', icon: FileText },
	{ n: '05', keyword: 'Signed and started', open: 'Everything agreed in writing, then we get to work.', icon: Handshake },
];

/** Four short reasons with a small icon (Why FWC). */
export const reasons: { icon: LucideIcon; title: string }[] = [
	{ icon: BadgeCheck, title: 'One team, five disciplines' },
	{ icon: ShieldCheck, title: 'We deal with the regulators' },
	{ icon: Tag, title: 'Fee agreed before work starts' },
	{ icon: FileCheck2, title: 'Real documents in your hands, not just advice' },
];

/**
 * Proof numbers. Only real figures are shown. By default they come from the data (certificates from the work
 * highlights, regulators from the Regulators list); set a number here to override. Leave `businesses` null until
 * there is a figure the team can stand behind: a missing number is hidden, never rounded up.
 */
export const proofOverrides: { secured: number | null; regulators: number | null; businesses: number | null } = {
	secured: null,
	regulators: null,
	businesses: null,
};

/** Webinar banner. Set `event` when a webinar is scheduled; until then the banner invites people to hear about the next one. */
export const webinar: { event: { title: string; date: string; href: string } | null } = { event: null };

export const homeFaqs = [
	{ q: 'How do I get started?', a: 'Take the free assessment, then book your free 15-minute call.' },
	{ q: 'Do you just advise, or do the work?', a: 'We do the work: we file, follow up and hand you the documents.' },
	{ q: 'Who do you work with?', a: 'Start-ups, SMEs, NGOs and foreign companies entering Nigeria.' },
	{ q: 'Can you fix overdue annual returns or filings?', a: "Yes. We file what's outstanding and bring you back into good standing." },
	{ q: 'How much does it cost?', a: 'Every fee is confirmed in writing before we start. Regulator fees are passed on at cost, with receipts.' },
];
