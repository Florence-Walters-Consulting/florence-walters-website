import { useBlogsFeatured } from '../hooks/useBlogsFeatured';
import { Link } from 'react-router-dom';
import { formatDate } from '../services/helper';

const Arrow = () => <span aria-hidden="true">→</span>;

export default function BlogsFeatured() {
	const { data, isLoading, error } = useBlogsFeatured();
	const blogs = data?.data ?? [];

	if (!isLoading && !error && blogs.length === 0) return null;

	return (
		<section className="featured-insights">
			<div className="featured-insights-head">
				<div>
					<span className="eyebrow eyebrow-with-line">
						PERSPECTIVES ON BUSINESS &amp; REGULATION
					</span>
					<h2>
						Insights to Keep You
						<br />
						Informed
					</h2>
				</div>
				<Link to="/blog">
					All Insights <Arrow />
				</Link>
			</div>
			{isLoading && (
				<div
					className="featured-insights-loading"
					aria-label="Loading featured insights"
				/>
			)}
			{error && (
				<p className="featured-insights-error">
					Unable to load featured insights.
				</p>
			)}
			<div className="featured-insights-grid">
				{blogs.map((blog) => (
					<article key={blog.id}>
						<Link to={`/blog/${blog.slug}`} className="featured-insight-image">
							<img
								src={`/site_img/blog/${blog.picture}`}
								alt={blog.heading}
								loading="lazy"
							/>
						</Link>
						<div className="featured-insight-copy">
					<span className="featured-insight-category">{blog.category_name || blog.category}</span>
							<h3>
								<Link to={`/blog/${blog.slug}`}>{blog.heading}</Link>
							</h3>
							<p>{blog.preamble}</p>
							<Link className="read-article" to={`/blog/${blog.slug}`}>
								Read Article <Arrow />
							</Link>
							<small>
								Florence Walters&nbsp;&nbsp;·&nbsp;&nbsp;{formatDate(blog.date)}
								&nbsp;&nbsp;·&nbsp;&nbsp;
								{Math.max(
									3,
									Math.ceil(
										`${blog.heading} ${blog.preamble}`.split(/\s+/).length / 45,
									),
								)}{' '}
								min read
							</small>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
