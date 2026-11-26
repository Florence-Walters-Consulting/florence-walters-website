import { connection } from 'next/server';
import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import ImageField from '@/components/admin/ImageField';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import { Badge, EmptyState } from '@/components/admin/bits';
import { SelectField, TextField } from '@/components/admin/fields';
import { ui } from '@/components/admin/ui';
import { listPartners } from '@/db/admin/simple';
import { imageUrl } from '@/lib/images';
import { deletePartnerAction, savePartner } from './actions';

export const metadata: Metadata = { title: 'Regulators' };

type Partner = Awaited<ReturnType<typeof listPartners>>[number];

const shown = [
	{ value: 'Yes', label: 'Shown on the website' },
	{ value: 'No', label: 'Hidden' },
];

function PartnerFields({ partner }: { partner?: Partner }) {
	return (
		<>
			{partner && <input type="hidden" name="id" value={partner.id} />}
			<TextField name="name" label="Name" required maxLength={100} defaultValue={partner?.name} hint="Read aloud by screen readers, e.g. Corporate Affairs Commission (CAC)." />
			<ImageField label="Logo" required={!partner} currentUrl={partner ? imageUrl('partners', partner.picture) : undefined} hint="A clean logo on a white or transparent background works best." />
			<SelectField name="display" label="Visibility" required defaultValue={partner?.display ?? 'Yes'} options={shown} />
		</>
	);
}

export default async function PartnersAdminPage() {
	// The panel is per-visitor: never rendered at build time, so the queries below wait for the signed-in request.
	await connection();
	const partners = await listPartners();
	const hidden = partners.filter((p) => p.display !== 'Yes').length;

	return (
		<>
			<PageTitle
				title="Regulators"
				description={`Logos in the “Regulators we file with” strip on the home page, in the order shown here.${hidden ? ` ${hidden} are hidden.` : ''}`}
				actions={
					<ResourceDialog title="Add regulator logo" triggerLabel="Add logo" variant="primary" action={savePartner}>
						<PartnerFields />
					</ResourceDialog>
				}
			/>
			{partners.length === 0 ? (
				<EmptyState title="No logos yet">Use “Add logo” to add the first one.</EmptyState>
			) : (
				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{partners.map((partner) => (
						<li key={partner.id} className={`${ui.card} flex flex-col gap-3 p-4 ${partner.display !== 'Yes' ? 'opacity-70' : ''}`}>
							<div className="grid h-24 place-items-center rounded-xl border border-line bg-white p-2">
								<img src={imageUrl('partners', partner.picture)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
							</div>
							<div className="flex items-start justify-between gap-2">
								<p className="min-w-0 flex-1 text-sm font-medium text-slate-800">{partner.name || 'Unnamed'}</p>
								{partner.display !== 'Yes' && <Badge>Hidden</Badge>}
							</div>
							<div className="mt-auto flex gap-2">
								<ResourceDialog title="Edit regulator logo" triggerLabel="Edit" action={savePartner}>
									<PartnerFields partner={partner} />
								</ResourceDialog>
								<DeleteButton action={deletePartnerAction.bind(null, partner.id)} confirmText="This logo will be removed from the website." />
							</div>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
