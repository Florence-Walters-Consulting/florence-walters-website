'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

type Partner = { id: number; url: string };

function shuffled<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export default function PartnersSlider({ partners }: { partners: Partner[] }) {
	// The legacy API returned a random order on every request. The list is cached on the
	// server, so the shuffle happens in the browser, after hydration.
	const [items, setItems] = useState(partners);
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setItems(shuffled(partners));
	}, [partners]);

	return (
		<Swiper
			key={items.map((item) => item.id).join('-')}
			className="partners-slider"
			modules={[Autoplay]}
			slidesPerView={2}
			spaceBetween={45}
			loop={items.length > 5}
			speed={5000}
			allowTouchMove
			autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
			breakpoints={{ 576: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1200: { slidesPerView: 5 } }}>
			{items.map((partner) => (
				<SwiperSlide key={partner.id}>
					<img src={partner.url} alt="Regulator logo" loading="lazy" />
				</SwiperSlide>
			))}
		</Swiper>
	);
}
