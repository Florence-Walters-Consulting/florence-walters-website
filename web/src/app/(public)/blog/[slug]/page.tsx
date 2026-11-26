import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleView } from '@/components/insights/ArticleView';
import { getAllBlogSlugs, getBlogBySlug } from '@/db/queries/blog';
import { imageUrl } from '@/lib/images';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	const rows = await getAllBlogSlugs();
	return rows.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const data = await getBlogBySlug(decodeURIComponent((await params).slug));
	if (!data) return {};
	const { blog } = data;
	const image = imageUrl('blog', blog.picture);
	return {
		title: blog.heading,
		description: blog.preamble,
		openGraph: { type: 'article', title: blog.heading, description: blog.preamble, images: [image], publishedTime: blog.date },
		twitter: { card: 'summary_large_image', title: blog.heading, description: blog.preamble, images: [image] },
	};
}

export default async function BlogSingle({ params }: Props) {
	const data = await getBlogBySlug(decodeURIComponent((await params).slug));
	if (!data) notFound();
	return <ArticleView data={data} />;
}
