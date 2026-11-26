import { connection } from 'next/server';
import type { Metadata } from 'next';
import { ExternalLink, Eye } from 'lucide-react';
import BlogFields from '@/components/admin/BlogFields';
import DeleteButton from '@/components/admin/DeleteButton';
import { ListControls, Pager } from '@/components/admin/ListControls';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import { Badge, DataTable, EmptyState, Thumb } from '@/components/admin/bits';
import { ui } from '@/components/admin/ui';
import { listCategories, listPosts } from '@/db/admin/blog';
import { PAGE_SIZE, pageFrom } from '@/lib/admin/list';
import { signPreviewToken } from '@/lib/auth/preview';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format';
import { imageUrl } from '@/lib/images';
import { deletePostAction, savePost } from './actions';

export const metadata: Metadata = { title: 'Blog posts' };

export default async function BlogAdminPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; category?: string; page?: string }> }) {
	// The panel is per-visitor: never rendered at build time, so the queries below wait for the signed-in request.
	await connection();
	const sp = await searchParams;
	const q = (sp.q ?? '').trim().slice(0, 100);
	const category = parseInt(sp.category ?? '', 10) || 0;
	const status = sp.status === 'draft' || sp.status === 'published' ? sp.status : '';
	const page = pageFrom(sp.page);

	const [{ rows: posts, total }, categories] = await Promise.all([listPosts({ q, status, category }, page, PAGE_SIZE), listCategories()]);
	const cats = categories.map((c) => ({ id: c.id, name: c.name }));
	const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const filtered = Boolean(q || status || category);
	// Drafts get a private preview link (valid for 48 hours).
	const previews = new Map(await Promise.all(posts.filter((p) => p.status === 'draft').map(async (p) => [p.id, await signPreviewToken(p.id)] as const)));

	return (
		<>
			<PageTitle
				title="Blog posts"
				description="Articles shown on the Insights page. Featured posts also appear on the home page. Drafts are hidden from the website until you publish them."
				actions={
					cats.length > 0 ? (
						<ResourceDialog title="Add blog post" triggerLabel="Add post" variant="primary" action={savePost} wide>
							<BlogFields categories={cats} />
						</ResourceDialog>
					) : undefined
				}
			/>
			{cats.length === 0 && <EmptyState title="Add a blog category first">Posts must belong to a category. Use “Blog categories” in the menu.</EmptyState>}
			{cats.length > 0 && (
				<>
					<ListControls
						placeholder="Search posts"
						filters={[
							{ param: 'status', label: 'All statuses', options: [{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Drafts' }] },
							{ param: 'category', label: 'All categories', options: cats.map((c) => ({ value: String(c.id), label: c.name })) },
						]}
					/>
					{posts.length === 0 ? (
						<EmptyState title={filtered ? 'No posts match' : 'No blog posts yet'}>{filtered ? 'Try a different search, or clear the filters.' : 'Use “Add post” to publish your first article.'}</EmptyState>
					) : (
						<>
							<DataTable head={['Post', 'Category', 'Date', 'Status', 'Actions']}>
								{posts.map((post) => (
									<tr key={post.id}>
										<td className="px-4 py-3">
											<div className="flex items-center gap-3">
												<Thumb src={imageUrl('blog', post.picture)} alt="" />
												<span>
													<span className="block font-medium text-slate-900">{post.heading}</span>
													{post.featured === 'Yes' && <span className="mt-0.5 block text-xs text-accent">Featured on the home page</span>}
												</span>
											</div>
										</td>
										<td className="px-4 py-3 text-slate-600">{post.categoryName ?? '—'}</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(post.date)}</td>
										<td className="px-4 py-3">{post.status === 'published' ? <Badge tone="green">Published</Badge> : <Badge>Draft</Badge>}</td>
										<td className="px-4 py-3">
											<div className="flex flex-wrap gap-2">
												{post.status === 'draft' ? (
													<a href={`/blog/preview/${previews.get(post.id)}`} target="_blank" rel="noopener noreferrer" className={cn(ui.btn, ui.btnSecondary)}><Eye className="size-4" /> Preview</a>
												) : (
													<a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className={cn(ui.btn, ui.btnSecondary)}><ExternalLink className="size-4" /> View</a>
												)}
												<ResourceDialog title="Edit blog post" triggerLabel="Edit" action={savePost} wide>
													<BlogFields post={post} categories={cats} />
												</ResourceDialog>
												<DeleteButton action={deletePostAction.bind(null, post.id)} confirmText={`“${post.heading}” and its images will be permanently deleted.`} />
											</div>
										</td>
									</tr>
								))}
							</DataTable>
							<Pager page={Math.min(page, pages)} pages={pages} total={total} size={PAGE_SIZE} />
						</>
					)}
				</>
			)}
		</>
	);
}
