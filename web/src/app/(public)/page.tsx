import type { Metadata } from 'next';
import { AssessmentCta } from '@/components/home/AssessmentCta';
import { Hero } from '@/components/home/Hero';
import { HomeTestimonials } from '@/components/home/HomeTestimonials';
import { HowWeWork } from '@/components/home/HowWeWork';
import { InsightsEvents } from '@/components/home/InsightsEvents';
import { Regulators } from '@/components/home/Regulators';
import { WhatWeDo } from '@/components/home/WhatWeDo';
import { WhyFwc } from '@/components/home/WhyFwc';
import { heroLine } from '@/data/home';

export const metadata: Metadata = {
	title: { absolute: 'Florence Walters Consulting | Business setup, licences and growth in Nigeria' },
	description: heroLine,
};

// Seven sections: hero, regulators, what we do, how we work, why FWC and proof, insights and FAQ, final call to action.
export default function Home() {
	return (
		<>
			<Hero />
			<Regulators />
			<WhatWeDo />
			<HowWeWork />
			<WhyFwc />
			<HomeTestimonials />
			<InsightsEvents />
			<AssessmentCta />
		</>
	);
}
