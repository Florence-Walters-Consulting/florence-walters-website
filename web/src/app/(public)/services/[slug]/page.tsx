import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { HealthCheck } from '@/components/services/HealthCheck';
import { IncludedTabs } from '@/components/services/IncludedTabs';
import { ReceiveNeed } from '@/components/services/ReceiveNeed';
import { ServiceHero } from '@/components/services/ServiceHero';
import { NextStep } from '@/components/services/ServiceBlocks';
import { BrandCheck, GoalExplorer, LicenceFinder, StructurePicker } from '@/components/services/ServiceTools';
import { Situations } from '@/components/services/Situations';
import { servicePages } from '@/data/service-pages';
import { services } from '@/data/services';
import { getPublishedWork } from '@/db/queries/work';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
	return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const page = servicePages[(await params).slug];
	return page ? { title: page.name, description: page.line } : {};
}

export default async function ServicePage({ params }: Props) {
	const { slug } = await params;
	const page = servicePages[slug];
	if (!page) notFound();

	// Licences: "what you receive" shows the real certificates (everything with an image, regulatory ones first).
	const certs = slug === 'regulatory-licensing-compliance' ? (await getPublishedWork()).filter((w) => w.certificateUrl).sort((a, b) => Number(b.service.slug === slug) - Number(a.service.slug === slug)) : [];
	// "Start" buttons go to this service's short form, even when the hero button points at an on-page tool.
	const startHref = page.action.href.startsWith('#') ? `/business-assessment?service=${slug}` : page.action.href;
	const action = { label: page.action.href.startsWith('#') ? 'Take the free assessment' : page.action.label, href: startHref };

	return (
		<>
			{/* 1 Hero: live art, headline, one line, two buttons */}
			<ServiceHero page={page} />
			{page.banner && <p className="bg-accent-btn px-5 py-3 text-center text-sm font-semibold text-white">{page.banner}</p>}
			{/* 2 Is this for you? Tap the one that sounds like you */}
			<Situations items={page.situations} action={action} />
			{/* The page's signature tool */}
			{page.tool === 'structure' && <StructurePicker action={action} />}
			{page.tool === 'licences' && <LicenceFinder action={action} />}
			{page.tool === 'health' && <HealthCheck slug={slug} />}
			{page.tool === 'goals' && <GoalExplorer slug={slug} />}
			{page.tool === 'brand' && <BrandCheck included={page.included} action={action} />}
			{/* 3 What's included: auto-advancing stage */}
			<IncludedTabs items={page.included} addOn={page.addOn} />
			{(page.legalNote || page.honest) && (
				<div className="page-container mt-8">
					<p className="flex items-start gap-3 rounded-card-sm bg-mist p-5 text-ink-soft"><Check className="mt-1 size-4 shrink-0 text-accent-deep" /><span>{page.legalNote ?? page.honest}</span></p>
				</div>
			)}
			{/* 4 and 5 What you receive, and what we need from you */}
			<ReceiveNeed receive={page.receive} need={page.need} notIncluded={page.notIncluded} startHref={startHref} certs={certs} />
			{/* 6 Next step and FAQs */}
			<NextStep page={page} startHref={startHref} />
		</>
	);
}
