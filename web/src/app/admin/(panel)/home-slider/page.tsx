import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import ImageField from '@/components/admin/ImageField';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import { DataTable, EmptyState, Thumb } from '@/components/admin/bits';
import { TextAreaField, TextField } from '@/components/admin/fields';
import { listSlides } from '@/db/admin/simple';
import { imageUrl } from '@/lib/images';
import { deleteSlideAction, saveSlide } from './actions';

export const metadata: Metadata = { title: 'Home slider' };

type Slide = Awaited<ReturnType<typeof listSlides>>[number];

function SlideFields({ slide }: { slide?: Slide }) {
	return (
		<>
			{slide && <input type="hidden" name="id" value={slide.id} />}
			<TextField
				name="heading"
				label="Heading"
				required
				maxLength={600}
				defaultValue={slide?.heading}
				hint="Simple formatting is allowed, for example <b>Stay Compliant.</b> to highlight words."
			/>
			<TextAreaField name="paragraph" label="Paragraph" required rows={4} defaultValue={slide?.paragraph} />
			<ImageField label="Background image" required={!slide} currentUrl={slide ? imageUrl('home_background', slide.picture) : undefined} hint="A wide landscape photo works best. JPG, PNG or WebP, up to 5 MB." />
		</>
	);
}

export default async function SliderAdminPage() {
	const slides = await listSlides();

	return (
		<>
			<PageTitle
				title="Home slider"
				description="The large banner at the top of the home page. With more than one slide it rotates automatically."
				actions={
					<ResourceDialog title="Add slide" triggerLabel="Add slide" variant="primary" action={saveSlide}>
						<SlideFields />
					</ResourceDialog>
				}
			/>
			{slides.length === 0 ? (
				<EmptyState title="No slides yet">Without a slide the home page has no banner. Use “Add slide”.</EmptyState>
			) : (
				<DataTable head={['Slide', 'Paragraph', 'Actions']}>
					{slides.map((slide) => (
						<tr key={slide.id}>
							<td className="px-4 py-3">
								<div className="flex items-center gap-3">
									<Thumb src={imageUrl('home_background', slide.picture)} alt="" className="h-12 w-20" />
									<span className="font-medium text-slate-900" dangerouslySetInnerHTML={{ __html: slide.heading }} />
								</div>
							</td>
							<td className="max-w-xs truncate px-4 py-3 text-slate-600">{slide.paragraph.replace(/<[^>]*>/g, '')}</td>
							<td className="px-4 py-3">
								<div className="flex gap-2">
									<ResourceDialog title="Edit slide" triggerLabel="Edit" action={saveSlide}>
										<SlideFields slide={slide} />
									</ResourceDialog>
									<DeleteButton action={deleteSlideAction.bind(null, slide.id)} confirmText="This slide will be removed from the home page." />
								</div>
							</td>
						</tr>
					))}
				</DataTable>
			)}
		</>
	);
}
