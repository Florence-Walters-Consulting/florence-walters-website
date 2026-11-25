import { connection } from 'next/server';
import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import { ListControls, Pager } from '@/components/admin/ListControls';
import ImageField from '@/components/admin/ImageField';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Badge, DataTable, EmptyState, Thumb } from '@/components/admin/bits';
import { SelectField, TextField, YES_NO } from '@/components/admin/fields';
import { listTestimonials } from '@/db/admin/simple';
import { PAGE_SIZE, matches, pageFrom, paginate } from '@/lib/admin/list';
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

export default async function TestimonialsAdminPage({ searchParams }: { searchParams: Promise<{ q?: string; show?: string; page?: string }> }) {
	// The panel is per-visitor: never rendered at build time, so the queries below wait for the signed-in request.
	await connection();
	const sp = await searchParams;
	const q = (sp.q ?? '').trim().slice(0, 100);
	const all = await listTestimonials();
	const { rows: items, total, pages, page } = paginate(all.filter((t) => matches(q, t.name, t.occupation, t.body) && (!sp.show || (sp.show === 'yes') === (t.display === 'Yes'))), pageFrom(sp.page));

	return (
		<>
			<PageTitle
				title="Testimonials"
				description="Client quotes shown in “What our clients say” on the home page. Only those marked to display are shown; hide them all to remove the section."
				actions={
					<ResourceDialog title="Add testimonial" triggerLabel="Add testimonial" variant="primary" action={saveTestimonial} wide>
						<TestimonialFields />
					</ResourceDialog>
				}
			/>
			{all.length > 0 && <ListControls placeholder="Search testimonials" filters={[{ param: 'show', label: 'All', options: [{ value: 'yes', label: 'Shown' }, { value: 'no', label: 'Hidden' }] }]} />}
			{items.length === 0 ? (
				<EmptyState title={all.length ? 'No testimonials match' : 'No testimonials yet'}>{all.length ? 'Try a different search or filter.' : 'Use “Add testimonial” to add the first one.'}</EmptyState>
			) : (
				<><DataTable head={['Client', 'Occupation', 'Shown', 'Actions']}>
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
				<Pager page={page} pages={pages} total={total} size={PAGE_SIZE} /></>
			)}
		</>
	);
}
