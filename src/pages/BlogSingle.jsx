import PageHeader from '@/layouts/PageHeader';
import { useImages } from '@/context/useImages';
import { useBlog } from '@/hooks/useBlog';
import { formatDate } from '@/services/helper';
import { Link, useParams } from 'react-router-dom';

function BlogSingle() {
	const images = useImages();
	const { slug } = useParams();
	const { data, isLoading, error } = useBlog(slug);
	const payload = data?.data;
	const blog = payload?.blog;
	const previous = payload?.previous;
	const next = payload?.next;
	const related = payload?.related ?? [];

	if (isLoading || error) {
		return <div className="page-enter"><PageHeader title="Perspectives and Insights" heading={error ? 'Article unavailable' : 'Loading article...'} text={error?.message ?? 'Please wait while we prepare this insight.'} image={images['Blog Header']} /></div>;
	}

	if (!blog) return null;
	const wordCount = blog.body?.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length ?? 0;
	const readingTime = Math.max(1, Math.ceil(wordCount / 220));

	return (
		<div className="page-enter">
			<PageHeader title="Perspectives and Insights" heading={blog.heading} text={blog.preamble} image={images['Blog Header']} />

			<article className="insight-article">
				<div className="insight-article-shell">
					<div className="insight-article-meta">
						<Link to="/blog" className="insight-article-category">{blog.category_name}</Link>
						<span>{formatDate(blog.date)}</span><i aria-hidden="true" />
						<span>{readingTime} min read</span><i aria-hidden="true" />
						<span>Florence Walters</span>
					</div>
					<figure className="insight-article-hero"><img src={`/site_img/blog/${blog.picture}`} alt={blog.heading} /></figure>
					<div className="insight-article-layout">
						<aside className="insight-article-aside"><span>Insight</span><p>{blog.category_name}</p></aside>
						<div className="insight-article-body" dangerouslySetInnerHTML={{ __html: blog.body }} />
					</div>
					<div className="insight-article-footer">
						<span>Filed under</span><Link to="/blog">{blog.category_name}</Link>
					</div>

					{(previous || next) && <nav className="insight-directions" aria-label="More articles">
						{previous ? <Link to={`/blog/${previous.slug}`}><small>← Previous insight</small><strong>{previous.heading}</strong></Link> : <span />}
						{next ? <Link to={`/blog/${next.slug}`} className="next"><small>Next insight →</small><strong>{next.heading}</strong></Link> : <span />}
					</nav>}
				</div>
			</article>

			{related.length > 0 && <section className="insight-related">
				<div className="insight-related-head"><div><span className="eyebrow">Continue reading</span><h2>Related Insights</h2></div><Link to="/blog">View all insights <span>→</span></Link></div>
				<div className="insights-grid">
					{related.map((post) => <article className="insights-card" key={post.id}>
						<Link to={`/blog/${post.slug}`} className="insights-card-image"><img src={`/site_img/blog/${post.picture}`} alt={post.heading} loading="lazy" /></Link>
						<div className="insights-card-copy"><p className="insights-category">{blog.category_name}</p><h2><Link to={`/blog/${post.slug}`}>{post.heading}</Link></h2><p className="insights-summary">{post.preamble}</p><Link to={`/blog/${post.slug}`} className="insights-read">Read Article <span>→</span></Link><small>{formatDate(post.date)}</small></div>
					</article>)}
				</div>
			</section>}
		</div>
	);
}

export default BlogSingle;
