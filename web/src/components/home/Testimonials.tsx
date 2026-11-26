'use client';

import { Carousel } from '@/components/ui/Carousel';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';

export type Testimonial = { id: number; name: string; occupation: string; body: string; photo: string };

/** Client quotes as cards in a swipeable carousel (6 s, arrows and dots below). */
export function Testimonials({ items }: { items: Testimonial[] }) {
	return (
		<section id="testimonials" className="section-space">
			<Container>
				<SectionHead label="Client voices" title="What our clients say." />
				<Carousel
					className="mt-10"
					label="Client testimonials"
					slideClassName="w-full md:w-1/2"
					slides={items.map((t) => (
						<figure key={t.id} className="h-full rounded-card border border-line bg-white p-7 sm:p-9">
							<blockquote className="text-lg leading-relaxed text-ink">{t.body}</blockquote>
							<figcaption className="mt-6 flex items-center gap-4 border-t border-line pt-5">
								{t.photo ? <img src={t.photo} alt="" loading="lazy" className="size-12 shrink-0 rounded-full object-cover object-[50%_20%]" /> : <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mist text-lg font-black text-accent-deep">{t.name.charAt(0)}</span>}
								<span>
									<span className="block font-bold text-ink">{t.name}</span>
									<span className="block text-sm text-ink-mute">{t.occupation}</span>
								</span>
							</figcaption>
						</figure>
					))}
				/>
			</Container>
		</section>
	);
}
