import type { Metadata } from 'next';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import ImageField from '@/components/admin/ImageField';
import { EmptyState, Thumb } from '@/components/admin/bits';
import { ui } from '@/components/admin/ui';
import { listGeneralImages } from '@/db/admin/simple';
import { imageUrl } from '@/lib/images';
import { replaceGeneralImage } from './actions';

export const metadata: Metadata = { title: 'Other images' };

export default async function OtherImagesAdminPage() {
	const images = await listGeneralImages();

	return (
		<>
			<PageTitle title="Other images" description="Photos used in fixed places on the website (the name says where). You can replace a photo but not add or remove places." />
			{images.length === 0 ? (
				<EmptyState title="No image slots found" />
			) : (
				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{images.map((image) => (
						<li key={image.id} className={`${ui.card} flex flex-col gap-3 p-4`}>
							<Thumb src={imageUrl('general', image.size)} alt={image.picture} className="h-40 w-full" />
							<p className="font-medium text-slate-900">{image.picture}</p>
							<div>
								<ResourceDialog title={`Replace “${image.picture}”`} triggerLabel="Replace image" action={replaceGeneralImage}>
									<input type="hidden" name="id" value={image.id} />
									<ImageField label="New image" required currentUrl={imageUrl('general', image.size)} />
								</ResourceDialog>
							</div>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
