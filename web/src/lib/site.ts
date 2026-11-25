/** Company details shared by the header, footer and contact sections. */
export const company = {
	name: process.env.NEXT_PUBLIC_COMPANY_NAME ?? 'Florence Walters Consulting',
	email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@florencewaltersconsulting.com',
	phone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? '+234 902 473 1905',
	address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? '17a Rasaq Gbadamosi Avenue, Surulere, Lagos',
	// The old 0904 742 2694 line no longer works. Set NEXT_PUBLIC_WHATSAPP_NUMBER (digits, with country code) once the new line is live.
	whatsapp: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2349024731905'}`,
	discoveryCall: process.env.NEXT_PUBLIC_DISCOVERY_CALL_URL ?? '/contact',
} as const;

/** Social profiles shown in the top bar, footer and contact page. Replace the URLs with the real profiles when they exist. */
export const socials = [
	{ label: 'LinkedIn', href: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? 'https://www.linkedin.com/' },
	{ label: 'Instagram', href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/' },
	{ label: 'Facebook', href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://www.facebook.com/' },
	{ label: 'X', href: process.env.NEXT_PUBLIC_X_URL ?? 'https://x.com/' },
] as const;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`;

/**
 * Link to the free business assessment. When the visitor comes from a particular service, pass that
 * service's slug: the form then skips its "which service?" question. Without a slug the form asks.
 */
export function assessmentHref(serviceSlug?: string) {
	return serviceSlug ? `/business-assessment?service=${serviceSlug}` : '/business-assessment';
}

/** Link to the paid consultation form, optionally with the consultation type already chosen. */
export function consultationHref(type?: 'formation' | 'strategy' | 'legal' | 'tax' | 'marketing') {
	return type ? `/paid-consultation?type=${type}` : '/paid-consultation';
}

/** The service slug if the path is a service page (/services/<slug>), else undefined. */
export function serviceSlugFromPath(pathname: string) {
	const m = /^\/services\/([^/]+)\/?$/.exec(pathname);
	return m && m[1] !== 'consultation' ? m[1] : undefined;
}
