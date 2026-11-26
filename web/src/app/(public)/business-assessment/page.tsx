import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AssessmentFlow, type Branch } from '@/components/forms/AssessmentFlow';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { steps } from '@/data/home';
import { goals } from '@/data/service-pages';

export const metadata: Metadata = {
	title: 'Free business assessment',
	description: 'A few focused questions to show where your business stands and what to fix first. Free, confidential, no obligation.',
};

// ?service=<service slug> (from a service page) pre-selects that service so the form does not ask again.
const serviceToBranch: Record<string, Branch> = {
	'business-formation-corporate-services': 'formation',
	'regulatory-licensing-compliance': 'licensing',
	'contracts-ip-governance': 'contracts',
	marketing: 'marketing',
	'business-advisory-growth': 'advisory',
};

type Search = { service?: string; full?: string; goal?: string };

async function Flow({ searchParams }: { searchParams: Promise<Search> }) {
	const { service, full, goal } = await searchParams;
	const branch = service ? serviceToBranch[service] : undefined;
	// Steps 2-5 of "how we work" (after the assessment itself) are what happens next.
	const nextSteps = steps.slice(1).map((s) => ({ t: s.keyword, d: s.open }));
	const initialGoal = branch === 'advisory' ? goals.find((g) => g.key === goal)?.value : undefined;
	return <AssessmentFlow initialBranch={branch} full={full === '1'} initialGoal={initialGoal} nextSteps={nextSteps} />;
}

const chips = ['Free', 'A few minutes', 'No obligation', 'Confidential'];

export default function BusinessAssessment({ searchParams }: { searchParams: Promise<Search> }) {
	return (
		<>
			<PageHero
				slim
				eyebrow="Free business assessment"
				lines={["Let's understand what your", 'business actually needs.']}
				lead="A few short questions, then an instant read-out of where you stand."
				actions={chips.map((c) => <span key={c} className="label-dot rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft">{c}</span>)}
			/>
			<section className="section-space pt-14 lg:pt-20">
				<Container>
					<Suspense fallback={<p className="py-24 text-center text-ink-mute">Loading the assessment…</p>}>
						<Flow searchParams={searchParams} />
					</Suspense>
				</Container>
			</section>
		</>
	);
}
