import PageHeader from '@/layouts/PageHeader';
import { useImages } from '@/context/useImages';
import { Link } from 'react-router-dom';
import Process from '@/components/Process';
import Cta from '@/components/Cta';
import { services } from '@/data/services';

function Services() {
	const images = useImages();

	return (
		<div className="page-enter">
			<PageHeader
				title="OUR SERVICES"
				heading="Six practice areas. One firm."
				text="From the day you register your business to the day you're ready to scale, we handle the regulatory, legal and growth work — so you don't have to manage five different advisors."
				image={images['Services Header']}
			/>
			<section className="services-overview">
				<span className="eyebrow eyebrow-with-line">OUR SERVICES</span>
				<h2>Six Practice Areas. One Firm.</h2>
				<div className="services-overview-grid">
					{services.map((service, index) => (
						<article key={service.slug}>
							<strong>{index + 1}</strong>
							<h3>{service.heading}</h3>
							<p>{service.preamble}</p>
							<div className="service-tags">
								{service.tags.map((tag, tagIndex) => (
									<span className={`tag-${tagIndex + 1}`} key={tag}>{tag}</span>
								))}
							</div>
							{service.ctas ? (
								<div className="service-card-actions">
									{service.ctas.map((cta) => <Link to={cta.to} key={cta.to}>{cta.label} <span aria-hidden="true">→</span></Link>)}
								</div>
							) : (
								<Link to={`/services/${service.slug}`} className="service-link">{service.cta} <span aria-hidden="true">→</span></Link>
							)}
						</article>
					))}
				</div>
			</section>
			<section className="services-clients">
				<span className="eyebrow eyebrow-with-line">WHO WE WORK WITH</span>
				<h2>We work with businesses at every stage</h2>
				<div className="services-client-types">
					{[
						'New business owners',
						'Small and growing businesses',
						'Entrepreneurs looking for structure',
						'Businesses needing compliance support',
						'Start-ups Seeking Regulatory Clarity',
						'Established Businesses',
					].map((type) => <span key={type}>{type}</span>)}
				</div>
			</section>
			<Process />
			<Cta
				displayProof={false}
				heading="Not sure which service you need?"
				text="Take the free Business Assessment and we’ll help clarify the right next step."
			/>
		</div>
	);
}

export default Services;
