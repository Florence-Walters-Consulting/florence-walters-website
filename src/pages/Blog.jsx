import PageHeader from '@/layouts/PageHeader';
import { useImages } from '@/context/useImages';
import { useBlogs } from '@/hooks/useBlogs';
import { formatDate } from '@/services/helper';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cta from '@/components/Cta';

function Blog() {
	const images = useImages();
	const [page, setPage] = useState(1);
	const [searchInput, setSearchInput] = useState('');
	const [search, setSearch] = useState('');
	const [activeCategory, setActiveCategory] = useState('');
	const { data, isLoading, error, isFetching } = useBlogs(
		page,
		search,
		activeCategory,
	);
	const payload = data?.data;
	const blogs = payload?.data ?? [];
	const categories = payload?.categories ?? [];
	const pagination = payload?.pagination;

	useEffect(() => {
		const timeout = setTimeout(() => {
			setSearch(searchInput.trim());
			setPage(1);
		}, 350);
		return () => clearTimeout(timeout);
	}, [searchInput]);

	const selectCategory = (category) => {
		setActiveCategory(category ? String(category) : '');
		setPage(1);
	};

	return (
		<div className="page-enter">
			<PageHeader
				title="Perspectives and Insights"
				heading="Business and Regulation in Africa Explained Simply"
				text="Practical guides, plain-language breakdowns, and expert commentary on business formation, regulatory compliance and strategic growth"
				image={images['Blog Header']}
			/>

			<section className="insights-page">
				<div className="insights-toolbar">
					<div
						className="insights-topics"
						aria-label="Filter articles by topic">
						<button
							className={!activeCategory ? 'active' : ''}
							onClick={() => selectCategory('')}>
							All Topics
						</button>
						{categories
							.filter((item) => Number(item.count) > 0)
							.map((item) => (
								<button
									key={item.id}
									className={String(item.id) === activeCategory ? 'active' : ''}
									onClick={() => selectCategory(item.id)}>
									{item.category_name}
								</button>
							))}
					</div>
					<label className="insights-search">
						<span className="icon icon-MagnifyingGlass" aria-hidden="true" />
						<input
							type="search"
							value={searchInput}
							onChange={(event) => setSearchInput(event.target.value)}
							placeholder="Search insights"
							aria-label="Search insights"
						/>
					</label>
				</div>

				{isLoading && (
					<div className="insights-status">Loading insights...</div>
				)}
				{error && (
					<div className="insights-status error">
						Unable to load insights: {error.message}
					</div>
				)}
				{!isLoading && !error && blogs.length === 0 && (
					<div className="insights-status">No insights match your search.</div>
				)}

				<div
					className={`insights-grid${isFetching && !isLoading ? ' is-fetching' : ''}`}>
					{blogs.map((blog) => (
						<article className="insights-card" key={blog.id}>
							<Link to={`/blog/${blog.slug}`} className="insights-card-image">
								<img
									src={`/site_img/blog/${blog.picture}`}
									alt={blog.heading}
									loading="lazy"
								/>
							</Link>
							<div className="insights-card-copy">
								<p className="insights-category">{blog.category_name}</p>
								<h2>
									<Link to={`/blog/${blog.slug}`}>{blog.heading}</Link>
								</h2>
								<p className="insights-summary">{blog.preamble}</p>
								<Link to={`/blog/${blog.slug}`} className="insights-read">
									Read Article <span aria-hidden="true">→</span>
								</Link>
								<small>{formatDate(blog.date)}</small>
							</div>
						</article>
					))}
				</div>

				{pagination?.totalPages > 1 && (
					<nav className="insights-pagination" aria-label="Blog pagination">
						<button
							onClick={() => setPage((current) => Math.max(1, current - 1))}
							disabled={page === 1}
							aria-label="Previous page">
							←
						</button>
						{Array.from(
							{ length: pagination.totalPages },
							(_, index) => index + 1,
						).map((number) => (
							<button
								key={number}
								className={number === pagination.page ? 'active' : ''}
								onClick={() => setPage(number)}
								aria-current={number === pagination.page ? 'page' : undefined}>
								{number}
							</button>
						))}
						<button
							onClick={() =>
								setPage((current) =>
									Math.min(pagination.totalPages, current + 1),
								)
							}
							disabled={page === pagination.totalPages}
							aria-label="Next page">
							→
						</button>
					</nav>
				)}
			</section>
			<Cta
				displayProof={false}
				heading="Stay Informed"
				text={
					<>
						Subscribe to the FWC briefing, regulatory updates and <br />{' '}
						business highlights delivered to your inbox monthly.
					</>
				}
			/>
		</div>
	);
}

export default Blog;
