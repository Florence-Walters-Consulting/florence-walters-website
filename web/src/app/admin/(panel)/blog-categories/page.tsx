import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import { DataTable, EmptyState } from '@/components/admin/bits';
import { TextField } from '@/components/admin/fields';
import { listCategories } from '@/db/admin/blog';
import { deleteCategoryAction, saveCategory } from './actions';

export const metadata: Metadata = { title: 'Blog categories' };

export default async function CategoriesPage() {
	const categories = await listCategories();

	return (
		<>
			<PageTitle
				title="Blog categories"
				description="Topics used to group and filter blog posts."
				actions={
					<ResourceDialog title="Add category" triggerLabel="Add category" variant="primary" action={saveCategory}>
						<TextField name="category_name" label="Category name" required maxLength={100} />
					</ResourceDialog>
				}
			/>
			{categories.length === 0 ? (
				<EmptyState title="No categories yet">Add a category, then you can publish blog posts in it.</EmptyState>
			) : (
				<DataTable head={['Category', 'Posts', 'Actions']}>
					{categories.map((category) => (
						<tr key={category.id}>
							<td className="px-4 py-3 font-medium text-slate-900">{category.name}</td>
							<td className="px-4 py-3 text-slate-600">{category.posts}</td>
							<td className="px-4 py-3">
								<div className="flex gap-2">
									<ResourceDialog title="Edit category" triggerLabel="Edit" action={saveCategory}>
										<input type="hidden" name="id" value={category.id} />
										<TextField name="category_name" label="Category name" required maxLength={100} defaultValue={category.name} />
									</ResourceDialog>
									<DeleteButton action={deleteCategoryAction.bind(null, category.id)} confirmText={`The category “${category.name}” will be deleted.`} />
								</div>
							</td>
						</tr>
					))}
				</DataTable>
			)}
		</>
	);
}
