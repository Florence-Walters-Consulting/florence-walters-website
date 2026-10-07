import { Link } from 'react-router-dom';
import { useState } from 'react';
import SlideShow from '../components/SlideShow';
import Partners from '../components/Partners';
import { useImages } from '../context/useImages';
import BlogsFeatured from '../components/BlogsFeatured';
import { useFAQS } from '../hooks/useFAQS';
import Cta from '@/components/Cta';
import Process from '@/components/Process';
import { services as newServices } from '@/data/services';

const Arrow = () => <span aria-hidden="true">→</span>;
const ServiceIcon = ({ type }) => {
	const props = {
		viewBox: '0 0 24 24',
		fill: 'none',
		stroke: 'currentColor',
		strokeWidth: 1.7,
		strokeLinecap: 'round',
		strokeLinejoin: 'round',
		'aria-hidden': true,
	};
	if (type === 'briefcase')
		return (
			<svg {...props}>
				<path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
				<rect x="3" y="7" width="18" height="13" rx="2" />
				<path d="M3 12.5c5.8 2 12.2 2 18 0M10 13h4" />
			</svg>
		);
	if (type === 'shield')
		return (
			<svg {...props}>
				<path d="M12 3 20 6v5.5c0 4.7-3.2 8-8 9.5-4.8-1.5-8-4.8-8-9.5V6l8-3Z" />
				<path d="m8.5 12 2.2 2.2 4.8-5" />
			</svg>
		);
	return (
		<svg {...props}>
			<path d="M4 19h16M5 16l5-5 3 3 6-7" />
			<path d="M14 7h5v5" />
		</svg>
	);
};

function Home() {
	const [open, setOpen] = useState(0);
	const images = useImages();
	const { data: faqData, isLoading: faqsLoading, error: faqsError } = useFAQS();
	const faqItems = faqData?.data ?? [];
	return (
		<div className="fwc-home">
			<SlideShow />

			<Partners />
			<section className="fwc-section services">
				<div className="section-head">
					<div>
						<span className="eyebrow eyebrow-with-line">WHAT WE DO</span>
						<h2>Six Practice Areas. One Firm.</h2>
					</div>
					<Link to="/services">
						All Services <Arrow />
					</Link>
				</div>
				<div className="service-grid">
					{newServices.map((service, i) => (
						<article
							className={i === 1 ? 'service-card-dark' : ''}
							key={service.slug}>
							<span className="service-icon">
								<ServiceIcon type={['briefcase', 'shield', 'trend'][i % 3]} />
							</span>
							<small>0{i + 1}</small>
							<h3>{service.heading}</h3>
							<p>{service.preamble}</p>
							{service.ctas ? (
								<div className="service-card-actions">
									{service.ctas.map((cta) => (
										<Link to={cta.to} key={cta.to}>
											{cta.label} <Arrow />
										</Link>
									))}
								</div>
							) : (
								<Link to={`/services/${service.slug}`}>
									{service.cta} <Arrow />
								</Link>
							)}
						</article>
					))}
				</div>
			</section>
			<section className="why">
				<div className="fwc-section">
					<div className="why-copy">
						<span className="eyebrow eyebrow-with-line">WHY CHOOSE US</span>
						<h2>Why Businesses Trust Us</h2>
						<p className="why-intro">
							We've worked with startups, SMEs, and enterprise-level businesses.
							What they all have in common: they needed a trusted partner who
							could speak plainly, act quickly, and deliver results. We don’t
							just advise, we guide you through every step, making things simple
							and clear.
						</p>
					</div>
					<div className="why-grid">
						{[
							[
								'Clear, Practical Guidance',
								'We break down complex processes into simple steps you can actually understand and follow.',
							],
							[
								'Experienced Support',
								'We’ve helped businesses handle setup, compliance, and growth with confidence.',
							],
							[
								'Tailored to Your Business',
								'No one-size-fits-all solutions. Everything we do is built around your specific needs.',
							],
							[
								'End-to-End Support',
								'From starting your business to managing and growing it, we’re with you every step of the way.',
							],
						].map((x, i) => (
							<article key={x[0]}>
								<b>0{i + 1}</b>
								<h3>{x[0]}</h3>
								<p>{x[1]}</p>
							</article>
						))}
					</div>
				</div>
			</section>
			<Process />
			<section className="about-firm">
				<div className="about-copy">
					<span className="eyebrow eyebrow-with-line">ABOUT THE FIRM</span>
					<h2>A Firm Built for African Businesses</h2>
					<p>
						Florence Walters Consulting was built from the ground up to serve
						businesses operating in or entering the African market. We're not a
						Western firm with an African office, we're an African firm with
						global standards. Our team has hands-on experience across industries
						including fintech, trade, manufacturing, healthcare, and education
						giving you the kind of sector-specific insight that generalist
						advisors simply can't offer.
					</p>
					<p>
						We understand how challenging it can be to start and run a business.
						From registration to compliance and growth, the process can feel
						overwhelming. That’s why we’re here, to make everything simple,
						clear, and manageable, so you can focus on building your business
						with confidence.
					</p>
					<Link className="fwc-btn dark" to="/about">
						About the Firm <Arrow />
					</Link>
				</div>
				<div className="about-image">
					<img
						src={images['Home 1']}
						alt="African business professionals working together"
					/>
				</div>
				<div className="stats">
					<div>
						<b>12+</b>
						<span>Years of Practice</span>
					</div>
					<div>
						<b>200+</b>
						<span>Clients Served</span>
					</div>
					<div>
						<b>15+</b>
						<span>African Markets</span>
					</div>
					<div>
						<b>10</b>
						<span>Practice Areas</span>
					</div>
				</div>
			</section>
			<section className="our-clients">
				<span className="eyebrow eyebrow-with-line">OUR CLIENTS</span>
				<h2>Organisations We Serve Across Africa</h2>
				<div className="client-types">
					{[
						'Small & Medium Enterprises',
						'Corporates & Multinationals',
						'Fintech Companies',
						'Financial Institutions',
						'NGOs & Development Organisations',
						'Public Sector Bodies',
						'International Investors',
						'Start-ups Seeking Regulatory Clarity',
					].map((clientType) => (
						<span key={clientType}>{clientType}</span>
					))}
				</div>
			</section>
			<BlogsFeatured />
			{/* Legacy static testimonial reference
			<section className="success">
				<div>
					<span className="eyebrow">CLIENTS’ SUCCESS</span>
					<h2>Trusted by the Visionaries Shaping Africa’s Economy.</h2>
				</div>
				<blockquote>
					“Florence Walters Consulting brought clarity to a process that had
					felt overwhelming. Their team was responsive, practical and completely
					committed to getting us across the finish line.”
					<footer>
						★★★★★
						<br />
						<b>Name Surname</b>
						<small>Position, Company name</small>
					</footer>
				</blockquote>
			</section>
			*/}
			<section className="fwc-section faq">
				<div>
					<span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
					<h2>
						Got Questions?
						<br />
						We’ve Got Answers
					</h2>
					<p>Everything you need to know about working with us.</p>
				</div>
				<div>
					{faqsLoading && <p>Loading questions...</p>}
					{faqsError && <p>Unable to load frequently asked questions.</p>}
					{faqItems.map((faq, i) => (
						<article className={open === i ? 'open' : ''} key={faq.id}>
							<button onClick={() => setOpen(open === i ? -1 : i)}>
								<span>{faq.question}</span>
								<b>{open === i ? '−' : '+'}</b>
							</button>
							{open === i && (
								<div
									className="faq-answer"
									dangerouslySetInnerHTML={{ __html: faq.body }}
								/>
							)}
						</article>
					))}
				</div>
			</section>
			<Cta
				displayProof={true}
				heading="Ready to Get Your Business on Track?"
				text={
					<>
						Book a consultation &amp; Let’s help you start, stay compliant, and
						<br />
						grow with confidence.
					</>
				}
			/>
		</div>
	);
}
export default Home;
