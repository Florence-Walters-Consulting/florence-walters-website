import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { EnquiryForm } from '@/components/contact/EnquiryForm';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { Scene3D } from '@/components/ui/Scene3D';
import { media } from '@/data/media';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { company, mapsUrl } from '@/lib/site';

export const metadata: Metadata = {
	title: 'Contact',
	description: 'Book a consultation or send an enquiry. Speak with a senior advisor about your organisation’s regulatory and business advisory needs.',
};

const tel = company.phone.replace(/\s/g, '');
const quick = [
	{ icon: Phone, label: 'Call us', value: company.phone, href: `tel:${tel}` },
	{ icon: Mail, label: 'Email us', value: company.email, href: `mailto:${company.email}` },
	{ icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us', href: company.whatsapp, external: true },
	{ icon: MapPin, label: 'Visit us', value: 'Surulere, Lagos', href: mapsUrl, external: true },
];

const row = 'grid grid-cols-[2.75rem_1fr] gap-4 border-t border-line py-6';

export default function Contact() {
	return (
		<>
			<PageHero
				eyebrow="Contact"
				lines={['Talk to us.', 'We reply within a day.']}
				lead="Book a free 15-minute call, send an enquiry, or message us on WhatsApp."
				art={<Scene3D icon={MessageCircle} badge={Phone} docs={['Free 15-min call', 'Your enquiry']} tiles={[Mail, MapPin]} />}
				actions={
					<>
						<Button href="#enquiry" size="lg">Send an enquiry</Button>
						<Button href="/business-assessment" variant="outline" size="lg" arrow={false}>Take the free assessment</Button>
					</>
				}
				strip={
					<ul className="grid overflow-hidden rounded-card-sm border border-line bg-white shadow-lift sm:grid-cols-2 lg:grid-cols-4">
						{quick.map((q, i) => (
							<li key={q.label} className={i > 0 ? 'border-t border-line sm:[&:nth-child(2)]:border-t-0 lg:border-t-0 lg:border-l' : ''}>
								<a href={q.href} {...(q.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group flex items-center gap-4 p-5 transition-colors hover:bg-mist sm:p-6">
									<span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-deep transition-colors group-hover:bg-accent-btn group-hover:text-white"><q.icon className="size-5" strokeWidth={1.75} /></span>
									<span className="min-w-0">
										<span className="block text-xs tracking-wider text-ink-mute uppercase">{q.label}</span>
										<span className="mt-0.5 block text-[0.9375rem] [overflow-wrap:anywhere]">{q.value}</span>
									</span>
								</a>
							</li>
						))}
					</ul>
				}
			/>

			<section id="enquiry" className="section-space">
				<Container className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
					<aside className="lg:sticky lg:top-32 lg:self-start">
						<div className="border-t border-accent-bright/60 pt-6">
							<SectionLabel>Visit or write</SectionLabel>
							<h2 className="mt-6 text-title">How to reach us<span className="stop">.</span></h2>
						</div>

						<Reveal className="relative mt-10 isolate overflow-hidden rounded-card bg-ink-deep text-white">
							<Image src={media.lagos} alt="" fill sizes="(min-width: 1024px) 36vw, 100vw" className="-z-10 object-cover opacity-70" />
							<div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-deep via-ink-deep/55 to-ink-deep/10" />
							<div className="flex min-h-72 flex-col justify-end p-7">
								<p className="label-dot text-xs tracking-[0.18em] text-white/70 uppercase">Office</p>
								<p className="mt-2 text-5xl leading-none font-black">Lagos</p>
								<p className="mt-3 text-white/80">{company.address}, Nigeria</p>
								<a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex w-fit items-center gap-2 border-b border-white/40 pb-0.5 text-sm font-semibold transition-colors hover:border-white">Get directions <ArrowUpRight className="size-4" /></a>
							</div>
						</Reveal>

						<ul className="mt-8">
							<li className={row}>
								<span className="grid size-11 place-items-center rounded-full bg-mist text-accent-deep"><Mail className="size-5" strokeWidth={1.75} /></span>
								<div><p className="text-xs tracking-wider text-ink-mute uppercase">Email</p><a href={`mailto:${company.email}`} className="mt-1 block break-all text-ink hover:text-accent-deep">{company.email}</a></div>
							</li>
							<li className={row}>
								<span className="grid size-11 place-items-center rounded-full bg-mist text-accent-deep"><Phone className="size-5" strokeWidth={1.75} /></span>
								<div><p className="text-xs tracking-wider text-ink-mute uppercase">Telephone</p><a href={`tel:${tel}`} className="mt-1 block text-ink hover:text-accent-deep">{company.phone}</a></div>
							</li>
							<li className={`${row} border-b`}>
								<span className="grid size-11 place-items-center rounded-full bg-mist text-accent-deep"><Clock className="size-5" strokeWidth={1.75} /></span>
								<div><p className="text-xs tracking-wider text-ink-mute uppercase">Office hours</p><p className="mt-1">Monday to Friday, 8:00 AM to 6:00 PM WAT</p></div>
							</li>
						</ul>
						<p className="mt-6 text-sm text-ink-soft">All initial consultations are handled by senior advisors. We typically respond to enquiries within one business day. Urgent matters: within 4 business hours.</p>
					</aside>

					<div>
						<p className="label-dot text-sm font-medium tracking-wide text-ink-soft">Send an enquiry</p>
						<h2 className="mt-4 mb-8 max-w-xl text-heading">Tell us a little about what you need<span className="stop">.</span></h2>
						<EnquiryForm />
					</div>
				</Container>
			</section>
		</>
	);
}
