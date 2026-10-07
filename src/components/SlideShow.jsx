import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { useSlides } from '../hooks/useSlides';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const Arrow = () => <span aria-hidden="true">→</span>;

function HeroContent({ slide }) {
	return (
		<section
			className="fwc-hero"
			style={{
				backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.12)), url("/site_img/home_background/${slide.picture}")`,
			}}>
			<div className="fwc-hero-content">
				<span className="fwc-pill">• Business Formation</span>
				<h1 dangerouslySetInnerHTML={{ __html: slide.heading ?? '' }} />
				<p dangerouslySetInnerHTML={{ __html: slide.paragraph ?? '' }} />
				<div className="fwc-actions">
					<Link className="fwc-btn light" to="/business-assessment">
						Take the Business Assessment →
					</Link>
					<Link className="fwc-btn ghost" to="/paid-consultation">
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

export default function SlideShow() {
	const { data, isLoading, error } = useSlides();
	const slides = data?.data ?? [];
	if (isLoading) return <div className="fwc-hero fwc-hero-loading" />;
	if (error) {
		console.error(error);
		return null;
	}
	if (!slides.length) return null;
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
