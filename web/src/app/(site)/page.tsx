import Link from 'next/link';
import SlideShow from '@/components/SlideShow';
import Partners from '@/components/Partners';
import BlogsFeatured from '@/components/BlogsFeatured';
import FaqAccordion from '@/components/FaqAccordion';
import Cta from '@/components/Cta';
import Process from '@/components/Process';
import Arrow from '@/components/Arrow';
import ServiceIcon from '@/components/ServiceIcon';
import { services } from '@/data/services';
import { getFaqs } from '@/db/queries/content';
import { getGeneralImages } from '@/db/queries/general-images';

const icons = ['briefcase', 'shield', 'trend'] as const;

const whyItems = [
	['Clear, Practical Guidance', 'We break down complex processes into simple steps you can actually understand and follow.'],
	['Experienced Support', 'We’ve helped businesses handle setup, compliance, and growth with confidence.'],
	['Tailored to Your Business', 'No one-size-fits-all solutions. Everything we do is built around your specific needs.'],
	['End-to-End Support', 'From starting your business to managing and growing it, we’re with you every step of the way.'],
];

const clientTypes = [
	'Small & Medium Enterprises',
	'Corporates & Multinationals',
	'Fintech Companies',
	'Financial Institutions',
	'NGOs & Development Organisations',
	'Public Sector Bodies',
	'International Investors',
	'Start-ups Seeking Regulatory Clarity',
];

export default async function Home() {
	const [faqs, images] = await Promise.all([getFaqs(), getGeneralImages()]);

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
					<Link href="/services">
						All Services <Arrow />
					</Link>
				</div>
				<div className="service-grid">
					{services.map((service, i) => (
						<article className={i === 1 ? 'service-card-dark' : ''} key={service.slug}>
							<span className="service-icon">
								<ServiceIcon type={icons[i % 3]} />
							</span>
							<small>0{i + 1}</small>
							<h3>{service.heading}</h3>
							<p>{service.preamble}</p>
							{service.ctas ? (
								<div className="service-card-actions">
									{service.ctas.map((cta) => (
										<Link href={cta.to} key={cta.to}>
											{cta.label} <Arrow />
										</Link>
									))}
								</div>
							) : (
								<Link href={`/services/${service.slug}`}>
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
							We&apos;ve worked with startups, SMEs, and enterprise-level businesses. What they all have in
							common: they needed a trusted partner who could speak plainly, act quickly, and deliver results.
							We don’t just advise, we guide you through every step, making things simple and clear.
						</p>
					</div>
					<div className="why-grid">
						{whyItems.map((x, i) => (
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
						Florence Walters Consulting was built from the ground up to serve businesses operating in or
						entering the African market. We&apos;re not a Western firm with an African office, we&apos;re an
						African firm with global standards. Our team has hands-on experience across industries including
						fintech, trade, manufacturing, healthcare, and education giving you the kind of sector-specific
						insight that generalist advisors simply can&apos;t offer.
					</p>
					<p>
						We understand how challenging it can be to start and run a business. From registration to
						compliance and growth, the process can feel overwhelming. That’s why we’re here, to make
						everything simple, clear, and manageable, so you can focus on building your business with
						confidence.
					</p>
					<Link className="fwc-btn dark" href="/about">
						About the Firm <Arrow />
					</Link>
				</div>
				<div className="about-image">
					<img src={images['Home 1']} alt="African business professionals working together" />
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
					{clientTypes.map((clientType) => (
						<span key={clientType}>{clientType}</span>
					))}
				</div>
			</section>
			<BlogsFeatured />
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
					<FaqAccordion faqs={faqs} />
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
