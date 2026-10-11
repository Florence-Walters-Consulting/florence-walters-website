'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

type Slide = { id: number; heading: string; paragraph: string; pictureUrl: string };

function HeroContent({ slide }: { slide: Slide }) {
	return (
		<section
			className="fwc-hero"
			style={{
				backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.12)), url("${slide.pictureUrl}")`,
			}}>
			<div className="fwc-hero-content">
				<span className="fwc-pill">• Business Formation</span>
				{/* Heading and paragraph are admin-authored HTML (e.g. <b>), as in the legacy site. */}
				<h1 dangerouslySetInnerHTML={{ __html: slide.heading ?? '' }} />
				<p dangerouslySetInnerHTML={{ __html: slide.paragraph ?? '' }} />
				<div className="fwc-actions">
					<Link className="fwc-btn light" href="/business-assessment">
						Take the Business Assessment →
					</Link>
					<Link className="fwc-btn ghost" href="/paid-consultation">
						Book a Paid Consultation →
					</Link>
				</div>
			</div>
			<div className="fwc-proof">
				<span>✓ Regulatory Experts</span>
				<span>✓ Pan-African Advisory</span>
				<span>✓ 15+ Regulatory Licenses Secured</span>
			</div>
		</section>
	);
}

export default function SlideShowClient({ slides }: { slides: Slide[] }) {
	return (
		<Swiper
			className="fwc-hero-slider"
			modules={[Autoplay, EffectFade, Pagination]}
			effect="fade"
			loop={slides.length > 1}
			speed={900}
			autoplay={{ delay: 5000, disableOnInteraction: false }}
			pagination={{ clickable: true }}>
			{slides.map((slide) => (
				<SwiperSlide key={slide.id}>
					<HeroContent slide={slide} />
				</SwiperSlide>
			))}
		</Swiper>
	);
}
