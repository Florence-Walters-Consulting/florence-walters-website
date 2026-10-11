import Link from 'next/link';
import { getBlogCategories, getBlogList } from '@/db/queries/blog';
import { formatDate } from '@/lib/format';
import { imageUrl } from '@/lib/images';
import BlogPagination from './BlogPagination';
import BlogToolbar from './BlogToolbar';

export type BlogSearchParams = Promise<{ page?: string; search?: string; category?: string }>;

export default async function BlogListing({ searchParams }: { searchParams: BlogSearchParams }) {
	const params = await searchParams;
	const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
	const search = (params.search ?? '').trim();
	const category = Math.max(0, parseInt(params.category ?? '0', 10) || 0);

	const [{ posts, pagination }, categories] = await Promise.all([
		getBlogList(page, search, category),
		getBlogCategories(),
	]);

	return (
		<>
			<BlogToolbar categories={categories} search={search} category={category} />
			{posts.length === 0 && <div className="insights-status">No insights match your search.</div>}
			<div className="insights-grid">
				{posts.map((blog) => (
					<article className="insights-card" key={blog.id}>
						<Link href={`/blog/${blog.slug}`} className="insights-card-image">
							<img src={imageUrl('blog', blog.picture)} alt={blog.heading} loading="lazy" />
						</Link>
						<div className="insights-card-copy">
							<p className="insights-category">{blog.category_name}</p>
							<h2>
								<Link href={`/blog/${blog.slug}`}>{blog.heading}</Link>
							</h2>
							<p className="insights-summary">{blog.preamble}</p>
							<Link href={`/blog/${blog.slug}`} className="insights-read">
								Read Article <span aria-hidden="true">→</span>
							</Link>
							<small>{formatDate(blog.date)}</small>
						</div>
					</article>
				))}
			</div>
			<BlogPagination page={pagination.page} totalPages={pagination.totalPages} search={search} category={category} />
		</>
	);
}
