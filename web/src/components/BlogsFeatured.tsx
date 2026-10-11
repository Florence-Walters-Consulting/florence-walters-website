import Link from 'next/link';
import { getFeaturedBlogs } from '@/db/queries/blog';
import { formatDate } from '@/lib/format';
import { imageUrl } from '@/lib/images';
import Arrow from './Arrow';

export default async function BlogsFeatured() {
	const blogs = await getFeaturedBlogs();
	if (blogs.length === 0) return null;

	return (
		<section className="featured-insights">
			<div className="featured-insights-head">
				<div>
					<span className="eyebrow eyebrow-with-line">PERSPECTIVES ON BUSINESS &amp; REGULATION</span>
					<h2>
						Insights to Keep You
						<br />
						Informed
					</h2>
				</div>
				<Link href="/blog">
					All Insights <Arrow />
				</Link>
			</div>
			<div className="featured-insights-grid">
				{blogs.map((blog) => (
					<article key={blog.id}>
						<Link href={`/blog/${blog.slug}`} className="featured-insight-image">
							<img src={imageUrl('blog', blog.picture)} alt={blog.heading} loading="lazy" />
						</Link>
						<div className="featured-insight-copy">
							<span className="featured-insight-category">{blog.category_name || blog.category}</span>
							<h3>
								<Link href={`/blog/${blog.slug}`}>{blog.heading}</Link>
							</h3>
							<p>{blog.preamble}</p>
							<Link className="read-article" href={`/blog/${blog.slug}`}>
								Read Article <Arrow />
							</Link>
							<small>
								Florence Walters&nbsp;&nbsp;·&nbsp;&nbsp;{formatDate(blog.date)}
								&nbsp;&nbsp;·&nbsp;&nbsp;
								{Math.max(3, Math.ceil(`${blog.heading} ${blog.preamble}`.split(/\s+/).length / 45))} min read
							</small>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
