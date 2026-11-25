import { connection } from 'next/server';
import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import ImageField from '@/components/admin/ImageField';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import { WorkRowControls } from '@/components/admin/WorkRowControls';
import { Badge, DataTable, EmptyState } from '@/components/admin/bits';
import { SelectField, TextAreaField, TextField } from '@/components/admin/fields';
import { listWork } from '@/db/admin/work';
import { homeServices } from '@/data/home';
import { logoUrl } from '@/db/queries/work';
import { builtinLogos, formatScope, workCategories } from '@/lib/work';
import { deleteWorkAction, saveWork } from './actions';

export const metadata: Metadata = { title: 'Work highlights' };

type Row = Awaited<ReturnType<typeof listWork>>[number];

const categoryOptions = workCategories.map((c) => ({ value: c, label: c }));
const serviceOptions = homeServices.map((s) => ({ value: s.slug, label: s.name }));
const statusOptions = [
	{ value: 'published', label: 'Published: shown on the website' },
	{ value: 'draft', label: 'Draft: hidden from the website' },
];

function WorkFields({ item }: { item?: Row }) {
	const custom = item?.logo.startsWith('upload:');
	const logoOptions = [{ value: '', label: 'No logo' }, ...(custom ? [{ value: '__custom', label: 'Custom logo (uploaded)' }] : []), ...builtinLogos.map((l) => ({ value: l.key, label: l.label }))];
	return (
		<>
			{item && <input type="hidden" name="id" value={item.id} />}
			<div className="grid gap-4 sm:grid-cols-2">
				<TextField name="code" label="Short name" required maxLength={60} defaultValue={item?.code} hint="Shown large on the certificate, e.g. SCUML." />
				<TextField name="kind" label="Type" required maxLength={60} defaultValue={item?.kind ?? 'Registration'} hint="Registration, Incorporation, Licence, Permit…" />
			</div>
			<TextField name="title" label="Full name of the certificate" required maxLength={255} defaultValue={item?.title} />
			<TextField name="body" label="Issuing body" required maxLength={150} defaultValue={item?.body} hint="e.g. Corporate Affairs Commission." />
			<div className="grid gap-4 sm:grid-cols-2">
				<SelectField name="category" label="Category" required defaultValue={item?.category ?? workCategories[0]} options={categoryOptions} />
				<SelectField name="service" label="Related service" required defaultValue={item?.serviceSlug} options={serviceOptions} placeholder="Choose a service" hint="The “Part of our service” link." />
			</div>
			<TextAreaField name="summary" label="Summary" rows={2} defaultValue={item?.summary} hint="One or two sentences shown on the card. Never include a client's name." />
			<TextAreaField name="scope" label="What we handled (steps)" rows={6} defaultValue={item ? formatScope(item.scope) : ''} hint="One step per line, written as “Title | what happened”. Leave empty to use our standard process for the related service." />
			<TextAreaField name="receive" label="What the client received" rows={5} defaultValue={item?.receive.join('\n')} hint="One item per line." />
			<div className="grid gap-4 sm:grid-cols-2">
				<SelectField name="logo" label="Regulator logo" defaultValue={custom ? '__custom' : (item?.logo ?? '')} options={logoOptions} />
				<ImageField name="logo_image" label="Or upload a logo" currentUrl={custom && item ? logoUrl(item.logo) : undefined} hint="Optional. A transparent PNG or WebP works best. Replaces the logo chosen on the left." />
			</div>
			<SelectField name="status" label="Visibility" required defaultValue={item?.status ?? 'published'} options={statusOptions} />
		</>
	);
}

export default async function WorkAdminPage() {
	// The panel is per-visitor: never rendered at build time, so the queries below wait for the signed-in request.
	await connection();
	const items = await listWork();
	return (
		<>
			<PageTitle
				title="Work highlights"
				description="The results shown on the Work page and the home page. New highlights go to the top; use the arrows to reorder. Never include a client's name."
				actions={
					<ResourceDialog title="Add work highlight" triggerLabel="Add highlight" variant="primary" action={saveWork} wide>
						<WorkFields />
					</ResourceDialog>
				}
			/>
			{items.length === 0 ? (
				<EmptyState title="No work highlights yet">Use “Add highlight” to add the first one.</EmptyState>
			) : (
				<DataTable head={['Result', 'Category', 'Status', 'Order and visibility', 'Actions']}>
					{items.map((item, i) => {
						const logo = logoUrl(item.logo);
						return (
							<tr key={item.id}>
								<td className="px-4 py-3">
									<div className="flex items-center gap-3">
										<span className="grid h-12 w-16 shrink-0 place-items-center rounded-lg border border-line bg-white p-1.5">
											{logo ? <img src={logo} alt="" className="max-h-full max-w-full object-contain" /> : <span className="font-display text-lg text-slate-400">{item.code.slice(0, 3)}</span>}
										</span>
										<span className="min-w-0">
											<span className="block font-medium text-slate-900">{item.code}</span>
											<span className="block max-w-xs truncate text-slate-500">{item.title}</span>
										</span>
									</div>
								</td>
								<td className="px-4 py-3 text-slate-600">{item.category}</td>
								<td className="px-4 py-3"><Badge tone={item.status === 'published' ? 'green' : 'gray'}>{item.status === 'published' ? 'Published' : 'Draft'}</Badge></td>
								<td className="px-4 py-3"><WorkRowControls id={item.id} first={i === 0} last={i === items.length - 1} published={item.status === 'published'} /></td>
								<td className="px-4 py-3">
									<div className="flex gap-2">
										<ResourceDialog title="Edit work highlight" triggerLabel="Edit" action={saveWork} wide>
											<WorkFields item={item} />
										</ResourceDialog>
										<DeleteButton action={deleteWorkAction.bind(null, item.id)} confirmText={`“${item.code}” will be removed from the website.`} />
									</div>
								</td>
							</tr>
						);
					})}
				</DataTable>
			)}
		</>
	);
}
