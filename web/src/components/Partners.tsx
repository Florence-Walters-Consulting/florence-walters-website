import { Suspense } from 'react';
import { getPartners } from '@/db/queries/content';
import { imageUrl } from '@/lib/images';
import PartnersSlider from './PartnersSlider';

export default async function Partners() {
	const partners = (await getPartners()).map((partner) => ({
		id: partner.id,
		url: imageUrl('partners', partner.picture),
	}));

	return (
		<section className="trusted regulators">
			<div className="regulators-heading">
				<span className="eyebrow eyebrow-with-line">REGULATORS WE WORK WITH</span>
				<h2>Regulators We Work With</h2>
				<p>We register, file, and liaise with these bodies on your behalf</p>
			</div>
			{partners.length > 0 && (
				// Swiper reads the current time while rendering, so it is streamed instead of prerendered.
				<Suspense fallback={<div className="partners-loading" aria-label="Loading regulators" />}>
					<PartnersSlider partners={partners} />
				</Suspense>
			)}
		</section>
	);
}
