/** The five services. Names follow the FWC Website Content Pack; the slugs are the public URLs. */
export type Service = { slug: string; heading: string };

export const services: Service[] = [
	{ slug: 'business-formation-corporate-services', heading: 'Business Setup & Corporate Services' },
	{ slug: 'regulatory-licensing-compliance', heading: 'Regulatory Licences & Compliance' },
	{ slug: 'contracts-ip-governance', heading: 'Contracts, IP & Governance' },
	{ slug: 'business-advisory-growth', heading: 'Business Advisory & Growth' },
	{ slug: 'marketing', heading: 'Marketing & Brand' },
];

export function getService(slug: string): Service | undefined {
	return services.find((service) => service.slug === slug);
}
