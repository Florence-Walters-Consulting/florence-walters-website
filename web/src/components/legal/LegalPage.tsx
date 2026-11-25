import { Fragment } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Toc } from '@/components/insights/Toc';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { SiteLink } from '@/components/ui/SiteLink';
import { cn } from '@/lib/cn';
import { company } from '@/lib/site';

export type LegalSection = { id: string; title: string; body: React.ReactNode };
type Policy = 'privacy' | 'terms' | 'cookies';

const policies: { key: Policy; label: string; href: string }[] = [
	{ key: 'privacy', label: 'Privacy Policy', href: '/privacy' },
	{ key: 'terms', label: 'Terms of Service', href: '/terms' },
	{ key: 'cookies', label: 'Cookie Policy', href: '/cookies' },
];

/**
 * Shared layout for the legal pages: banner, a sticky "On this page" list that follows the reader,
 * a switcher between the three policies, and the text in the same typography as articles.
 */
export function LegalPage({
	current,
	eyebrow,
	lines,
	lead,
	updated,
	intro,
	sections,
}: {
	current: Policy;
	eyebrow: string;
	lines: string[];
	lead: string;
	updated: string;
	intro: { title: string; text: string };
	sections: LegalSection[];
}) {
	const toc = sections.map((s) => ({ id: s.id, text: s.title, level: 2 as const }));
	return (
		<>
			<PageHero slim eyebrow={eyebrow} lines={lines} lead={lead} />

			<section className="section-space pt-12 lg:pt-16">
				<Container className="grid justify-center gap-x-16 gap-y-8 lg:grid-cols-[15rem_minmax(0,46rem)]">
					<aside className="lg:row-span-2">
						<Toc items={toc} title="On this page" className="hidden lg:block" />
						<details className="rounded-card-sm border border-line bg-white p-4 lg:hidden">
							<summary className="cursor-pointer text-sm font-semibold">On this page</summary>
							<ol className="mt-3 grid gap-2 text-sm">
								{sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="text-ink-soft hover:text-accent-deep">{s.title}</a></li>)}
							</ol>
						</details>
					</aside>

					<div>
						<nav aria-label="Legal pages" className="flex flex-wrap gap-2">
							{policies.map((p) => (
								<SiteLink key={p.key} href={p.href} aria-current={p.key === current ? 'page' : undefined} className={cn('rounded-full border px-4 py-2 text-sm transition-colors', p.key === current ? 'border-ink bg-ink font-semibold text-white' : 'border-line bg-white text-ink-soft hover:border-ink/40 hover:text-ink')}>{p.label}</SiteLink>
							))}
						</nav>

						<div className="mt-8 rounded-card bg-mist p-7 sm:p-9">
							<p className="inline-block rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold tracking-wider text-accent-deep uppercase">Last updated: {updated}</p>
							<h2 className="mt-4 text-[clamp(1.875rem,3vw,2.5rem)] leading-tight">{intro.title}</h2>
							<p className="mt-3 text-lead text-ink-soft">{intro.text}</p>
						</div>

						<div className="article-body legal mt-12">
							{sections.map((s) => (
								<Fragment key={s.id}>
									<h2 id={s.id}>{s.title}</h2>
									{s.body}
								</Fragment>
							))}
						</div>

						<div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-white p-7">
							<div>
								<p className="font-display text-2xl">Questions about this page?</p>
								<p className="mt-1 text-sm text-ink-soft">Write to <a href={`mailto:${company.email}`} className="prose-link">{company.email}</a> and we will respond.</p>
							</div>
							<SiteLink href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold underline decoration-accent-soft underline-offset-4 hover:text-accent-deep">Contact us <ArrowUpRight className="size-4" /></SiteLink>
						</div>
					</div>
				</Container>
			</section>
		</>
	);
}
