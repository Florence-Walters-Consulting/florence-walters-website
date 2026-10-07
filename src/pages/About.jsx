import PageHeader from '@/layouts/PageHeader';
import { useImages } from '@/context/useImages';
import { Link } from 'react-router-dom';
import TeamMembers from '../components/TeamMembers';
import Cta from '@/components/Cta';

const aboutServices = [
	{
		icon: '/img/whatwedo1.svg',
		title: 'Business Formation & Setup',
		text: "Starting a business shouldn't feel like climbing a mountain. We handle registration, structure, licensing, and all the foundational work so your business launches clean and correctly.",
	},
	{
		icon: '/img/whatwedo2.svg',
		title: 'Regulatory Compliance',
		text: 'Regulations shift constantly. We monitor the landscape, keep you informed, and make sure your business is always operating within the law without the stress.',
	},
	{
		icon: '/img/whatwedo3.svg',
		title: 'Financial & Strategic Advisory',
		text: 'Big decisions deserve expert input. From financial strategy to growth planning, we give you the clarity and confidence to move your business in the right direction.',
	},
];

function About() {
	const images = useImages();
	return (
		<div className="page-enter">
			<PageHeader
				title="ABOUT FWC"
				heading="We Were Built for This Continent."
				text="Florence Walters Consulting exists to give African businesses the quality of advisory support that was only once available to the largest corporations."
				image={images['About Header']}
			/>
			<section className="about-origin">
				<div className="about-origin-image">
					<img
						src={images['About 1']}
						alt="African business professionals celebrating success"
					/>
				</div>
				<div className="about-origin-copy">
					<span className="eyebrow eyebrow-with-line">
						BORN FROM A REAL PROBLEM
					</span>
					<h2>Why We Started</h2>
					<p>
						Florence Walters spent over a decade working within Nigeria's
						regulatory and financial ecosystem before founding FWC. She watched
						businesses fail and struggle not because their ideas were bad, but
						because they lacked the right guidance at the right time.
					</p>
					<p>
						Compliance issues that could have been avoided. Business structures
						that created unnecessary tax burdens. Growth opportunities missed
						because of poor strategic planning.
					</p>
					<p>
						So she built FWC focused on simplifying these processes, providing
						clear guidance and practical support every step of the way.
					</p>
				</div>
			</section>
			<section className="about-services">
				<div className="about-services-head">
					<div>
						<span className="eyebrow eyebrow-with-line">WHAT WE DO</span>
						<h2>How We Help Your Business</h2>
					</div>
					<Link to="/services">
						All Services <span>→</span>
					</Link>
				</div>
				<div className="about-services-grid">
					{aboutServices.map((service) => (
						<article key={service.title}>
							<div className="about-service-icon">
								<img src={service.icon} alt="" aria-hidden="true" />
							</div>
							<h3>{service.title}</h3>
							<p>{service.text}</p>
							<Link to="/services">
								Learn More <span>→</span>
							</Link>
						</article>
					))}
				</div>
			</section>
			<section className="about-process">
				<div className="about-process-intro">
					<span className="eyebrow eyebrow-with-line">HOW WE WORK</span>
					<h2>Three simple steps</h2>
					<p>
						Our advisory model is built on three principles that shape every
						engagement we take on.
					</p>
				</div>
				<div className="about-process-grid">
					{[
						[
							'01',
							'Understand First',
							'Before we recommend anything, we take the time to deeply understand your business, your industry, your goals, and your constraints.',
						],
						[
							'02',
							'Advise with Clarity',
							'We translate complex regulatory and financial information into plain language and clear action steps. No jargon. No confusion.',
						],
						[
							'03',
							'Stay in the Room',
							"We don't hand over a report and disappear. We stay engaged through implementation, troubleshoot problems as they arise, & adjust as your situation evolves.",
						],
					].map((step) => (
						<article key={step[0]}>
							<strong>{step[0]}</strong>
							<h3>{step[1]}</h3>
							<p>{step[2]}</p>
						</article>
					))}
				</div>
			</section>
			<section className="about-trust">
				<span className="eyebrow eyebrow-with-line">WHY TRUST US</span>
				<h2>Why Work With Us</h2>
				<div className="about-trust-grid">
					{[
						[
							'/img/whywork1.svg',
							'Clear, Simple Guidance',
							'We break down complex requirements into simple steps, so you always know what to do next.',
						],
						[
							'/img/whywork2.svg',
							'Experienced, Practical Support',
							'We don’t just advise, we provide real, hands-on support based on experience.',
						],
						[
							'/img/whywork3.svg',
							'Tailored to Your Business',
							'Every business is different. We provide solutions that fit your specific needs and goals.',
						],
						[
							'/img/whywork4.svg',
							'Reliable and Responsive',
							'We’re easy to reach, quick to respond, and committed to supporting you when you need it.',
						],
					].map((item) => (
						<article key={item[1]}>
							<div className="about-trust-icon">
								<img src={item[0]} alt="" aria-hidden="true" />
							</div>
							<h3>{item[1]}</h3>
							<p>{item[2]}</p>
						</article>
					))}
				</div>
			</section>
			<TeamMembers />
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

export default About;
