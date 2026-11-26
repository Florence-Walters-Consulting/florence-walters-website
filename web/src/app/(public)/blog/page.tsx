import type { Metadata } from 'next';
import { Suspense } from 'react';
import { InsightsList, type BlogSearchParams } from '@/components/insights/InsightsList';
import { NewsletterBand } from '@/components/insights/NewsletterBand';
import { UpcomingEvents } from '@/components/events/UpcomingEvents';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { getUpcomingEvents } from '@/db/queries/events';
import { BookOpen, FileText, Mic, Sparkles } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { Scene3D } from '@/components/ui/Scene3D';

export const metadata: Metadata = {
	title: 'Insights',
	description: 'Practical guides, plain-language breakdowns, and expert commentary on business formation, regulatory compliance and strategic growth.',
};

async function EventsStrip() {
	const events = await getUpcomingEvents();
	if (events.length === 0) return null;
	return (
		<section className="section-space pb-0">
			<Container>
				<SectionHead label="Events" title="Upcoming events" className="mb-8" />
				<UpcomingEvents events={events} />
			</Container>
		</section>
	);
}

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
			<Suspense fallback={null}>
				<EventsStrip />
			</Suspense>
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
