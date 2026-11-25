import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { HealthCheck } from '@/components/services/HealthCheck';
import { ForYou, GoalTiles, Included, Need, NextStep, Receive } from '@/components/services/ServiceBlocks';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { Scene3D } from '@/components/ui/Scene3D';
import { servicePages } from '@/data/service-pages';
import { services } from '@/data/services';

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

	return (
		<>
			{/* 1 Hero: headline, one line, two buttons, one 3D image */}
			<PageHero
				eyebrow={page.name}
				lines={[page.headline]}
				lead={page.line}
				actions={
					<>
						<Button href={page.action.href} size="lg">{page.action.label}</Button>
						<Button href={`/business-assessment?service=${slug}&full=1`} variant="outline" size="lg" arrow={false}>Take the free assessment</Button>
					</>
				}
				art={<Scene3D icon={page.art.icon} badge={page.art.badge} docs={page.art.docs} tiles={page.art.tiles} />}
			/>
			{page.banner && (
				<p className="bg-accent-btn px-5 py-3 text-center text-sm font-semibold text-white">{page.banner}</p>
			)}
			{/* 2 Is this for you? */}
			<ForYou items={page.forYou} />
			{page.extra === 'goals' && <GoalTiles slug={slug} />}
			{/* 3 What's included */}
			<Included page={page} />
			{page.extra === 'healthcheck' && <HealthCheck slug={slug} />}
			{/* 4 What you receive */}
			<Receive page={page} />
			{(page.legalNote || page.honest) && (
				<div className="page-container -mt-8 mb-14">
					<p className="flex items-start gap-3 rounded-card-sm bg-mist p-5 text-ink-soft"><Check className="mt-1 size-4 shrink-0 text-accent-deep" /><span>{page.legalNote ?? page.honest}</span></p>
				</div>
			)}
			{/* 5 What we need from you */}
			<Need items={page.need} />
			{/* 6 Next step and FAQs */}
			<NextStep page={page} />
		</>
	);
}
