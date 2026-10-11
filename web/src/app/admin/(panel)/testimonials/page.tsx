import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import ImageField from '@/components/admin/ImageField';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Badge, DataTable, EmptyState, Thumb } from '@/components/admin/bits';
import { SelectField, TextField, YES_NO } from '@/components/admin/fields';
import { listTestimonials } from '@/db/admin/simple';
import { imageUrl } from '@/lib/images';
import { deleteTestimonialAction, saveTestimonial } from './actions';

export const metadata: Metadata = { title: 'Testimonials' };

type Item = Awaited<ReturnType<typeof listTestimonials>>[number];

function TestimonialFields({ item }: { item?: Item }) {
	return (
		<>
			{item && <input type="hidden" name="id" value={item.id} />}
			<TextField name="name" label="Name" required maxLength={100} defaultValue={item?.name} />
			<TextField name="occupation" label="Occupation" required maxLength={100} defaultValue={item?.occupation} />
			<RichTextEditor name="body" label="Comment" required defaultValue={item?.body} />
			<SelectField name="display" label="Show on the website?" required options={YES_NO} defaultValue={item?.display ?? 'Yes'} />
			<ImageField label="Image (optional)" currentUrl={item?.picture ? imageUrl('testimonials', item.picture) : undefined} />
		</>
	);
}

export default async function TestimonialsAdminPage() {
	const items = await listTestimonials();

	return (
		<>
			<PageTitle
				title="Testimonials"
				description="Client quotes. Pictures of the first few also appear in the “Ready to get started” section."
				actions={
					<ResourceDialog title="Add testimonial" triggerLabel="Add testimonial" variant="primary" action={saveTestimonial} wide>
						<TestimonialFields />
					</ResourceDialog>
				}
			/>
			{items.length === 0 ? (
				<EmptyState title="No testimonials yet">Use “Add testimonial” to add the first one.</EmptyState>
			) : (
				<DataTable head={['Client', 'Occupation', 'Shown', 'Actions']}>
					{items.map((item) => (
						<tr key={item.id}>
							<td className="px-4 py-3">
								<div className="flex items-center gap-3">
									{item.picture ? <Thumb src={imageUrl('testimonials', item.picture)} alt="" className="h-12 w-12" /> : <span className="h-12 w-12 shrink-0 rounded-md bg-slate-100" aria-hidden="true" />}
									<span className="font-medium text-slate-900">{item.name}</span>
								</div>
							</td>
							<td className="px-4 py-3 text-slate-600">{item.occupation}</td>
							<td className="px-4 py-3">{item.display === 'Yes' ? <Badge tone="green">Yes</Badge> : <Badge>Hidden</Badge>}</td>
							<td className="px-4 py-3">
								<div className="flex gap-2">
									<ResourceDialog title="Edit testimonial" triggerLabel="Edit" action={saveTestimonial} wide>
										<TestimonialFields item={item} />
									</ResourceDialog>
									<DeleteButton action={deleteTestimonialAction.bind(null, item.id)} confirmText={`The testimonial from ${item.name} will be permanently deleted.`} />
								</div>
							</td>
						</tr>
					))}
				</DataTable>
			)}
		</>
	);
}
