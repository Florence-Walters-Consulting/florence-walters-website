'use client';

import { ArrowRight } from 'lucide-react';
import { MotionIcon } from '@/components/ui/MotionIcon';
import { SiteLink } from '@/components/ui/SiteLink';
import { serviceMenu } from './nav-data';

/** Services: the five services as icon cards on a light panel. */
export function ServicesMenu({ onNavigate }: { onNavigate: () => void }) {
	return (
		<div className="border-t border-line bg-white text-ink shadow-lift">
			<div className="page-container py-8">
				<ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
					{serviceMenu.map((s) => (
						<li key={s.name}>
							<SiteLink href={s.href} onClick={onNavigate} data-motion-host className="group flex h-full flex-col rounded-card-sm border border-line bg-mist/60 p-5 transition-colors hover:border-accent/50 hover:bg-mist">
								<MotionIcon name={s.motion} play="hover" size={72} className="-mt-1 -ml-1" />
								<span className="mt-5 block text-[1.0625rem] leading-snug font-bold">{s.name}</span>
								<span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">{s.short}</span>
								<span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-accent-deep">
									Learn more <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
								</span>
							</SiteLink>
						</li>
					))}
				</ul>
				<p className="mt-5 text-sm text-ink-soft">
					Already know what you need? <SiteLink href="/paid-consultation" onClick={onNavigate} className="prose-link font-semibold text-accent-deep">Book a paid consultation →</SiteLink>
				</p>
			</div>
		</div>
	);
}
