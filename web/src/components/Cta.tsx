import Link from 'next/link';
import type { ReactNode } from 'react';
import { getTestimonials } from '@/db/queries/content';
import { imageUrl } from '@/lib/images';
import Arrow from './Arrow';
import HidingImage from './HidingImage';

type Props = { displayProof: boolean; heading: string; text: ReactNode };

export default async function Cta({ displayProof, heading, text }: Props) {
	const testimonialPictures = displayProof
		? (await getTestimonials()).filter((testimonial) => testimonial.picture).slice(0, 4)
		: [];

	return (
		<section className="cta">
			{displayProof && (
				<div className="cta-proof">
					<div className="cta-avatars">
						{testimonialPictures.map((testimonial) => (
							<HidingImage
								key={testimonial.id}
								src={imageUrl('testimonials', testimonial.picture)}
								alt={testimonial.name ? `${testimonial.name}, client` : 'Client'}
								loading="lazy"
							/>
						))}
						<span>100K+</span>
					</div>
					<small>
						Over 3K+ Entrepreneurs, and
						<br />
						business choose us
					</small>
				</div>
			)}
			{!displayProof && <div style={{ height: '70px' }} />}
			<h2>{heading}</h2>
			<p>{text}</p>
			<Link className="fwc-btn light" href="/contact">
				Book Consultation <Arrow />
			</Link>
		</section>
	);
}
