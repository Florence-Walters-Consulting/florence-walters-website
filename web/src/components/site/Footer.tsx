import { cacheLife } from 'next/cache';
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from '@/components/ui/SocialIcons';
import { SiteLink } from '@/components/ui/SiteLink';
import { company, mapsUrl, socials } from '@/lib/site';
import { NewsletterForm } from './NewsletterForm';

const explore = [
	['Services', '/services'], ['How we work', '/#how-we-work'], ['Our work', '/work'],
	['Insights & events', '/blog'], ['About', '/about'], ['Contact', '/contact'],
];
const serviceLinks = [
	['Business Setup & Corporate Services', '/services/business-formation-corporate-services'],
	['Regulatory Licences & Compliance', '/services/regulatory-licensing-compliance'],
	['Contracts, IP & Governance', '/services/contracts-ip-governance'],
	['Business Advisory & Growth', '/services/business-advisory-growth'],
	['Marketing & Brand', '/services/marketing'],
];
const legal = [['Privacy Policy', '/privacy'], ['Terms of Use', '/terms'], ['Cookies Policy', '/cookies']];
const socialIcons = { LinkedIn: LinkedInIcon, Instagram: InstagramIcon, Facebook: FacebookIcon, X: XIcon } as const;

// Shown only once real opening hours are set (NEXT_PUBLIC_OFFICE_HOURS, e.g. "Mon-Fri, 9am-5pm").
const hours = process.env.NEXT_PUBLIC_OFFICE_HOURS;

function Column({ title, links }: { title: string; links: string[][] }) {
	return (
		<div>
			<p className="text-xs tracking-[0.18em] text-white/50 uppercase">{title}</p>
			<ul className="mt-5 grid gap-3 text-[0.9375rem]">
				{links.map(([label, href]) => (
					<li key={label}>
						<SiteLink href={href} className="text-white/85 transition-colors hover:text-white">{label}</SiteLink>
					</li>
				))}
			</ul>
		</div>
	);
}

/** The year is computed inside a cache scope: Next 16 does not allow reading the clock during prerender. */
async function currentYear() {
	'use cache';
	cacheLife('days');
	return new Date().getFullYear();
}

export async function Footer() {
	const year = await currentYear();
	return (
		<footer className="bg-ink-deep text-white">
			<div className="page-container grid gap-12 py-14 lg:grid-cols-[1fr_1.1fr] lg:py-16">
				<div>
					<img src="/media/logo-white.webp" alt={company.name} className="h-16 w-auto" />
					<p className="mt-6 max-w-sm text-white/70">Practical business solutions for organisations ready to start, comply and grow in Nigeria.</p>
					<address className="mt-6 grid gap-1.5 text-sm leading-relaxed text-white/65 not-italic">
						<span>{company.address}</span>
						{hours && <span>{hours}</span>}
						<a href={`mailto:${company.email}`} className="text-white/85 hover:text-white">{company.email}</a>
						<a href={company.whatsapp} target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white">WhatsApp: {company.phone}</a>
						<a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-white/85 underline decoration-white/30 underline-offset-4 hover:decoration-white">Get directions ↗</a>
					</address>
				</div>
				<NewsletterForm />
			</div>
			<div className="page-container grid grid-cols-2 gap-10 border-t border-white/10 py-12 md:grid-cols-4">
				<Column title="Explore" links={explore} />
				<Column title="Services" links={serviceLinks} />
				<Column title="Legal" links={legal} />
				<div>
					<p className="text-xs tracking-[0.18em] text-white/50 uppercase">Follow</p>
					<ul className="mt-5 flex flex-wrap gap-2">
						{socials.map(({ label, href }) => {
							const Icon = socialIcons[label];
							return (
								<li key={label}>
									<a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white hover:text-ink">
										<Icon />
									</a>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<div className="page-container flex flex-col gap-2 border-t border-white/10 py-6 text-sm text-white/55 sm:flex-row sm:justify-between">
				<p>© {year} Florence Walters Consulting Limited. All rights reserved.</p>
				<p>Structure. Strategy. Excellence.</p>
			</div>
		</footer>
	);
}
