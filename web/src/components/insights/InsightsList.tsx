import { getBlogCategories, getBlogList } from '@/db/queries/blog';
import { PostCard } from './PostCard';
import { InsightsPagination } from './InsightsPagination';
import { InsightsToolbar } from './InsightsToolbar';

export type BlogSearchParams = Promise<{ page?: string; search?: string; category?: string }>;

/** Toolbar plus results. The first post of the unfiltered first page is shown as the wide featured card. */
export async function InsightsList({ searchParams }: { searchParams: BlogSearchParams }) {
	const params = await searchParams;
	const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
	const search = (params.search ?? '').trim();
	const category = Math.max(0, parseInt(params.category ?? '0', 10) || 0);

	const [{ posts, pagination }, categories] = await Promise.all([getBlogList(page, search, category), getBlogCategories()]);
	const featuredFirst = page === 1 && !search && !category && posts.length > 1;
	const [first, ...rest] = posts;

	return (
		<>
			<InsightsToolbar categories={categories} search={search} category={category} />
			{posts.length === 0 && <p className="mt-16 rounded-card border border-line bg-white p-10 text-center text-ink-soft">No insights match your search. Try a different word or topic.</p>}
			{featuredFirst && <div className="mt-12"><PostCard post={first} featured /></div>}
			<div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
				{(featuredFirst ? rest : posts).map((p) => <PostCard key={p.id} post={p} />)}
			</div>
			<InsightsPagination page={pagination.page} totalPages={pagination.totalPages} search={search} category={category} />
		</>
	);
}
