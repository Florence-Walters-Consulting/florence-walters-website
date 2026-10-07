import { Link } from 'react-router-dom';
import { useTestimonials } from '../hooks/useTestimonials';

const Arrow = () => <span aria-hidden="true">→</span>;

function Cta({ displayProof, heading, text }) {
	const { data } = useTestimonials();
	const testimonialPictures = (data?.data ?? [])
		.filter((testimonial) => testimonial.picture)
		.slice(0, 4);

	return (
		<section className="cta">
			{displayProof && (
				<div className="cta-proof">
					<div className="cta-avatars">
						{testimonialPictures.map((testimonial) => (
							<img
								key={testimonial.id}
								src={`/site_img/testimonials/${testimonial.picture}`}
								alt={testimonial.name ? `${testimonial.name}, client` : 'Client'}
								loading="lazy"
								onError={(event) => {
									event.currentTarget.style.display = 'none';
								}}
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
			<Link className="fwc-btn light" to="/contact">
				Book Consultation <Arrow />
			</Link>
		</section>
	);
}

export default Cta;
