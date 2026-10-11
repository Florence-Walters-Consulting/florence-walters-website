import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import ImageField from '@/components/admin/ImageField';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import { EmptyState, Thumb } from '@/components/admin/bits';
import { ui } from '@/components/admin/ui';
import { listPartners } from '@/db/admin/simple';
import { imageUrl } from '@/lib/images';
import { deletePartnerAction, savePartner } from './actions';

export const metadata: Metadata = { title: 'Regulators / partners' };

export default async function PartnersAdminPage() {
	const partners = await listPartners();

	return (
		<>
			<PageTitle
				title="Regulators / partners"
				description="Logos in the “Regulators We Work With” strip on the home page. They appear in random order."
				actions={
					<ResourceDialog title="Add logo" triggerLabel="Add logo" variant="primary" action={savePartner}>
						<ImageField label="Logo" required />
					</ResourceDialog>
				}
			/>
			{partners.length === 0 ? (
				<EmptyState title="No logos yet">Use “Add logo” to add the first one.</EmptyState>
			) : (
				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{partners.map((partner) => (
						<li key={partner.id} className={`${ui.card} flex flex-col gap-3 p-4`}>
							<Thumb src={imageUrl('partners', partner.picture)} alt="Regulator logo" className="h-24 w-full object-contain" />
							<div className="flex gap-2">
								<ResourceDialog title="Replace logo" triggerLabel="Replace" action={savePartner}>
									<input type="hidden" name="id" value={partner.id} />
									<ImageField label="New logo" required currentUrl={imageUrl('partners', partner.picture)} />
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
