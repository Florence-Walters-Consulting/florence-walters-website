import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import ImageField from '@/components/admin/ImageField';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import { DataTable, EmptyState, Thumb } from '@/components/admin/bits';
import { TextAreaField, TextField } from '@/components/admin/fields';
import { listServices } from '@/db/admin/services';
import { imageUrl } from '@/lib/images';
import { deleteServiceAction, saveService } from './actions';

export const metadata: Metadata = { title: 'Services' };

type Service = Awaited<ReturnType<typeof listServices>>[number];

function ServiceFields({ service }: { service?: Service }) {
	return (
		<>
			{service && <input type="hidden" name="id" value={service.id} />}
			<TextField name="heading" label="Heading" required maxLength={300} defaultValue={service?.heading} />
			<TextAreaField name="preamble" label="Preamble" required rows={3} defaultValue={service?.preamble} />
			<TextAreaField
				name="body"
				label="Body (HTML)"
				required
				rows={10}
				mono
				defaultValue={service?.body}
				hint="Written as HTML so the existing page layouts (sections, cards, accordions) are kept exactly."
			/>
			<div className="grid gap-4 sm:grid-cols-2">
				<TextField name="tag1" label="Tag 1" maxLength={100} defaultValue={service?.tag1} />
				<TextField name="tag2" label="Tag 2" maxLength={100} defaultValue={service?.tag2} />
				<TextField name="tag3" label="Tag 3" maxLength={100} defaultValue={service?.tag3} />
				<TextField name="tag4" label="Tag 4" maxLength={100} defaultValue={service?.tag4} />
			</div>
			<ImageField required={!service} currentUrl={service ? imageUrl('services', service.picture) : undefined} />
		</>
	);
}

export default async function ServicesAdminPage() {
	const services = await listServices();

	return (
		<>
			<PageTitle
				title="Services"
				description="Note: the website's service pages and footer currently use fixed content (see src/data/services.ts), so changes made here do not appear on the public site."
				actions={
					<ResourceDialog title="Add service" triggerLabel="Add service" variant="primary" action={saveService} wide>
						<ServiceFields />
					</ResourceDialog>
				}
			/>
			{services.length === 0 ? (
				<EmptyState title="No services yet">Use “Add service” to create the first one.</EmptyState>
			) : (
				<DataTable head={['Service', 'Tags', 'Actions']}>
					{services.map((service) => (
						<tr key={service.id}>
							<td className="px-4 py-3">
								<div className="flex items-center gap-3">
									<Thumb src={imageUrl('services', service.picture)} alt="" />
									<div>
										<p className="font-medium text-slate-900">{service.heading}</p>
										<p className="text-xs text-slate-500">/{service.slug}</p>
									</div>
								</div>
							</td>
							<td className="px-4 py-3 text-slate-600">{[service.tag1, service.tag2, service.tag3, service.tag4].filter(Boolean).join(', ') || '—'}</td>
							<td className="px-4 py-3">
								<div className="flex gap-2">
									<ResourceDialog title="Edit service" triggerLabel="Edit" action={saveService} wide>
										<ServiceFields service={service} />
									</ResourceDialog>
									<DeleteButton action={deleteServiceAction.bind(null, service.id)} confirmText={`“${service.heading}” and its images will be permanently deleted.`} />
								</div>
							</td>
						</tr>
					))}
				</DataTable>
			)}
		</>
	);
}
