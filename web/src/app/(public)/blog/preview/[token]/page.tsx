import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArticleView } from '@/components/insights/ArticleView';
import { getBlogDraftById } from '@/db/queries/blog';
import { verifyPreviewToken } from '@/lib/auth/preview';

export const metadata: Metadata = { title: 'Draft preview', robots: { index: false, follow: false } };

async function Preview({ params }: { params: Promise<{ token: string }> }) {
	const id = await verifyPreviewToken((await params).token);
	const data = id ? await getBlogDraftById(id) : null;
	if (!data) notFound();
	return <ArticleView data={data} preview />;
}

// Never cached or prerendered: reads the post straight from the database on every visit.
export default function BlogPreview({ params }: { params: Promise<{ token: string }> }) {
	return (
		<Suspense fallback={null}>
			<Preview params={params} />
		</Suspense>
	);
}
