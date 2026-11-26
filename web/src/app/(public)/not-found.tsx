import type { Metadata } from 'next';
import { Award, BookOpen, Briefcase, ClipboardCheck, Compass, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { Scene3D } from '@/components/ui/Scene3D';
import { SiteLink } from '@/components/ui/SiteLink';
import { assessmentHref } from '@/lib/site';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

const places = [
	{ icon: Briefcase, label: 'Our services', value: 'Five services, one team', href: '/services' },
	{ icon: Award, label: 'Work highlights', value: 'Certificates we have secured', href: '/work' },
	{ icon: BookOpen, label: 'Insights', value: 'Guides and commentary', href: '/blog' },
	{ icon: ClipboardCheck, label: 'Free assessment', value: 'See what your business needs', href: assessmentHref() },
];

/** Shown for any URL that does not exist, and when a page calls notFound(). */
export default function NotFound() {
	return (
		<PageHero
			eyebrow="Error 404"
			lines={['We couldn’t find', 'that page.']}
			lead="The page you are looking for does not exist, or it may have moved. Here are some good places to start."
			art={<Scene3D icon={Search} docs={['Page not found', '404']} tiles={[Compass, BookOpen]} />}
			actions={
				<>
					<Button href="/" size="lg">Back to home</Button>
					<Button href="/contact" variant="outline" size="lg" arrow={false}>Contact us</Button>
				</>
			}
			strip={
				<ul className="grid overflow-hidden rounded-card-sm border border-line bg-white shadow-lift sm:grid-cols-2 lg:grid-cols-4">
					{places.map((p, i) => (
						<li key={p.label} className={i > 0 ? 'border-t border-line sm:[&:nth-child(2)]:border-t-0 lg:border-t-0 lg:border-l' : ''}>
							<SiteLink href={p.href} className="group flex items-center gap-4 p-5 transition-colors hover:bg-mist sm:p-6">
								<span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-deep transition-colors group-hover:bg-accent-btn group-hover:text-white"><p.icon className="size-5" strokeWidth={1.75} /></span>
								<span className="min-w-0">
									<span className="block text-xs tracking-wider text-ink-mute uppercase">{p.label}</span>
									<span className="mt-0.5 block text-[0.9375rem]">{p.value}</span>
								</span>
							</SiteLink>
						</li>
					))}
				</ul>
			}
		/>
	);
}
