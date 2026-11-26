import { cn } from '@/lib/cn';
import { Container } from './Container';
import { SectionLabel } from './SectionLabel';

type Tone = 'light' | 'dark';

/**
 * The site's core section layout: hairline rules on top, a label/title on the left and the
 * statement plus action on the right. Collapses to one column on mobile.
 */
export function SplitHeader({
	label,
	title,
	children,
	tone = 'light',
	className,
}: {
	label: string;
	title?: React.ReactNode;
	children?: React.ReactNode;
	tone?: Tone;
	className?: string;
}) {
	const dark = tone === 'dark';
	return (
		<Container className={cn('grid gap-x-10 gap-y-8 lg:grid-cols-2', className)}>
			<div className={cn('border-t pt-6', dark ? 'border-accent-soft/60' : 'border-accent-bright/60')}>
				<SectionLabel tone={tone}>{label}</SectionLabel>
				{title && <h2 className="mt-6 max-w-xl text-title">{title}</h2>}
			</div>
			<div className={cn('border-t pt-6', dark ? 'border-white/20' : 'border-line')}>{children}</div>
		</Container>
	);
}

/** SplitHeader wrapped in a padded section (light or dark). */
export function SplitSection({
	id,
	label,
	title,
	children,
	tone = 'light',
	className,
}: {
	id?: string;
	label: string;
	title?: React.ReactNode;
	children: React.ReactNode;
	tone?: Tone;
	className?: string;
}) {
	return (
		<section id={id} className={cn('section-space', tone === 'dark' ? 'bg-ink-deep text-white' : '', className)}>
			<SplitHeader label={label} title={title} tone={tone}>
				{children}
			</SplitHeader>
		</section>
	);
}
