import type { Metadata } from 'next';
import { AssessmentCta } from '@/components/home/AssessmentCta';
import { Button } from '@/components/ui/Button';
import { BadgeCheck, FileCheck2, ShieldCheck, Stamp } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { Scene3D } from '@/components/ui/Scene3D';
import { WorkGallery } from '@/components/work/WorkGallery';
import { getPublishedWork } from '@/db/queries/work';

export const metadata: Metadata = {
	title: 'Work highlights',
	description: "Certificates and registrations we've secured for our clients. Client names are kept confidential.",
};

export default async function Work() {
	const items = await getPublishedWork();
	return (
		<>
			<PageHero
				eyebrow="Work highlights"
				lines={['Real outcomes,', 'not just advice.']}
				lead="Certificates and registrations we've secured for our clients. Client names are kept confidential."
				art={<Scene3D icon={Stamp} badge={BadgeCheck} docs={['Certificate of incorporation', 'Licence certificate']} tiles={[ShieldCheck, FileCheck2]} />}
				actions={
					<>
						<Button href="#work-grid" size="lg">Browse the work</Button>
						<Button href="/business-assessment" variant="outline" size="lg" arrow={false}>Start your own</Button>
					</>
				}
			/>
			{items.length > 0 ? (
				<WorkGallery workItems={items} />
			) : (
				<p className="section-space text-center text-ink-soft">New work highlights are coming soon.</p>
			)}
			<AssessmentCta title="Want a result like these?" text="Take the free business assessment and we'll show you what to file first." />
		</>
	);
}
