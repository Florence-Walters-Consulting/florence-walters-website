import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { getAllBlogSlugs, getBlogBySlug } from '@/db/queries/blog';
import { formatDate } from '@/lib/format';
import { imageUrl } from '@/lib/images';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	const rows = await getAllBlogSlugs();
	return rows.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const data = await getBlogBySlug(decodeURIComponent((await params).slug));
	return data ? { title: data.blog.heading, description: data.blog.preamble } : {};
}

export default async function BlogSingle({ params }: Props) {
	const data = await getBlogBySlug(decodeURIComponent((await params).slug));
	if (!data) notFound();

	const { blog, previous, next, related } = data;
	const wordCount = blog.body?.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length ?? 0;
	const readingTime = Math.max(1, Math.ceil(wordCount / 220));

	return (
		<div className="page-enter">
			<PageHeader title="Perspectives and Insights" heading={blog.heading} text={blog.preamble} />

			<article className="insight-article">
				<div className="insight-article-shell">
					<div className="insight-article-meta">
						<Link href="/blog" className="insight-article-category">
							{blog.category_name}
						</Link>
						<span>{formatDate(blog.date)}</span>
						<i aria-hidden="true" />
						<span>{readingTime} min read</span>
						<i aria-hidden="true" />
						<span>Florence Walters</span>
					</div>
					<figure className="insight-article-hero">
						<img src={imageUrl('blog', blog.picture)} alt={blog.heading} />
					</figure>
					<div className="insight-article-layout">
						<aside className="insight-article-aside">
							<span>Insight</span>
							<p>{blog.category_name}</p>
						</aside>
						{/* Article body is admin-authored HTML (rich-text editor), as in the legacy site. */}
						<div className="insight-article-body" dangerouslySetInnerHTML={{ __html: blog.body }} />
					</div>
					<div className="insight-article-footer">
						<span>Filed under</span>
						<Link href="/blog">{blog.category_name}</Link>
					</div>

					{(previous || next) && (
						<nav className="insight-directions" aria-label="More articles">
							{previous ? (
								<Link href={`/blog/${previous.slug}`}>
									<small>← Previous insight</small>
									<strong>{previous.heading}</strong>
								</Link>
							) : (
								<span />
							)}
							{next ? (
								<Link href={`/blog/${next.slug}`} className="next">
									<small>Next insight →</small>
									<strong>{next.heading}</strong>
								</Link>
							) : (
								<span />
							)}
						</nav>
					)}
				</div>
			</article>

			{related.length > 0 && (
				<section className="insight-related">
					<div className="insight-related-head">
						<div>
							<span className="eyebrow">Continue reading</span>
							<h2>Related Insights</h2>
						</div>
						<Link href="/blog">
							View all insights <span>→</span>
						</Link>
					</div>
					<div className="insights-grid">
						{related.map((post) => (
							<article className="insights-card" key={post.id}>
								<Link href={`/blog/${post.slug}`} className="insights-card-image">
									<img src={imageUrl('blog', post.picture)} alt={post.heading} loading="lazy" />
								</Link>
								<div className="insights-card-copy">
									<p className="insights-category">{blog.category_name}</p>
									<h2>
										<Link href={`/blog/${post.slug}`}>{post.heading}</Link>
									</h2>
									<p className="insights-summary">{post.preamble}</p>
									<Link href={`/blog/${post.slug}`} className="insights-read">
										Read Article <span>→</span>
									</Link>
									<small>{formatDate(post.date)}</small>
								</div>
							</article>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
