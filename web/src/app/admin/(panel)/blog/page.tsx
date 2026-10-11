import type { Metadata } from 'next';
import BlogFields from '@/components/admin/BlogFields';
import DeleteButton from '@/components/admin/DeleteButton';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import { Badge, DataTable, EmptyState, Thumb } from '@/components/admin/bits';
import { listCategories, listPosts } from '@/db/admin/blog';
import { formatDate } from '@/lib/format';
import { imageUrl } from '@/lib/images';
import { deletePostAction, savePost } from './actions';

export const metadata: Metadata = { title: 'Blog posts' };

export default async function BlogAdminPage() {
	const [posts, categories] = await Promise.all([listPosts(), listCategories()]);
	const cats = categories.map((c) => ({ id: c.id, name: c.name }));

	return (
		<>
			<PageTitle
				title="Blog posts"
				description="Articles shown on the Insights page. Featured posts also appear on the home page."
				actions={
					cats.length > 0 ? (
						<ResourceDialog title="Add blog post" triggerLabel="Add post" variant="primary" action={savePost} wide>
							<BlogFields categories={cats} />
						</ResourceDialog>
					) : undefined
				}
			/>
			{cats.length === 0 && <EmptyState title="Add a blog category first">Posts must belong to a category. Use “Blog categories” in the menu.</EmptyState>}
			{cats.length > 0 && posts.length === 0 && <EmptyState title="No blog posts yet">Use “Add post” to publish your first article.</EmptyState>}
			{posts.length > 0 && (
				<DataTable head={['Post', 'Category', 'Date', 'Home page', 'Actions']}>
					{posts.map((post) => (
						<tr key={post.id}>
							<td className="px-4 py-3">
								<div className="flex items-center gap-3">
									<Thumb src={imageUrl('blog', post.picture)} alt="" />
									<span className="font-medium text-slate-900">{post.heading}</span>
								</div>
							</td>
							<td className="px-4 py-3 text-slate-600">{post.categoryName ?? '—'}</td>
							<td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(post.date)}</td>
							<td className="px-4 py-3">{post.featured === 'Yes' ? <Badge tone="green">Featured</Badge> : <Badge>No</Badge>}</td>
							<td className="px-4 py-3">
								<div className="flex gap-2">
									<ResourceDialog title="Edit blog post" triggerLabel="Edit" action={savePost} wide>
										<BlogFields post={post} categories={cats} />
									</ResourceDialog>
									<DeleteButton action={deletePostAction.bind(null, post.id)} confirmText={`“${post.heading}” and its images will be permanently deleted.`} />
								</div>
							</td>
						</tr>
					))}
				</DataTable>
			)}
		</>
	);
}
