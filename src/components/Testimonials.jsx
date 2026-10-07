import { useTestimonials } from '../hooks/useTestimonials';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Testimonials() {
	const { data, isLoading, error } = useTestimonials();
	const testimonials = data?.data ?? [];
	return <section className="client-success">
		<div className="client-success-head"><span className="eyebrow eyebrow-with-line">CLIENTS’ SUCCESS</span><h2>Trusted by the Visionaries Shaping Africa’s Economy.</h2></div>
		{isLoading && <div className="testimonial-loading" aria-label="Loading testimonials" />}
		{error && <p className="testimonial-error">Unable to load client testimonials.</p>}
		{testimonials.length > 0 && <Swiper className="testimonial-slider" modules={[Navigation, Pagination]} slidesPerView={1.08} spaceBetween={24} grabCursor pagination={{clickable:true,el:'.testimonial-pagination'}} navigation={{prevEl:'.testimonial-prev',nextEl:'.testimonial-next'}} breakpoints={{640:{slidesPerView:2.05,spaceBetween:28},1024:{slidesPerView:3.15,spaceBetween:32}}}>
			{testimonials.map(item=><SwiperSlide key={item.id}><article className="testimonial-card"><div className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div><div className="testimonial-body" dangerouslySetInnerHTML={{__html:item.body}}/><footer><img src={`/site_img/testimonials/${item.picture}`} alt={item.name} loading="lazy"/><div><strong>{item.name}</strong>{item.occupation&&<span>{item.occupation}</span>}</div></footer></article></SwiperSlide>)}
		</Swiper>}
		<div className="testimonial-controls"><div className="testimonial-pagination"/><div className="testimonial-arrows"><button className="testimonial-prev" aria-label="Previous testimonial">←</button><button className="testimonial-next" aria-label="Next testimonial">→</button></div></div>
	</section>;
}
