import type { Metadata } from 'next';
import { Suspense } from 'react';
import { InsightsList, type BlogSearchParams } from '@/components/insights/InsightsList';
import { NewsletterBand } from '@/components/insights/NewsletterBand';
import { Container } from '@/components/ui/Container';
import { BookOpen, FileText, Mic, Sparkles } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { Scene3D } from '@/components/ui/Scene3D';

export const metadata: Metadata = {
	title: 'Insights',
	description: 'Practical guides, plain-language breakdowns, and expert commentary on business formation, regulatory compliance and strategic growth.',
};

export default function Blog({ searchParams }: { searchParams: BlogSearchParams }) {
	return (
		<>
			<PageHero
				slim
				eyebrow="Insights & events"
				lines={['Business and regulation,', 'explained simply.']}
				lead="Practical guides on starting, complying and growing a business in Nigeria."
				art={<Scene3D icon={BookOpen} badge={Sparkles} docs={['Guide', 'Webinar']} tiles={[Mic, FileText]} />}
			/>
			<section className="section-space pt-12">
				<Container>
					<Suspense fallback={<p className="py-24 text-center text-ink-mute">Loading insights…</p>}>
						<InsightsList searchParams={searchParams} />
					</Suspense>
				</Container>
			</section>
			<NewsletterBand />
		</>
	);
}
