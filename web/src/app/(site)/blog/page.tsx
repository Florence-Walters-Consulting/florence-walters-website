import type { Metadata } from 'next';
import { Suspense } from 'react';
import PageHeader from '@/components/PageHeader';
import Cta from '@/components/Cta';
import BlogListing, { type BlogSearchParams } from '@/components/blog/BlogListing';

export const metadata: Metadata = { title: 'Insights' };

export default function Blog({ searchParams }: { searchParams: BlogSearchParams }) {
	return (
		<div className="page-enter">
			<PageHeader
				title="Perspectives and Insights"
				heading="Business and Regulation in Africa Explained Simply"
				text="Practical guides, plain-language breakdowns, and expert commentary on business formation, regulatory compliance and strategic growth"
			/>

			<section className="insights-page">
				<Suspense fallback={<div className="insights-status">Loading insights...</div>}>
					<BlogListing searchParams={searchParams} />
				</Suspense>
			</section>
			<Cta
				displayProof={false}
				heading="Stay Informed"
				text={
					<>
						Subscribe to the FWC briefing, regulatory updates and <br /> business highlights delivered to your
						inbox monthly.
					</>
				}
			/>
		</div>
	);
}
