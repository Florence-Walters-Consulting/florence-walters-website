import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ConsultationFlow } from '@/components/forms/ConsultationFlow';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { consultationTypeKeys, type ConsultationType } from '@/lib/forms/consultation-content';

export const metadata: Metadata = {
	title: 'Book a paid consultation',
	description: "Tell us what you want advice on and we'll come back with the fee and available times before anything is booked.",
};

// What happens after the form is sent.
const nextSteps = [
	{ t: 'We confirm the fee', d: 'You get the fee and available times in writing, before anything is booked.' },
	{ t: 'You book and pay', d: 'Payment confirms your session.' },
	{ t: 'The session', d: 'A focused conversation about your one decision.' },
	{ t: 'Your written recommendation', d: 'You leave with a short written recommendation and clear next steps.' },
];

async function Flow({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
	const { type } = await searchParams;
	// ?type=<legal|tax|...> (from the consultation page) pre-selects the type so the form does not ask again.
	const initialType = consultationTypeKeys.includes(type as ConsultationType) ? (type as ConsultationType) : undefined;
	return <ConsultationFlow initialType={initialType} nextSteps={nextSteps} />;
}

const chips = ['About 3 minutes', 'No payment now', 'Fee confirmed in writing first', 'Written recommendation'];

export default function PaidConsultation({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
	return (
		<>
			<PageHero
				slim
				eyebrow="Book a consultation"
				lines={['You know the question.', 'Get a clear answer.']}
				lead="For people who can name the decision they need help with: structure, strategy, legal (through partner lawyers), tax planning or marketing."
				actions={chips.map((c) => <span key={c} className="label-dot rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft">{c}</span>)}
			/>
			<section className="section-space pt-14 lg:pt-20">
				<Container>
					<Suspense fallback={<p className="py-24 text-center text-ink-mute">Loading the form…</p>}>
						<Flow searchParams={searchParams} />
					</Suspense>
				</Container>
			</section>
		</>
	);
}
