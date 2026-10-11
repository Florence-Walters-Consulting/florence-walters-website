import { Suspense } from 'react';
import { getSlides } from '@/db/queries/content';
import { imageUrl } from '@/lib/images';
import SlideShowClient from './SlideShowClient';

export default async function SlideShow() {
	const slides = (await getSlides()).map((slide) => ({
		...slide,
		pictureUrl: imageUrl('home_background', slide.picture),
	}));
	if (!slides.length) return null;
	// Swiper reads the current time while rendering, so it is streamed instead of prerendered.
	return (
		<Suspense fallback={<div className="fwc-hero fwc-hero-loading" />}>
			<SlideShowClient slides={slides} />
		</Suspense>
	);
}
