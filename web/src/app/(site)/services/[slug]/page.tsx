import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { getService, services } from '@/data/services';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
	return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const service = getService((await params).slug);
	return service ? { title: service.heading, description: service.preamble } : {};
}

export default async function ServiceSingle({ params }: Props) {
	const service = getService((await params).slug);
	if (!service) notFound();

	return (
		<div className="page-enter">
			<PageHeader
				title={
					<>
						<Link href="/services">All Services</Link> &gt; {service.heading}
					</>
				}
				heading={service.heading}
				text={service.preamble}
			/>
			<section className="service-copy">
				<div className="service-copy-main">
					<span className="eyebrow eyebrow-with-line">WHAT&apos;S INCLUDED</span>
					<h2>How we can help</h2>
					{service.note && <p className="service-note">{service.note}</p>}
					<ul>
						{service.included.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
				<aside className="service-copy-cta">
					<h3>Ready to take the next step?</h3>
					<p>Tell us what you need and we’ll guide you to the right next step.</p>
					<div className="service-cta-buttons">
						{(service.ctas ?? [{ label: service.cta!, to: service.ctaTo! }]).map((cta) => (
							<Link href={cta.to} key={cta.to}>
								{cta.label} <span aria-hidden="true">→</span>
							</Link>
						))}
					</div>
				</aside>
			</section>
		</div>
	);
}
