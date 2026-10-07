import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { usePartners } from '../hooks/usePartners';

import 'swiper/css';

function Partners() {
	const { data, isLoading, error } = usePartners();
	const partners = data?.data ?? [];

	return (
		<section className="trusted regulators">
			<div className="regulators-heading">
				<span className="eyebrow eyebrow-with-line">REGULATORS WE WORK WITH</span>
				<h2>Regulators We Work With</h2>
				<p>We register, file, and liaise with these bodies on your behalf</p>
			</div>
			{error && <span className="partners-error">Unable to load regulators.</span>}
			{isLoading && <div className="partners-loading" aria-label="Loading regulators" />}
			{partners.length > 0 && (
				<Swiper
					className="partners-slider"
					modules={[Autoplay]}
					slidesPerView={2}
					spaceBetween={45}
					loop={partners.length > 5}
					speed={5000}
					allowTouchMove
					autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
					breakpoints={{ 576: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1200: { slidesPerView: 5 } }}>
					{partners.map((partner) => (
						<SwiperSlide key={partner.id}>
							<img src={`/site_img/partners/${partner.picture}`} alt="Regulator logo" loading="lazy" />
						</SwiperSlide>
					))}
				</Swiper>
			)}
		</section>
	);
}

export default Partners;
