import { cn } from '@/lib/cn';

/** Small label with the square accent bullet: "▪ About Us". */
export function SectionLabel({
	children,
	tone = 'light',
	className,
}: {
	children: React.ReactNode;
	tone?: 'light' | 'dark';
	className?: string;
}) {
	return (
		<p className={cn('label-dot text-sm font-medium tracking-wide', tone === 'dark' ? 'text-white/80' : 'text-ink-soft', className)}>
			{children}
		</p>
	);
}
