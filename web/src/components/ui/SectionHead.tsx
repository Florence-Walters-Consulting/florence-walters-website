import { cn } from '@/lib/cn';

/** The site's one section heading: a small label, one heading, one line. The button (if any) goes under it. */
export function SectionHead({
	label,
	title,
	line,
	align = 'left',
	tone = 'light',
	className,
	children,
}: {
	label?: string;
	title: React.ReactNode;
	line?: React.ReactNode;
	align?: 'left' | 'center';
	tone?: 'light' | 'dark';
	className?: string;
	children?: React.ReactNode;
}) {
	const dark = tone === 'dark';
	return (
		<div className={cn(align === 'center' && 'mx-auto text-center', 'max-w-3xl', className)}>
			{label && <p className={cn('label-dot text-sm font-semibold tracking-[0.14em] uppercase', dark ? 'text-accent-soft' : 'text-accent-deep')}>{label}</p>}
			<h2 className={cn('text-title', label && 'mt-4', dark ? 'text-white' : 'text-ink')}>{title}</h2>
			{line && <p className={cn('mt-4 text-lead', align === 'center' && 'mx-auto', 'max-w-2xl', dark ? 'text-white/75' : 'text-ink-soft')}>{line}</p>}
			{children && <div className={cn('mt-7 flex flex-wrap gap-3', align === 'center' && 'justify-center')}>{children}</div>}
		</div>
	);
}
