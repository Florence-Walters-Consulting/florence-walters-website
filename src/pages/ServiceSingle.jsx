import PageHeader from '@/layouts/PageHeader';
import { getService } from '@/data/services';
import { Link, NavLink, useParams } from 'react-router-dom';

function ServiceSingle() {
	const { slug } = useParams();
	const service = getService(slug);

	if (!service) return null;

	return (
		<div className="page-enter">
			<PageHeader
				title={<><NavLink to="/services">All Services</NavLink> &gt; {service.heading}</>}
				heading={service.heading}
				text={service.preamble}
			/>
			<section className="service-copy">
				<div className="service-copy-main">
					<span className="eyebrow eyebrow-with-line">WHAT'S INCLUDED</span>
					<h2>How we can help</h2>
					{service.note && <p className="service-note">{service.note}</p>}
					<ul>
						{service.included.map((item) => <li key={item}>{item}</li>)}
					</ul>
				</div>
				<aside className="service-copy-cta">
					<h3>Ready to take the next step?</h3>
					<p>Tell us what you need and we’ll guide you to the right next step.</p>
					<div className="service-cta-buttons">
						{(service.ctas ?? [{ label: service.cta, to: service.ctaTo }]).map((cta) => (
							<Link to={cta.to} key={cta.to}>{cta.label} <span aria-hidden="true">→</span></Link>
						))}
					</div>
				</aside>
			</section>
		</div>
	);
}

export default ServiceSingle;
